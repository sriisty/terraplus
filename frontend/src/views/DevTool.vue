<template>
  <main class="shell">
    <section class="topbar">
      <div>
        <p class="eyebrow">Syngenta Track 1</p>
        <h1>Adaptive Agricultural Campaign Intelligence</h1>
      </div>
      <button class="ghost" @click="loadAnalytics" :disabled="loadingAnalytics">
        <RefreshCw size="18" />
        Refresh metrics
      </button>
    </section>

    <section class="workspace">
      <form class="panel form" @submit.prevent="submit">
        <div class="panel-head">
          <Sprout size="20" />
          <h2>Farmer context</h2>
        </div>

        <div class="grid two">
          <label>Farmer name<input v-model="farmerName" /></label>
          <label>Grower ID<input v-model="form.grower_id" /></label>
          <label>State<input v-model="form.state" /></label>
          <label>District<input v-model="form.district" /></label>
          <label>Tehsil / block<input v-model="form.tehsil_block" /></label>
          <label>Language
            <select v-model="form.language">
              <option value="">Infer from region</option>
              <option>Hindi</option><option>Tamil</option><option>Telugu</option>
              <option>Marathi</option><option>Punjabi</option><option>English</option>
            </select>
          </label>
          <label>Crop<input v-model="form.main_crop" /></label>
          <label>Product<input v-model="form.campaign_product" /></label>
          <label>Pest / disease threat<input v-model="form.pest_threat" /></label>
          <label>Weather risk<input v-model="form.weather_risk" /></label>
          <label>Device
            <select v-model="form.device_type">
              <option>smartphone</option><option>keypad_phone</option><option>feature_phone</option>
            </select>
          </label>
          <label>Connectivity
            <select v-model="form.connectivity">
              <option>good</option><option>weak</option><option>offline</option>
            </select>
          </label>
          <label>Literacy
            <select v-model="form.literacy_level">
              <option>medium</option><option>low</option><option>high</option>
            </select>
          </label>
          <label>Farm size acres<input v-model.number="form.grower_farm_size" type="number" min="0" step="0.1" /></label>
        </div>

        <label class="check">
          <input v-model="form.high_value_farmer" type="checkbox" />
          High-value farmer: add voice follow-up
        </label>

        <button class="primary" :disabled="loading">
          <Send size="18" />
          {{ loading ? 'Generating campaign...' : 'Generate campaign' }}
        </button>
      </form>

      <section class="results">
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="result" class="score-band">
          <div>
            <p class="eyebrow">Engagement probability</p>
            <strong>{{ percent(result.prediction.engagement_probability) }}</strong>
            <span>{{ result.prediction.segment }} segment</span>
          </div>
          <div>
            <p class="eyebrow">Best channel</p>
            <strong>{{ pretty(result.channel.primary_channel) }}</strong>
            <span>{{ result.vernacular.language }} · {{ result.vernacular.complexity_level }}</span>
          </div>
          <div>
            <p class="eyebrow">Priority</p>
            <strong>{{ result.channel.priority_score }}</strong>
            <span>{{ result.channel.frequency_per_month }} touch/month</span>
          </div>
          <div>
            <p class="eyebrow">Urgency</p>
            <strong>{{ result.urgency.urgency_score }}</strong>
            <span>{{ result.urgency.urgency_level }}</span>
          </div>
        </div>

        <article v-if="result" class="panel output">
          <div class="panel-head">
            <Languages size="20" />
            <h2>Generated campaign</h2>
          </div>
          <div class="message-tabs">
            <button :class="{ active: tab === 'sms' }" @click="tab = 'sms'">SMS</button>
            <button :class="{ active: tab === 'whatsapp' }" @click="tab = 'whatsapp'">WhatsApp</button>
            <button :class="{ active: tab === 'voice_script' }" @click="tab = 'voice_script'">Voice</button>
          </div>
          <p class="campaign-copy">{{ currentMessage }}</p>
          <div class="facts">
            <span>{{ result.content.generation_mode }}</span>
            <span>{{ result.vernacular.region_style }}</span>
            <span>{{ result.vernacular.sms_safe ? 'SMS safe' : 'Rich format' }}</span>
          </div>
          <audio v-if="result.content.audio_file" class="audio" controls :src="audioUrl(result.content.audio_file)"></audio>
        </article>

        <article v-if="result" class="panel preview-card">
          <div class="panel-head">
            <Image size="20" />
            <h2>WhatsApp media preview</h2>
          </div>
          <div class="phone-preview">
            <div class="media-tile">
              <span>{{ result.content.recommended_media?.type || 'infographic' }}</span>
              <strong>{{ result.content.recommended_media?.topic || 'crop advisory' }}</strong>
            </div>
            <p>{{ result.content.recommended_media?.caption }}</p>
            <small>{{ result.content.recommended_media?.video_script }}</small>
          </div>
        </article>

        <article v-if="result" class="panel">
          <div class="panel-head">
            <RadioTower size="20" />
            <h2>Explainability</h2>
          </div>
          <ul>
            <li v-for="item in result.engagement_reasoning" :key="item">{{ item }}</li>
            <li v-for="item in result.channel.rationale" :key="item">{{ item }}</li>
            <li v-for="item in result.urgency.urgency_reasons" :key="item">{{ item }}</li>
            <li>{{ result.rag.advisory_summary }}</li>
          </ul>
          <div class="sources">
            <span v-for="source in result.rag.sources" :key="source.id">{{ source.topic }}</span>
          </div>
        </article>

        <article class="panel analytics">
          <div class="panel-head">
            <BarChart3 size="20" />
            <h2>Campaign analytics</h2>
          </div>
          <canvas ref="chartEl" height="180"></canvas>
          <div class="metric-grid">
            <div><strong>{{ history.length }}</strong><span>campaign logs</span></div>
            <div><strong>{{ avgPriority }}</strong><span>avg priority</span></div>
            <div><strong>{{ modelStatus }}</strong><span>API status</span></div>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { BarChart3, Image, Languages, RadioTower, RefreshCw, Send, Sprout } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import { fetchCampaignHistory, fetchSegmentStats, predictCampaign } from './api'

