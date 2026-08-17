import React, { useState } from 'react';

const AdminPanel = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [specialty, setSpecialty] = useState('pharmacology');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [apiKey, setApiKey] = useState('test-key-local');

  const FIREBASE_URL = 'http://localhost:5001/medical-game133003/us-central1';

  // Generate drugs
  const handleGenerate = async () => {
    if (!apiKey) {
      setMessage('❌ Please enter API Key');
      return;
    }

    setLoading(true);
    setMessage('🤖 Generating drugs...');

    try {
      const url = `${FIREBASE_URL}/generateDrugsHTTP?specialty=${specialty}&count=${count}&apiKey=${apiKey}`;
      console.log('Calling:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('Response:', data);

      if (response.ok) {
        setMessage(`✅ Generated ${data.count} ${specialty} items!`);
        await fetchLogs();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const url = `${FIREBASE_URL}/getGenerationLogs?apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back</button>

      <h1 style={styles.title}>⚙️ Admin Panel - AI Drug Generator</h1>

      <div style={styles.apiKeySection}>
        <input
          type="password"
          placeholder="Enter Admin API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={styles.apiKeyInput}
        />
      </div>

      {/* TABS */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'generate' ? '3px solid var(--accent-gold)' : '1px solid rgba(0,217,255,0.2)'
          }}
          onClick={() => setActiveTab('generate')}
        >
          🤖 Generate
        </button>
        <button
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'logs' ? '3px solid var(--accent-gold)' : '1px solid rgba(0,217,255,0.2)'
          }}
          onClick={() => setActiveTab('logs')}
        >
          📊 Logs
        </button>
        <button
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'schedule' ? '3px solid var(--accent-gold)' : '1px solid rgba(0,217,255,0.2)'
          }}
          onClick={() => setActiveTab('schedule')}
        >
          ⏰ Schedule
        </button>
      </div>

      {/* GENERATE TAB */}
      {activeTab === 'generate' && (
        <div style={styles.tabContent}>
          <h2 style={styles.sectionTitle}>Generate New Content</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Specialty:</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              style={styles.select}
            >
              <option value="pharmacology">🔬 Pharmacology (Drugs)</option>
              <option value="pharmacognosy">🌿 Pharmacognosy (Plants)</option>
              <option value="parasitology">🦠 Parasitology (Parasites)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Number of Items:</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              min="1"
              max="50"
              style={styles.input}
            />
            <small style={styles.small}>For testing: 5 is good</small>
          </div>

          <button
            style={{
              ...styles.generateButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate'}
          </button>

          {message && (
            <div style={{
              ...styles.messageBox,
              backgroundColor: message.includes('✅') ? 'rgba(0, 208, 132, 0.1)' : 'rgba(255, 71, 87, 0.1)',
              borderColor: message.includes('✅') ? 'var(--accent-emerald)' : 'var(--danger)',
              color: message.includes('✅') ? 'var(--accent-emerald)' : 'var(--danger)'
            }}>
              {message}
            </div>
          )}

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>ℹ️ How It Works:</h3>
            <ul style={styles.infoList}>
              <li>Select specialty (Pharmacology, Pharmacognosy, or Parasitology)</li>
              <li>Choose how many items to generate (1-50)</li>
              <li>Click Generate</li>
              <li>AI creates unique, medically-accurate content</li>
              <li>Data auto-saves to Firestore</li>
              <li>Game immediately has access to new content</li>
            </ul>
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === 'logs' && (
        <div style={styles.tabContent}>
          <h2 style={styles.sectionTitle}>Generation Logs</h2>

          <button
            style={styles.refreshButton}
            onClick={fetchLogs}
          >
            🔄 Refresh
          </button>

          <div style={styles.logsContainer}>
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} style={styles.logItem}>
                  <div style={styles.logHeader}>
                    <span style={styles.logSpecialty}>{log.specialty}</span>
                    <span style={{
                      ...styles.logStatus,
                      color: log.status === 'success' ? 'var(--accent-emerald)' : 'var(--danger)'
                    }}>
                      {log.status === 'success' ? '✅' : '❌'} {log.status}
                    </span>
                  </div>
                  {log.count && <div style={styles.logDetail}>Count: {log.count}</div>}
                  {log.error && <div style={styles.logError}>Error: {log.error}</div>}
                  <div style={styles.logTime}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noLogs}>No logs yet. Generate some content!</div>
            )}
          </div>
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === 'schedule' && (
        <div style={styles.tabContent}>
          <h2 style={styles.sectionTitle}>Automatic Generation Schedule</h2>

          <div style={styles.scheduleInfo}>
            <h3 style={styles.scheduleTitle}>📅 Current Setup (After Deploy):</h3>
            <div style={styles.scheduleItem}>
              <strong>Frequency:</strong> Every Monday at 9:00 AM UTC
            </div>
            <div style={styles.scheduleItem}>
              <strong>Rotation:</strong>
              <ul style={styles.scheduleList}>
                <li>Week 1: Pharmacology (20 drugs)</li>
                <li>Week 2: Pharmacognosy (20 plants)</li>
                <li>Week 3: Parasitology (20 parasites)</li>
                <li>Week 4: Back to Pharmacology...</li>
              </ul>
            </div>
            <div style={styles.scheduleItem}>
              <strong>Benefit:</strong> Database grows automatically without manual work!
            </div>
          </div>

          <div style={styles.setupBox}>
            <h3 style={styles.setupTitle}>🔧 To Enable Auto-Generation (When Going Live):</h3>
            <ol style={styles.setupList}>
              <li>Deploy Cloud Functions: <code>firebase deploy --only functions</code></li>
              <li>Set environment variable: <code>ADMIN_API_KEY=your-secret-key</code></li>
              <li>Deploy again</li>
              <li>Scheduler runs automatically every Monday at 9:00 AM UTC</li>
            </ol>
          </div>

          <div style={styles.noteBox}>
            <strong>📝 Note:</strong> For now, you're testing locally. When ready to deploy, just run the firebase deploy command!
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 20px 0'
  },
  apiKeySection: {
    maxWidth: '600px',
    margin: '0 auto 20px',
    textAlign: 'center'
  },
  apiKeyInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  tabsContainer: {
    maxWidth: '600px',
    margin: '0 auto 20px',
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  tabContent: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '20px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    color: 'var(--accent-gold)',
    margin: '0 0 15px 0'
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
  select: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  input: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  small: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    display: 'block'
  },
  generateButton: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  messageBox: {
    marginTop: '15px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '12px',
    textAlign: 'center'
  },
  infoBox: {
    marginTop: '20px',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '6px',
    border: '1px solid rgba(0, 217, 255, 0.2)'
  },
  infoTitle: {
    fontSize: '12px',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0',
    fontWeight: '700'
  },
  infoList: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: 0,
    paddingLeft: '20px',
    lineHeight: '1.6'
  },
  logsContainer: {
    marginTop: '15px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  logItem: {
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '11px'
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px'
  },
  logSpecialty: {
    color: 'var(--accent-gold)',
    fontWeight: '700'
  },
  logStatus: {
    fontWeight: '700'
  },
  logDetail: {
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  },
  logError: {
    color: 'var(--danger)',
    marginBottom: '4px'
  },
  logTime: {
    color: 'var(--text-secondary)',
    fontSize: '10px'
  },
  noLogs: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '20px'
  },
  refreshButton: {
    padding: '10px 20px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  scheduleInfo: {
    background: 'rgba(0, 217, 255, 0.05)',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  scheduleTitle: {
    fontSize: '12px',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0',
    fontWeight: '700'
  },
  scheduleItem: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  scheduleList: {
    fontSize: '11px',
    marginTop: '4px',
    marginBottom: 0,
    paddingLeft: '20px'
  },
  setupBox: {
    background: 'rgba(212, 175, 55, 0.05)',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  setupTitle: {
    fontSize: '12px',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0',
    fontWeight: '700'
  },
  setupList: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    paddingLeft: '20px',
    lineHeight: '1.6'
  },
  noteBox: {
    background: 'rgba(0, 208, 132, 0.05)',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '11px',
    color: 'var(--accent-emerald)',
    border: '1px solid rgba(0, 208, 132, 0.2)'
  }
};

export default AdminPanel;