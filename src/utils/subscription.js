import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Statuts possibles : 'none' (aucune demande) | 'pending' | 'active' | 'denied' | 'error'
export async function getAccessStatus(uid) {
  try {
    const snap = await getDoc(doc(db, 'subscriptions', uid));
    if (!snap.exists()) return { status: 'none' };
    const status = snap.data().status;
    if (status === 'active' || status === 'denied') return { status };
    return { status: 'pending' };
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

// Appelées depuis le panneau admin (réservées à ton compte par les règles Firestore)
export async function grantAccess(uid) {
  try {
    await updateDoc(doc(db, 'subscriptions', uid), {
      status: 'active',
      reviewedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error granting access:', error);
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