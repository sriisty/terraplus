<template>
  <main class="shell">
    <AppHeader
      :api-status="apiStatus"
      :loading-analytics="loadingAnalytics"
      :theme="theme"
      @refresh="loadAnalytics"
      @toggle-theme="toggle"
    />

    <section class="workspace">
      <FarmerForm
        :state="form.state"
        :errors="form.errors"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
        @clear-error="form.clearError"
      />

      <section class="results" aria-live="polite">
        <ResultsSkeleton v-if="loading" />

        <template v-else-if="result">
          <ScoreBand :result="result" />
          <CampaignOutput :result="result" />
          <MediaPreview :result="result" :farmer-name="form.state.farmer_name" />
          <Explainability :result="result" />
        </template>

        <EmptyState v-else :samples="sampleFarmers" @pick="onPickSample" />

        <!-- Inline results section kept from HEAD for backward compatibility -->
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

          <!-- Dynamic Campaign Simulator Placeholder -->
          <article v-if="!result" class="panel placeholder-card">
            <div class="panel-head">
              <RadioTower size="20" style="color: var(--color-primary);" />
              <h2>Campaign Integration Simulator</h2>
            </div>
            <div class="placeholder-body">
              <p class="placeholder-intro">
                TerraPlus AI automatically generates multi-channel marketing campaigns tailored to farmer demographics, connectivity status, and literacy levels.
              </p>
              
              <div class="preview-features">
                <div class="preview-feature">
                  <span class="badge-icon green">💬</span>
                  <div class="feature-info">
                    <h3>WhatsApp Rich Media</h3>
                    <p>Delivers localized vernacular copy with customized infographic templates (e.g. crop protection, fertilizer guidance) suited for smartphone users.</p>
                  </div>
                </div>
                <div class="preview-feature">
                  <span class="badge-icon blue">✉️</span>
                  <div class="feature-info">
                    <h3>SMS Text Advisories</h3>
                    <p>Generates high-impact, offline-safe text copy optimized for feature and keypad phones in areas with weak cellular networks.</p>
                  </div>
                </div>
                <div class="preview-feature">
                  <span class="badge-icon gold">📞</span>
                  <div class="feature-info">
                    <h3>Voice IVR Call Script & Audio</h3>
                    <p>Synthesizes spoken advisory scripts and triggers outbound automated calls with dynamic audio files for high-value segments.</p>
                  </div>
                </div>
              </div>

              <div class="onboarding-tip">
                <div class="tip-header">💡 How to preview:</div>
                <p>Configure the farmer context parameters on the left (e.g. state, main crop, connectivity, device type) and click <strong>"Generate campaign"</strong>. The AI will output the corresponding SMS, WhatsApp media cards, and Voice script previews right here.</p>
              </div>
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

        <HistoryList :items="history" />
        <Analytics
          :stats="stats"
          :history="history"
          :loading="loadingAnalytics"
          :theme="theme"
        />

      </section>
    </section>

    <ToastStack />
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { BarChart3, Image, Languages, RadioTower, RefreshCw, Send, Sprout } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import { fetchCampaignHistory, fetchSegmentStats, predictCampaign } from '../api'

import AppHeader from '../components/AppHeader.vue'
import FarmerForm from '../components/FarmerForm.vue'
import ScoreBand from '../components/ScoreBand.vue'
import CampaignOutput from '../components/CampaignOutput.vue'
import MediaPreview from '../components/MediaPreview.vue'
import Explainability from '../components/Explainability.vue'
import Analytics from '../components/Analytics.vue'
import HistoryList from '../components/HistoryList.vue'
import EmptyState from '../components/EmptyState.vue'
import ResultsSkeleton from '../components/ResultsSkeleton.vue'
import ToastStack from '../components/ToastStack.vue'

import { useFarmerForm } from '../composables/useFarmerForm'
import { useTheme } from '../composables/useTheme'
import { useToast } from '../composables/useToast'
import { sampleFarmers } from '../data/sampleFarmers'

const form = useFarmerForm()
const { theme, toggle } = useTheme()
const toast = useToast()

const result = ref(null)
const loading = ref(false)
const error = ref(null)
const stats = ref([])
const history = ref([])
const loadingAnalytics = ref(false)
const apiStatus = ref('checking')
const tab = ref('sms')
const chartEl = ref(null)

const currentMessage = computed(() => {
  if (!result.value) return ''
  return result.value.content?.[tab.value] || ''
})

const avgPriority = computed(() => {
  if (!history.value.length) return '—'
  const avg = history.value.reduce((s, r) => s + (r.channel?.priority_score || 0), 0) / history.value.length
  return avg.toFixed(1)
})

const modelStatus = computed(() => apiStatus.value)

const percent = (v) => `${(v * 100).toFixed(1)}%`
const pretty = (s) => (s || '').replace(/_/g, ' ')
const audioUrl = (f) => `http://localhost:8000/audio/${f}`

async function onSubmit() {
  if (!form.validate()) {
    toast.error('Please fill the required fields highlighted in red.')
    return
  }
  loading.value = true
  error.value = null
  try {
    result.value = await predictCampaign(form.payload())
    toast.success(
      `Engagement ${(result.value.prediction.engagement_probability * 100).toFixed(1)}% · ${result.value.channel.primary_channel.replaceAll('_', ' ')}`
    )
    fetchCampaignHistory().then((rows) => (history.value = rows)).catch(() => {})
  } catch (err) {
    error.value = err.message || 'Prediction failed'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

function onReset() {
  form.reset()
  result.value = null
  error.value = null
  toast.info('Form cleared.')
}

function onPickSample(sample) {
  form.loadSample(sample)
  toast.info(`Loaded sample: ${sample.label.split(' · ')[0]}`)
}

async function loadAnalytics() {
  loadingAnalytics.value = true
  apiStatus.value = 'checking'
  try {
    const [s, h] = await Promise.all([fetchSegmentStats(), fetchCampaignHistory()])
    stats.value = s
    history.value = h
    apiStatus.value = 'online'
  } catch (err) {
    stats.value = []
    history.value = []
    apiStatus.value = 'offline'
    toast.error(err.message || 'Backend unreachable.')
  } finally {
    loadingAnalytics.value = false
  }
}

onMounted(loadAnalytics)
</script>

<style scoped>
.placeholder-card {
  border-left: 4px solid var(--color-primary);
  background: var(--bg-card);
}
.placeholder-intro {
  color: var(--slate-600);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}
.preview-features {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}
.preview-feature {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  background: var(--slate-50);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.preview-feature:hover {
  transform: translateY(-1px);
  border-color: var(--slate-300);
}
.badge-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.badge-icon.green {
  background: #e6fdf5;
}
.badge-icon.blue {
  background: #eff6ff;
}
.badge-icon.gold {
  background: #fffbeb;
}
.feature-info h3 {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--slate-900);
  margin: 0 0 2px 0;
}
.feature-info p {
  font-size: 12px;
  color: var(--slate-500);
  line-height: 1.4;
  margin: 0;
}
.onboarding-tip {
  padding: 14px;
  background: var(--emerald-50);
  border: 1px solid var(--emerald-100);
  border-radius: var(--radius-md);
}
.tip-header {
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 4px;
  color: var(--emerald-800);
}
.onboarding-tip p {
  font-size: 12px;
  line-height: 1.4;
  color: var(--emerald-700);
  margin: 0;
}
</style>
