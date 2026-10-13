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
import ScrollProgressBar from '../components/shared/ScrollProgressBar'
import '../styles/dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [initialModal, setInitialModal] = useState(null)

  const handleAction = (action) => {
    if (action === 'add-pet') {
      setActiveTab('pets')
      setInitialModal('add-pet')
    } else if (action === 'schedule-visit') {
      setActiveTab('appointments')
      setInitialModal('new-appointment')
    } else if (action === 'log-activity') {
      setActiveTab('health')
      setInitialModal('add-record')
    } else if (action === 'view-appointments') {
      setActiveTab('appointments')
    } else if (action === 'view-reminders') {
      setActiveTab('reminders')
    } else if (action === 'view-pets') {
      setActiveTab('pets')
    } else if (action === 'view-health') {
      setActiveTab('health')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome
            setActiveTab={setActiveTab}
            onAction={handleAction}
          />
        )
      case 'pets':
        return (
          <PetProfiles
            initialOpenModal={initialModal === 'add-pet'}
            onModalClosed={() => setInitialModal(null)}
          />
        )
      case 'health':
        return (
          <HealthTracker
            initialOpenModal={initialModal === 'add-record'}
            onModalClosed={() => setInitialModal(null)}
            setActiveTab={setActiveTab}
          />
        )
      case 'ai-checkup':
        return <AICamera />
      case 'appointments':
        return (
          <Appointments
            initialOpenModal={initialModal === 'new-appointment'}
            onModalClosed={() => setInitialModal(null)}
            setActiveTab={setActiveTab}
          />
        )
      case 'reminders':
        return (
          <Reminders
            initialOpenModal={initialModal === 'add-reminder'}
            onModalClosed={() => setInitialModal(null)}
          />
        )
      default:
        return (
          <DashboardHome
            setActiveTab={setActiveTab}
            onAction={handleAction}
          />
        )
    }
  }

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <ScrollProgressBar />

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
