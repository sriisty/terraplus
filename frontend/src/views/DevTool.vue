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
import { onMounted, ref } from 'vue'

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
import { fetchCampaignHistory, fetchSegmentStats, predictCampaign } from '../api'
import { sampleFarmers } from '../data/sampleFarmers'

const form = useFarmerForm()
const { theme, toggle } = useTheme()
const toast = useToast()

const result = ref(null)
const loading = ref(false)
const stats = ref([])
const history = ref([])
const loadingAnalytics = ref(false)
const apiStatus = ref('checking')

async function onSubmit() {
  if (!form.validate()) {
    toast.error('Please fill the required fields highlighted in red.')
    return
  }
  loading.value = true
  try {
    result.value = await predictCampaign(form.payload())
    toast.success(
      `Engagement ${(result.value.prediction.engagement_probability * 100).toFixed(1)}% · ${result.value.channel.primary_channel.replaceAll('_', ' ')}`
    )
    // Refresh history opportunistically so the new campaign shows up.
    fetchCampaignHistory().then((rows) => (history.value = rows)).catch(() => {})
  } catch (err) {
    toast.error(err.message || 'Prediction failed')
  } finally {
    loading.value = false
  }
}

function onReset() {
  form.reset()
  result.value = null
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
