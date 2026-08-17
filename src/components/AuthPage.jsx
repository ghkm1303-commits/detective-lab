import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set persistence once when component mounts
    setPersistence(auth, browserLocalPersistence)
      .catch((err) => console.error('Persistence error:', err));
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !name) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        createdAt: new Date().toISOString(),
        subscriptionStatus: 'free',
        subscriptionExpiry: null
      });

      console.log('User created:', user.uid);
      onAuthSuccess(user);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password too weak (min 6 chars)');
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user.uid);
      onAuthSuccess(user);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Email not found');
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password');
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔬 Detective Lab</h1>
          <p style={styles.subtitle}>Pharmacy Edition</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            {isLogin ? '🔓 Login' : '📝 Create Account'}
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                style={styles.input}
                disabled={loading}
              />
            </div>

            {error && (
              <div style={styles.errorBox}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : (isLogin ? '🔓 Login' : '✅ Create Account')}
            </button>
          </form>

          <div style={styles.toggle}>
            <p style={styles.toggleText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              style={styles.toggleButton}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>ℹ️ What is Detective Lab?</h3>
          <p style={styles.infoText}>
            Master pharmaceutical knowledge through interactive games. Practice different drug identification modes, build your database, and become a pharmaceutical expert.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    zIndex: 10
  },
  content: {
    maxWidth: '500px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '42px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  card: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '20px'
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  errorBox: {
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid var(--danger)',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '15px',
    fontSize: '12px',
    color: 'var(--danger)',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  toggle: {
    textAlign: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(0, 217, 255, 0.1)'
  },
  toggleText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 8px 0'
  },
  toggleButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-gold)',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  infoBox: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '15px'
  },
  infoTitle: {
    fontSize: '12px',
    color: 'var(--accent-gold)',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  infoText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: '0'
  }
};

export default AuthPage;