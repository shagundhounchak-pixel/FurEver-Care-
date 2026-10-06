import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHome from '../components/dashboard/DashboardHome'
import PetProfiles from '../components/dashboard/PetProfiles'
import HealthTracker from '../components/dashboard/HealthTracker'
import PawBot from '../components/dashboard/PawBot'
import AICamera from '../components/dashboard/AICamera'
import Appointments from '../components/dashboard/Appointments'
import Reminders from '../components/dashboard/Reminders'
import '../styles/dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />
      case 'pets':
        return <PetProfiles />
      case 'health':
        return <HealthTracker />
      case 'ai-checkup':
        return <AICamera />
      case 'appointments':
        return <Appointments />
      case 'reminders':
        return <Reminders />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay visible" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          setMobileOpen(false)
        }}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="dashboard-main" style={{
        marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'
      }}>
        {/* Mobile Header */}
        <div style={{ display: 'none' }} className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'flex' }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>home</span>
            Home
          </Link>
        </div>

        {/* Back to Home link */}
        <div style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Home
          </Link>
        </div>

        {renderContent()}
      </main>

      {/* Floating PawBot Chatbot */}
      <PawBot />
    </div>
  )
}

export default Dashboard
