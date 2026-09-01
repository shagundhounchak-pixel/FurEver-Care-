function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const navItems = [
    { id: 'home', icon: 'dashboard', label: 'Dashboard' },
    { id: 'pets', icon: 'pets', label: 'My Pets' },
    { id: 'health', icon: 'monitor_heart', label: 'Health' },
    { id: 'appointments', icon: 'calendar_month', label: 'Appointments' },
    { id: 'reminders', icon: 'notifications', label: 'Reminders' },
  ]

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
          <div className="sidebar-user-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Alex Johnson</div>
            <div className="sidebar-user-email">alex@email.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
