function HealthTracker() {
  const weightData = [
    { month: 'Mar', value: 28, height: '56%' },
    { month: 'Apr', value: 29, height: '64%' },
    { month: 'May', value: 29.5, height: '68%' },
    { month: 'Jun', value: 30, height: '72%' },
    { month: 'Jul', value: 30.2, height: '74%' },
    { month: 'Aug', value: 30, height: '72%' },
  ]

  const vaccinations = [
    { name: 'Rabies', date: 'Jan 15, 2026', status: 'current', next: 'Jan 15, 2027' },
    { name: 'DHPP', date: 'Mar 10, 2026', status: 'current', next: 'Mar 10, 2027' },
    { name: 'Bordetella', date: 'Jun 20, 2026', status: 'current', next: 'Dec 20, 2026' },
    { name: 'Lyme Disease', date: 'Apr 5, 2025', status: 'due-soon', next: 'Oct 5, 2026' },
  ]

  const medications = [
    { name: 'Heartgard Plus', frequency: 'Monthly', nextDose: 'Sept 1, 2026', icon: 'medication' },
    { name: 'NexGard (Flea/Tick)', frequency: 'Monthly', nextDose: 'Sept 1, 2026', icon: 'bug_report' },
    { name: 'Joint Supplement', frequency: 'Daily', nextDose: 'Tomorrow', icon: 'local_pharmacy' },
  ]

  return (
    <div className="page-content">
      <div className="section-header">
        <h2>❤️ Health Tracker — Buddy</h2>
        <button className="btn btn-secondary btn-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>swap_horiz</span>
          Switch Pet
        </button>
      </div>

      <div className="health-overview">
        {/* Health Score */}
        <div className="health-score-card">
          <h3 style={{ marginBottom: '16px' }}>Overall Health Score</h3>
          <div className="health-ring">
            <svg viewBox="0 0 140 140">
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4ECDC4' }} />
                  <stop offset="100%" style={{ stopColor: '#FF6B6B' }} />
                </linearGradient>
              </defs>
              <circle className="ring-bg" cx="70" cy="70" r="65" />
              <circle className="ring-fill" cx="70" cy="70" r="65"
                style={{ strokeDashoffset: 408 - (408 * 92 / 100) }} />
            </svg>
            <div className="ring-value">
              <span>92</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="health-metrics">
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>monitor_weight</span>
              <div className="health-metric-info">
                <h4>Weight</h4>
                <p>30 kg — Normal</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>favorite</span>
              <div className="health-metric-info">
                <h4>Heart Rate</h4>
                <p>80 bpm — Healthy</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>directions_walk</span>
              <div className="health-metric-info">
                <h4>Activity</h4>
                <p>45 min/day avg</p>
              </div>
            </div>
            <div className="health-metric">
              <span className="material-symbols-outlined" style={{ color: '#A78BFA' }}>vaccines</span>
              <div className="health-metric-info">
                <h4>Vaccines</h4>
                <p>All up to date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="weight-chart">
          <div className="widget-header">
            <h3>📊 Weight Trend</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Last 6 months</span>
          </div>
          <div className="chart-container">
            {weightData.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-value">{data.value}kg</div>
                <div className="chart-bar" style={{ height: data.height }} />
                <div className="chart-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccination Status */}
      <div className="widget" style={{ marginBottom: '24px' }}>
        <div className="widget-header">
          <h3>💉 Vaccination Status</h3>
          <button className="btn btn-secondary btn-sm">Add Record</button>
        </div>
        <div className="appointments-list">
          {vaccinations.map((vax, index) => (
            <div key={index} className="appointment-card">
              <div className="appointment-date" style={{
                background: vax.status === 'current' ? 'rgba(78, 205, 196, 0.12)' : 'rgba(255, 179, 71, 0.12)',
              }}>
                <span className="material-symbols-outlined" style={{
                  color: vax.status === 'current' ? 'var(--secondary)' : 'var(--accent)',
                  fontSize: '28px'
                }}>
                  {vax.status === 'current' ? 'verified' : 'schedule'}
                </span>
              </div>
              <div className="appointment-info">
                <h4>{vax.name}</h4>
                <p>Last: {vax.date} · Next: {vax.next}</p>
              </div>
              <span className={`appointment-status ${vax.status === 'current' ? 'upcoming' : 'cancelled'}`}>
                {vax.status === 'current' ? 'Current' : 'Due Soon'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="widget">
        <div className="widget-header">
          <h3>💊 Current Medications</h3>
          <button className="btn btn-secondary btn-sm">Add Medication</button>
        </div>
        <div className="appointments-list">
          {medications.map((med, index) => (
            <div key={index} className="appointment-card">
              <div className="appointment-date" style={{ background: 'rgba(167, 139, 250, 0.12)' }}>
                <span className="material-symbols-outlined" style={{ color: '#A78BFA', fontSize: '28px' }}>
                  {med.icon}
                </span>
              </div>
              <div className="appointment-info">
                <h4>{med.name}</h4>
                <p>{med.frequency} · Next dose: {med.nextDose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HealthTracker
