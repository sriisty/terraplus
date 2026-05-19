const { computed, nextTick, onMounted, ref } = window.Vue

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000'

const emptyFarmer = () => ({
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
  device_type: 'smartphone',
  connectivity: 'good',
  literacy_level: 'medium',
  grower_age: null,
  grower_farm_size: null,
  high_value_farmer: false,
  hist_open_rate: 0,
  hist_click_rate: 0,
  message_count_history: 0
})

window.Vue.createApp({
  setup() {
    const farmerName = ref('')
    const form = ref(emptyFarmer())
    const prediction = ref(null)
    const selectedTab = ref('sms')
    const error = ref('')
    const loading = ref(false)
    const loadingAnalytics = ref(false)
    const chartEl = ref(null)
    const chart = ref(null)
    const campaignHistory = ref([])
    const apiStatus = ref('not checked')
    const segmentStats = ref([])

    const content = computed(() => prediction.value?.content || {})
    const vernacular = computed(() => prediction.value?.vernacular || {})
    const channel = computed(() => prediction.value?.channel || {})
    const urgency = computed(() => prediction.value?.urgency || {})
    const media = computed(() => content.value.recommended_media || null)

    const currentMessage = computed(() => {
      if (!prediction.value) return ''
      if (selectedTab.value === 'sms') return content.value.sms || ''
      if (selectedTab.value === 'whatsapp') return content.value.whatsapp || ''
      if (selectedTab.value === 'voice') return content.value.voice_script || ''
      return ''
    })

    const engagementPercent = computed(() => {
      const value = prediction.value?.prediction?.engagement_probability
      return typeof value === 'number' ? `${Math.round(value * 1000) / 10}%` : '-'
    })

    const audioSrc = computed(() => {
      if (!content.value.audio_file) return ''
      return `${API_BASE_URL}${content.value.audio_file}`
    })

    async function submit() {
      loading.value = true
      error.value = ''
      prediction.value = null
      selectedTab.value = 'sms'

      try {
        const farmer = cleanPayload({
          ...form.value,
          campaign_crop: form.value.campaign_crop || form.value.main_crop
        })
        const payload = { farmer_name: farmerName.value || 'Farmer', farmer }
        const response = await window.axios.post(`${API_BASE_URL}/api/predict`, payload)

        console.log('API /api/predict response:', response.data)
        prediction.value = response.data

        const primary = response.data?.channel?.primary_channel
        selectedTab.value = primary === 'voice_call'
          ? 'voice'
          : primary === 'whatsapp'
            ? 'whatsapp'
            : 'sms'

        await nextTick()
        console.log('Selected tab:', selectedTab.value)
        console.log('Rendered message:', currentMessage.value)
        console.log('Rendered language:', vernacular.value.language)
      } catch (err) {
        error.value = err.response?.data?.detail || err.message || 'Prediction failed'
        console.error('Prediction request failed:', err)
      } finally {
        loading.value = false
      }
    }

    async function loadAnalytics() {
      loadingAnalytics.value = true
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          window.axios.get(`${API_BASE_URL}/api/segments/stats`),
          window.axios.get(`${API_BASE_URL}/api/campaigns/history?limit=20`)
        ])
        console.log('API /api/segments/stats response:', statsResponse.data)
        console.log('API /api/campaigns/history response:', historyResponse.data)
        segmentStats.value = Array.isArray(statsResponse.data) ? statsResponse.data : []
        campaignHistory.value = Array.isArray(historyResponse.data) ? historyResponse.data : []
        apiStatus.value = 'online'
        await nextTick()
        drawChart(segmentStats.value)
      } catch (err) {
        apiStatus.value = 'offline'
        segmentStats.value = []
        campaignHistory.value = []
        drawChart([])
        console.error('Analytics request failed:', err)
      } finally {
        loadingAnalytics.value = false
      }
    }

    function drawChart(rows) {
      if (!chartEl.value || !window.Chart) return
      chart.value?.destroy()
      chart.value = new window.Chart(chartEl.value, {
        type: 'bar',
        data: {
          labels: rows.map((row) => row.segment || row.label),
          datasets: [{
            label: 'Farmers',
            data: rows.map((row) => Number(row.count || 0)),
            backgroundColor: ['#7ca982', '#f2c14e', '#2f80ed', '#1f7a4d']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      })
    }

    function cleanPayload(payload) {
      return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== '' && value !== null && value !== undefined)
      )
    }

    function setTab(tab) {
      selectedTab.value = tab
      console.log('Selected tab:', selectedTab.value)
      console.log('Rendered message:', currentMessage.value)
      console.log('Rendered language:', vernacular.value.language)
    }

    function pretty(value) {
      return String(value || '-').replaceAll('_', ' ')
    }

    onMounted(loadAnalytics)

    return {
      farmerName,
      form,
      prediction,
      selectedTab,
      currentMessage,
      content,
      vernacular,
      channel,
      urgency,
      media,
      engagementPercent,
      audioSrc,
      error,
      loading,
      loadingAnalytics,
      chartEl,
      campaignHistory,
      apiStatus,
      submit,
      loadAnalytics,
      setTab,
      pretty
    }
  },
  template: `
    <main class="shell">
      <section class="topbar">
        <div>
          <p class="eyebrow">Syngenta Track 1</p>
          <h1>Adaptive Agricultural Campaign Intelligence</h1>
        </div>
        <button class="ghost" @click="loadAnalytics" :disabled="loadingAnalytics">Refresh metrics</button>
      </section>

      <section class="workspace">
        <form class="panel form" @submit.prevent="submit">
          <div class="panel-head"><h2>Farmer context</h2></div>
          <div class="grid two">
            <label>Farmer name<input v-model="farmerName" /></label>
            <label>Grower ID<input v-model="form.grower_id" /></label>
            <label>State<input v-model="form.state" required /></label>
            <label>District<input v-model="form.district" required /></label>
            <label>Tehsil / block<input v-model="form.tehsil_block" /></label>
            <label>Season<input v-model="form.season" placeholder="Kharif / Rabi" /></label>
            <label>Language
              <select v-model="form.language">
                <option value="">Infer from region</option>
                <option>Hindi</option><option>Tamil</option><option>Telugu</option>
                <option>Marathi</option><option>English</option>
              </select>
            </label>
            <label>Crop<input v-model="form.main_crop" required /></label>
            <label>Product<input v-model="form.campaign_product" /></label>
            <label>Pest / disease threat<input v-model="form.pest_threat" required /></label>
            <label>Weather condition<input v-model="form.weather_risk" /></label>
            <label>Device
              <select v-model="form.device_type">
                <option value="smartphone">smartphone</option>
                <option value="keypad_phone">keypad_phone</option>
                <option value="feature_phone">feature_phone</option>
              </select>
            </label>
            <label>Connectivity
              <select v-model="form.connectivity">
                <option value="good">good</option>
                <option value="weak">weak</option>
                <option value="offline">offline</option>
              </select>
            </label>
            <label>Literacy
              <select v-model="form.literacy_level">
                <option value="medium">medium</option>
                <option value="low">low</option>
                <option value="high">high</option>
              </select>
            </label>
            <label>Farm size acres<input v-model.number="form.grower_farm_size" type="number" min="0" step="0.1" /></label>
          </div>
          <label class="check"><input v-model="form.high_value_farmer" type="checkbox" /> High-value farmer</label>
          <button class="primary" :disabled="loading">{{ loading ? 'Generating campaign...' : 'Generate campaign' }}</button>
        </form>

        <section class="results">
          <div v-if="error" class="error">{{ error }}</div>

          <div v-if="prediction" class="score-band">
            <div><p class="eyebrow">Engagement probability</p><strong>{{ engagementPercent }}</strong><span>{{ prediction.prediction.segment }} segment</span></div>
            <div><p class="eyebrow">Best channel</p><strong>{{ pretty(channel.primary_channel) }}</strong><span>{{ vernacular.language }} · {{ vernacular.complexity_level }}</span></div>
            <div><p class="eyebrow">Priority</p><strong>{{ channel.priority_score }}</strong><span>{{ channel.frequency_per_month }} touch/month</span></div>
            <div><p class="eyebrow">Urgency</p><strong>{{ urgency.urgency_score }}</strong><span>{{ urgency.urgency_level }}</span></div>
          </div>

          <article v-if="prediction" class="panel output">
            <div class="panel-head"><h2>Generated campaign</h2></div>
            <div class="message-tabs">
              <button type="button" :class="{ active: selectedTab === 'sms' }" @click="setTab('sms')">SMS</button>
              <button type="button" :class="{ active: selectedTab === 'whatsapp' }" @click="setTab('whatsapp')">WhatsApp</button>
              <button type="button" :class="{ active: selectedTab === 'voice' }" @click="setTab('voice')">Voice</button>
            </div>
            <p class="campaign-copy">{{ currentMessage }}</p>
            <div class="facts">
              <span>{{ content.generation_mode }}</span>
              <span>{{ vernacular.region_style }}</span>
              <span>{{ vernacular.sms_safe ? 'SMS safe' : 'Rich format' }}</span>
            </div>
            <audio v-if="audioSrc" class="audio" controls :src="audioSrc"></audio>
          </article>

          <article v-if="prediction && media" class="panel preview-card">
            <div class="panel-head"><h2>WhatsApp media preview</h2></div>
            <div class="phone-preview">
              <div class="media-tile"><span>{{ media.type }}</span><strong>{{ media.topic }}</strong></div>
              <p>{{ media.caption }}</p>
              <small>{{ media.video_script }}</small>
            </div>
          </article>

          <article v-if="prediction" class="panel">
            <div class="panel-head"><h2>Explainability</h2></div>
            <ul>
              <li v-for="item in prediction.engagement_reasoning" :key="item">{{ item }}</li>
              <li v-for="item in channel.rationale" :key="item">{{ item }}</li>
              <li v-for="item in urgency.urgency_reasons" :key="item">{{ item }}</li>
              <li>{{ prediction.rag.advisory_summary }}</li>
            </ul>
            <div class="sources">
              <span v-for="source in prediction.rag.sources" :key="source.id">{{ source.crop }} / {{ source.topic }}</span>
            </div>
          </article>

          <article class="panel analytics">
            <div class="panel-head"><h2>Campaign analytics</h2></div>
            <canvas ref="chartEl" height="180"></canvas>
            <div class="metric-grid">
              <div><strong>{{ campaignHistory.length }}</strong><span>campaign logs</span></div>
              <div><strong>{{ prediction ? channel.priority_score : '-' }}</strong><span>latest priority</span></div>
              <div><strong>{{ apiStatus }}</strong><span>API status</span></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  `
}).mount('#app')
