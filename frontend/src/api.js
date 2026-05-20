import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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

export async function fetchCampaignHistory(limit = 20) {
  try {
    const { data } = await api.get('/api/campaigns/history', { params: { limit } })
    console.log('Axios /api/campaigns/history response:', data)
    return Array.isArray(data) ? data : []
  } catch (err) {
    throw new Error(describeError(err, 'Failed to load campaign history'))
  }
}

export function resolveMediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
