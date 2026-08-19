import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import ThemeToggle from './ThemeToggle';

const AuthPage = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('detective-lab-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('detective-lab-theme', newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError('Please enter a username');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await userCredential.user.updateProfile({ displayName });
        onAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.themeToggleContainer}>
        <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🔬 Detective Lab</h1>
        <p style={styles.subtitle}>
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </p>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {isSignUp && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your username"
                  style={styles.input}
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
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <button
            style={styles.toggleButton}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
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
  themeToggleContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px'
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
  },
  title: {
    marginBottom: '10px',
    fontSize: '40px'
  },
  subtitle: {
    color: 'var(--text-primary)',
    marginBottom: '30px',
    fontSize: '16px'
  },
  card: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '30px',
    transition: 'all 0.3s ease'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px'
  },
  formGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '8px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: 'rgba(47, 125, 91, 0.05)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    padding: '12px',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease'
  },
  toggleButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-emerald)',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'underline'
  },
  error: {
    color: '#E63946',
    fontSize: '12px',
    textAlign: 'center'
  }
};

export default AuthPage;