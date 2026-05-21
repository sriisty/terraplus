import axios from 'axios'

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname
    return `${window.location.protocol}//${host}:8000`
  }
  return 'http://127.0.0.1:8000'
}

export const API_BASE_URL = getApiBaseUrl()

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
})

function describeError(err, fallback) {
  if (err?.response?.data?.detail) {
    const detail = err.response.data.detail
    return typeof detail === 'string' ? detail : JSON.stringify(detail)
  }
  if (err?.code === 'ERR_NETWORK') {
    return `Cannot reach backend at ${API_BASE_URL}. Is uvicorn running?`
  }
  if (err?.code === 'ECONNABORTED') {
    return 'Backend timed out. The model may be cold-starting; try again.'
  }
  return err?.message || fallback
}

export async function predictCampaign(payload) {
  try {
    const { data } = await api.post('/api/predict', payload)
    console.log('Axios /api/predict response:', data)
    return data
  } catch (err) {
    throw new Error(describeError(err, 'Prediction failed'))
  }
}

export async function fetchSegmentStats() {
  try {
    const { data } = await api.get('/api/segments/stats')
    console.log('Axios /api/segments/stats response:', data)
    return Array.isArray(data) ? data : []
  } catch (err) {
    throw new Error(describeError(err, 'Failed to load segment stats'))
  }
}

export async function fetchCampaignHistory(limit = 20, grower_id = null) {
  try {
    const params = { limit }
    if (grower_id) {
      params.grower_id = grower_id
    }
    const { data } = await api.get('/api/campaigns/history', { params })
    console.log('Axios /api/campaigns/history response:', data)
    return Array.isArray(data) ? data : []
  } catch (err) {
    throw new Error(describeError(err, 'Failed to load campaign history'))
  }
}

export function resolveMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // The backend audio_service returns paths like "/audio/file.mp3".
  // If a bare filename is passed (no leading slash), prepend "/audio/".
  let cleanPath = path
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/audio/${cleanPath}`
  }
  return `${API_BASE_URL}${cleanPath}`
}

export async function fetchCampaignMetrics() {
  const response = await api.get('/api/campaigns/metrics')
  console.log('Axios /api/campaigns/metrics response:', response.data)
  return response.data
}

export async function recordCampaignClick(campaignId, clicked = true) {
  try {
    const { data } = await api.patch(`/api/campaigns/${campaignId}/clicked`, null, {
      params: { clicked }
    })
    console.log('Axios PATCH clicked response:', data)
    return data
  } catch (err) {
    throw new Error(describeError(err, 'Failed to record campaign click'))
  }
}

export async function upsertFarmer(profile) {
  try {
    const { data } = await api.post('/api/farmers', profile)
    console.log('Axios POST /api/farmers response:', data)
    return data
  } catch (err) {
    throw new Error(describeError(err, 'Failed to upsert farmer profile'))
  }
}

export async function fetchFarmerProfile(growerId) {
  try {
    const { data } = await api.get(`/api/farmers/${growerId}`)
    console.log('Axios GET /api/farmers/:growerId response:', data)
    return data
  } catch (err) {
    throw new Error(describeError(err, 'Failed to fetch farmer profile'))
  }
}

export async function fetchDashboardStats() {
  try {
    const { data } = await api.get('/api/dashboard/stats')
    console.log('Axios GET /api/dashboard/stats response:', data)
    return data
  } catch (err) {
    throw new Error(describeError(err, 'Failed to load dashboard stats'))
  }
}

