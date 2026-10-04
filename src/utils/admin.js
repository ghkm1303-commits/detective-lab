import { db } from '../firebase-config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// ⚠️ Remplace par TON adresse email exacte — seul ce compte aura accès au panneau admin
export const ADMIN_EMAIL = 'detectivelabstudios@gmail.com';

export function isAdmin(user) {
  return !!user && user.email === ADMIN_EMAIL;
}

export async function fetchFeatureRequests() {
  const q = query(collection(db, 'featureRequests'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Demandes d'accès en attente (tri côté client : évite un index composite Firestore)
export async function fetchPendingSubscriptions() {
  const q = query(
    collection(db, 'subscriptions'),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ uid: doc.id, ...doc.data() }))
    .sort((a, b) => (b.requestedAt || b.submittedAt || 0) - (a.requestedAt || a.submittedAt || 0));
}

// Tous les membres déjà traités : actifs (ou expirés), suspendus, refusés
export async function fetchMembers() {
  const q = query(
    collection(db, 'subscriptions'),
    where('status', 'in', ['active', 'suspended', 'denied'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ uid: doc.id, ...doc.data() }))
    .sort((a, b) => (b.activatedAt || b.reviewedAt || 0) - (a.activatedAt || a.reviewedAt || 0));
}