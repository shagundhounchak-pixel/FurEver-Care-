import { useState, useRef, useEffect } from 'react'
import { pawbotAPI } from '../../services/api'

function PawBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm PawBot 🐾. How can I help you and your furry friend today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    const newMessages = [...messages, { role: 'user', text: userMessage }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await pawbotAPI.chat(userMessage, messages.slice(1)) // exclude initial greeting
      if (response.success) {
        setMessages([...newMessages, { role: 'model', text: response.reply }])
      } else {
        setMessages([...newMessages, { role: 'model', text: 'Oops! Something went wrong.' }])
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'model', text: 'Sorry, I am having trouble connecting right now.' }])
    } finally {
      setLoading(false)
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--primary)', color: 'white', border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px', zIndex: 1000,
          width: '350px', height: '500px', borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary)', color: 'white', padding: '16px',
            display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>smart_toy</span>
            PawBot Assistant
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--primary)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                maxWidth: '80%', fontSize: '0.9rem', lineHeight: '1.4',
                boxShadow: msg.role === 'model' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                border: msg.role === 'model' ? '1px solid var(--border)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: '18px' }}>progress_activity</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '12px', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask PawBot..."
              style={{
                flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default PawBot
