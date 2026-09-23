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

export async function fetchPendingSubscriptions() {
  const q = query(
    collection(db, 'subscriptions'),
    where('status', '==', 'pending'),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}