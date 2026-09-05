import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export async function getSubscriptionStatus(uid) {
  try {
    const ref = doc(db, 'subscriptions', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { status: 'none' };

    const data = snap.data();
    const now = Date.now();

    if (data.status === 'active' && data.expiresAt && data.expiresAt > now) {
      return { status: 'active', expiresAt: data.expiresAt, plan: data.plan };
    }
    if (data.status === 'pending') {
      return { status: 'pending', submittedAt: data.submittedAt, plan: data.plan };
    }
    return { status: 'none' };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { status: 'none' };
  }
}

// Called when the player clicks "I've sent the payment"
export async function submitPaymentConfirmation(uid, userName, plan) {
  try {
    const ref = doc(db, 'subscriptions', uid);
    await setDoc(ref, {
      status: 'pending',
      userName,
      plan: plan.id,
      durationDays: plan.durationDays,
      price: plan.price,
      submittedAt: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting payment confirmation:', error);
    return { success: false };
  }
}

// You call this MANUALLY (via Firebase console, editing the document directly,
// or a small admin script) once you've verified the BaridiMob transfer.
export async function approveSubscription(uid) {
  try {
    const ref = doc(db, 'subscriptions', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { success: false };

    const data = snap.data();
    const now = Date.now();
    const durationMs = (data.durationDays || 30) * 24 * 60 * 60 * 1000;

    await setDoc(ref, {
      ...data,
      status: 'active',
      activatedAt: now,
      expiresAt: now + durationMs
    });

    return { success: true };
  } catch (error) {
    console.error('Error approving subscription:', error);
    return { success: false };
  }
}