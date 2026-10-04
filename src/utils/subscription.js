import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const DAY_MS = 24 * 60 * 60 * 1000;

// Durée de chaque formule en jours (null = accès sans expiration)
export const PLANS = {
  monthly: { days: 30 },
  yearly: { days: 365 },
  free: { days: null }
};

// Code court à écrire dans la note du virement BaridiMob (unique par joueur, contrairement au nom)
export function getReference(uid) {
  return uid.slice(0, 6).toUpperCase();
}

// Statuts possibles : 'none' | 'pending' | 'active' | 'expired' | 'suspended' | 'denied' | 'error'
export async function getAccessStatus(uid) {
  try {
    const snap = await getDoc(doc(db, 'subscriptions', uid));
    if (!snap.exists()) return { status: 'none' };
    const data = snap.data();
    const extra = {
      requestedPlan: data.requestedPlan || null,
      paymentSent: !!data.paymentSentAt
    };

    if (data.status === 'active') {
      if (data.expiresAt && data.expiresAt <= Date.now()) {
        return { status: 'expired', plan: data.plan, expiresAt: data.expiresAt, ...extra };
      }
      return { status: 'active', plan: data.plan, expiresAt: data.expiresAt || null, ...extra };
    }
    if (data.status === 'denied' || data.status === 'suspended') {
      return { status: data.status, ...extra };
    }
    return { status: 'pending', ...extra };
  } catch (error) {
    console.error('Error checking access:', error);
    return { status: 'error' };
  }
}

// Appelée automatiquement quand un nouveau compte se connecte pour la première fois
export async function requestAccess(uid, userName, email) {
  try {
    await setDoc(doc(db, 'subscriptions', uid), {
      status: 'pending',
      userName,
      email,
      requestedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error requesting access:', error);
    return { success: false };
  }
}

// Appelée quand le joueur clique sur "J'ai envoyé le paiement" : ne change PAS le statut,
// elle signale seulement à l'admin la formule choisie et le code de référence.
export async function submitPaymentConfirmation(uid, planId) {
  try {
    if (planId !== 'monthly' && planId !== 'yearly') return { success: false };
    await updateDoc(doc(db, 'subscriptions', uid), {
      requestedPlan: planId,
      paymentSentAt: Date.now(),
      reference: getReference(uid)
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting payment confirmation:', error);
    return { success: false };
  }
}

// Donne l'accès (ou le redonne / le renouvelle) pour une formule : 'monthly' | 'yearly' | 'free'.
// Si l'abonnement est encore actif, la nouvelle durée s'ajoute à la date d'expiration actuelle.
// Sinon, elle démarre à partir d'aujourd'hui. Le compte et la progression ne sont jamais touchés.
export async function grantAccess(uid, planId = 'monthly') {
  try {
    const plan = PLANS[planId];
    if (!plan) return { success: false };

    const ref = doc(db, 'subscriptions', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { success: false };

    const data = snap.data();
    const now = Date.now();
    const stillActive = data.status === 'active' && (!data.expiresAt || data.expiresAt > now);
    const base = stillActive && data.expiresAt ? data.expiresAt : now;

    await updateDoc(ref, {
      status: 'active',
      plan: planId,
      activatedAt: stillActive && data.activatedAt ? data.activatedAt : now,
      firstActivatedAt: data.firstActivatedAt || now,
      expiresAt: plan.days ? base + plan.days * DAY_MS : null,
      lastRenewedAt: now,
      reviewedAt: now,
      suspendedAt: null,
      paymentSentAt: null,
      requestedPlan: null
    });
    return { success: true };
  } catch (error) {
    console.error('Error granting access:', error);
    return { success: false };
  }
}

// Coupe l'accès sans supprimer le compte ni la progression
export async function suspendAccess(uid) {
  try {
    await updateDoc(doc(db, 'subscriptions', uid), {
      status: 'suspended',
      suspendedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error suspending access:', error);
    return { success: false };
  }
}

export async function denyAccess(uid) {
  try {
    await updateDoc(doc(db, 'subscriptions', uid), {
      status: 'denied',
      reviewedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error denying access:', error);
    return { success: false };
  }
}