import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function submitFeatureRequest({ name, message }) {
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }
  await addDoc(collection(db, 'featureRequests'), {
    name: name?.trim() || 'Anonyme',
    message: message.trim(),
    createdAt: serverTimestamp()
  });
}