import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', icon: 'dashboard', label: 'Dashboard' },
    { id: 'pets', icon: 'pets', label: 'My Pets' },
    { id: 'health', icon: 'monitor_heart', label: 'Health' },
    { id: 'ai-checkup', icon: 'photo_camera', label: 'AI Diagnosis' },
    { id: 'appointments', icon: 'calendar_month', label: 'Appointments' },
    { id: 'reminders', icon: 'notifications', label: 'Reminders' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayName = user?.name || 'User'
  const displayEmail = user?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="material-symbols-outlined">pets</span>
          <span className="sidebar-logo-text">FurEver Care</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-email">{displayEmail}</div>
          </div>
        </div>
        {!collapsed && (
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '8px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              background: 'none',
              color: 'var(--text-light)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--primary)'; e.target.style.borderColor = 'var(--primary)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-light)'; e.target.style.borderColor = 'var(--border)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Sign Out
          </button>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