const farmerName = ref('')
const form = ref({
  grower_id: '',
  state: '',
  district: '',
  tehsil_block: '',
  season: '',
  language: '',
  main_crop: '',
  campaign_crop: '',
  campaign_product: '',
  pest_threat: '',
  weather_risk: '',
  device_type: 'keypad_phone',
  connectivity: 'good',
  literacy_level: 'medium',
  grower_age: null,
  grower_farm_size: null,
  high_value_farmer: false,
  hist_open_rate: 0,
  hist_click_rate: 0,
  message_count_history: 0
})

const result = ref(null)
const error = ref('')
const loading = ref(false)
const loadingAnalytics = ref(false)
const tab = ref('sms')
const chartEl = ref(null)
const chart = ref(null)
const history = ref([])
const modelStatus = ref('ready')

const avgPriority = computed(() => result.value ? result.value.channel.priority_score : 0)
const currentMessage = computed(() => {
  if (!result.value?.content) return ''
  if (tab.value === 'sms') return result.value.content.sms || ''
  if (tab.value === 'whatsapp') return result.value.content.whatsapp || ''
  if (tab.value === 'voice_script') return result.value.content.voice_script || ''
  return ''
})

async function submit() {
  loading.value = true
  error.value = ''
  result.value = null
  tab.value = 'sms'
  try {
    const payload = { farmer_name: farmerName.value, farmer: { ...form.value, campaign_crop: form.value.main_crop } }
    result.value = await predictCampaign(payload)
    console.log('API /api/predict response:', result.value)
    tab.value = result.value.channel.primary_channel === 'voice_call' ? 'voice_script' : result.value.channel.primary_channel
    if (!(tab.value === 'sms' || tab.value === 'whatsapp' || tab.value === 'voice_script')) tab.value = 'sms'
    await nextTick()
    console.log('Selected tab:', tab.value)
    console.log('Rendered message:', currentMessage.value)
    console.log('Rendered language:', result.value?.vernacular?.language)
  } catch (err) {
    error.value = err.response?.data?.detail || err.message || 'Prediction failed'
  } finally {
    loading.value = false
  }
}

async function loadAnalytics() {
  loadingAnalytics.value = true
  try {
    const [stats, logs] = await Promise.all([fetchSegmentStats(), fetchCampaignHistory()])
    history.value = logs
    await nextTick()
    drawChart(stats)
    modelStatus.value = 'online'
  } catch (err) {
    modelStatus.value = 'offline'
    history.value = []
    drawChart([])
  } finally {
    loadingAnalytics.value = false
  }
}

function drawChart(stats) {
  const rows = Array.isArray(stats)
    ? stats.map((row) => ({ label: row.segment, value: row.count }))
    : Object.keys(stats || {}).map((key) => ({ label: key, value: stats[key]?.count ?? stats[key] }))
  const labels = rows.map((row) => row.label)
  const values = rows.map((row) => Number(row.value || 0))
  if (!chartEl.value) return
  chart.value?.destroy()
  chart.value = new Chart(chartEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Farmers', data: values, backgroundColor: ['#7ca982', '#f2c14e', '#2f80ed', '#1f7a4d'] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  })
}

function percent(value) {
  return `${Math.round(value * 1000) / 10}%`
}

function pretty(value) {
  return String(value || '').replaceAll('_', ' ')
}

function audioUrl(path) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${base}${path}`
}

onMounted(() => {
  loadAnalytics()
})
</script>
