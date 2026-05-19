import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000
})

export async function predictCampaign(payload) {
  const response = await api.post('/api/predict', payload)
  console.log('Axios /api/predict response:', response.data)
  return response.data
}

export async function fetchSegmentStats() {
  const response = await api.get('/api/segments/stats')
  console.log('Axios /api/segments/stats response:', response.data)
  return response.data
}

export async function fetchCampaignHistory() {
  const response = await api.get('/api/campaigns/history?limit=20')
  console.log('Axios /api/campaigns/history response:', response.data)
  return response.data
}
