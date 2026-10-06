const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Generic request handler
const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  const config = {
    headers: getHeaders(),
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      // If unauthorized, clear token
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    throw error
  }
}

// ─── Auth ────────────────────────────────────
export const authAPI = {
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  getMe: () =>
    request('/auth/me'),

  logout: () =>
    request('/auth/logout', { method: 'POST' })
}

// ─── Pets ────────────────────────────────────
export const petsAPI = {
  getAll: () =>
    request('/pets'),

  getById: (id) =>
    request(`/pets/${id}`),

  create: (petData) =>
    request('/pets', { method: 'POST', body: JSON.stringify(petData) }),

  update: (id, petData) =>
    request(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(petData) }),

  delete: (id) =>
    request(`/pets/${id}`, { method: 'DELETE' })
}

// ─── Vaccinations ────────────────────────────
export const vaccinationsAPI = {
  getAll: (petId) =>
    request(`/vaccinations${petId ? `?petId=${petId}` : ''}`),

  create: (data) =>
    request('/vaccinations', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/vaccinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/vaccinations/${id}`, { method: 'DELETE' })
}

// ─── Appointments ────────────────────────────
export const appointmentsAPI = {
  getAll: () =>
    request('/appointments'),

  create: (data) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  cancel: (id) =>
    request(`/appointments/${id}`, { method: 'DELETE' })
}

// ─── Veterinarians ───────────────────────────
export const veterinariansAPI = {
  getAll: () =>
    request('/veterinarians'),

  getById: (id) =>
    request(`/veterinarians/${id}`)
}

// ─── Dashboard ───────────────────────────────
export const dashboardAPI = {
  get: () =>
    request('/dashboard')
}

// ─── Reminders ───────────────────────────────
export const remindersAPI = {
  getAll: (category) =>
    request(`/reminders${category && category !== 'all' ? `?category=${category}` : ''}`),

  create: (data) =>
    request('/reminders', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  toggle: (id) =>
    request(`/reminders/${id}/toggle`, { method: 'PATCH' }),

  delete: (id) =>
    request(`/reminders/${id}`, { method: 'DELETE' })
}

// ─── Health Check (AI) ───────────────────────
export const healthCheckAPI = {
  analyze: (imageBase64) =>
    request('/health-check/analyze', { method: 'POST', body: JSON.stringify({ imageBase64 }) })
}
