<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-brand-container">
        <span class="brand-icon">🌱</span>
        <span class="brand-name">TerraPlus AI</span>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li class="nav-item active">
            <router-link to="/admin" @click="closeSidebar">
              <LayoutDashboard :size="18" />
              <span>Command Center</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/home" @click="closeSidebar">
              <Users :size="18" />
              <span>Farmer App</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/selfie" @click="closeSidebar">
              <Smartphone :size="18" />
              <span>Grower Pride</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inbox" @click="closeSidebar">
              <MessageSquare :size="18" />
              <span>Farmer Messages</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dev-tool" @click="closeSidebar">
              <Settings :size="18" />
              <span>API Dev Tool</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="connection-status" :class="{ 'online': isOnline }">
          <Wifi v-if="isOnline" :size="14" />
          <WifiOff v-else :size="14" />
          <span>{{ isOnline ? 'System Online' : 'Offline Mode' }}</span>
        </div>
        <p class="footer-meta">Syngenta Hackathon 2026</p>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>

    <!-- Main Content Panel -->
    <main class="main-content-panel">
      <!-- Top header -->
      <header class="dashboard-header">
        <div class="header-left">
          <button class="sidebar-toggle-btn" @click="isSidebarOpen = !isSidebarOpen" aria-label="Toggle Sidebar">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <div>
            <span class="eyebrow">Track 1: Personalization at Scale</span>
            <h1 class="header-title">Command Center</h1>
          </div>
        </div>
        <div class="header-right">
          <div class="active-campaign-badge">
            <span class="pulse-dot"></span>
            <span>Rabi 2025–26 Campaign Live</span>
          </div>
        </div>
      </header>

      <!-- Bento Box Grid -->
      <div class="bento-grid">
        <!-- KPI Card 1: Reached -->
        <div class="card col-span-3 kpi-bento-card" :class="{ 'pulse-highlight': pulseKpi }">
          <div class="kpi-icon-wrapper reached">
            <Users :size="20" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Farmers Onboarded</span>
            <h3 class="kpi-value">{{ kpiReached.toLocaleString() }}</h3>
            <span class="kpi-change positive">Live from database</span>
          </div>
        </div>

        <!-- KPI Card 2: AI Engagements -->
        <div class="card col-span-3 kpi-bento-card" :class="{ 'pulse-highlight': pulseKpi }">
          <div class="kpi-icon-wrapper interactions">
            <Zap :size="20" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Campaigns Generated</span>
            <h3 class="kpi-value">{{ kpiDialogs.toLocaleString() }}</h3>
            <span class="kpi-change positive">Live from database</span>
          </div>
        </div>

        <!-- KPI Card 3: Outbound -->
        <div class="card col-span-3 kpi-bento-card" :class="{ 'pulse-highlight': pulseKpi }">
          <div class="kpi-icon-wrapper outbound">
            <Send :size="20" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Campaign Triggers</span>
            <h3 class="kpi-value">{{ kpiTriggersCount }} Total</h3>
            <span class="kpi-change">Database-sourced</span>
          </div>
        </div>

        <!-- KPI Card 4: NPS -->
        <div class="card col-span-3 kpi-bento-card" :class="{ 'pulse-highlight': pulseKpi }">
          <div class="kpi-icon-wrapper nps">
            <CheckCircle :size="20" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Click-Through Rate</span>
            <h3 class="kpi-value">{{ kpiSatisfaction }}</h3>
            <span class="kpi-change positive">Observed from feedback</span>
          </div>
        </div>

        <!-- Bento Row 2: Card 1 - A/B Routing -->
        <div class="card col-span-8 ab-test-card">
          <div class="card-header-custom">
            <div>
              <h2 class="card-section-title">Vernacular Message Optimization</h2>
              <p class="card-section-subtitle">Real-time autonomous reinforcement learning routing</p>
            </div>
            <span class="badge badge-success font-mono">AI AUTO-OPTIMIZING</span>
          </div>

          <div class="ab-comparison-box">
            <!-- Variant A -->
            <div class="variant-row" :class="{ 'losing-variant': winningVariant === 'B' }">
              <div class="variant-meta">
                <span class="variant-letter font-mono">A</span>
                <div>
                  <h4 class="variant-title">Technical Agronomic Copy</h4>
                  <p class="variant-text">"किसान भाइयों, गेहूं की फसल में पुष्पन अवस्था के दौरान नमी बनाए रखें। फफूंद संक्रमण से बचाव के लिए आज ही टोपीक 15 डब्ल्यूपी का प्रयोग करें।"</p>
                </div>
              </div>
              <div class="variant-metrics">
                <div class="metric-group">
                  <span class="metric-num">24.1%</span>
                  <span class="metric-name">Open Rate</span>
                </div>
                <div class="metric-group">
                  <span class="metric-num">15%</span>
                  <span class="metric-name">AI Traffic Route</span>
                </div>
              </div>
            </div>

            <!-- VS Divider -->
            <div class="ab-divider">
              <span class="divider-text">VS</span>
            </div>

            <!-- Variant B -->
            <div class="variant-row winner-row" :class="{ 'winning-variant': winningVariant === 'B' }">
              <div class="variant-meta">
                <span class="variant-letter font-mono">B</span>
                <div>
                  <h4 class="variant-title">Vernacular Value Proposition Copy (Winning)</h4>
                  <p class="variant-text">"गेहूं में बाली निकलते समय फसल को फंगस से बचाएं और अधिक पैदावार पाएं। आगरा के सफल किसानों का भरोसा - टोपीक 15 डब्ल्यूपी स्प्रे करें।"</p>
                </div>
                <span class="winner-badge">🏆 Winning 2.0x</span>
              </div>
              <div class="variant-metrics">
                <div class="metric-group">
                  <span class="metric-num highlight-num">48.5%</span>
                  <span class="metric-name">Open Rate</span>
                </div>
                <div class="metric-group">
                  <span class="metric-num highlight-num">85%</span>
                  <span class="metric-name">AI Traffic Route</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Traffic Routing Progress Bar -->
          <div class="routing-visualizer">
            <div class="routing-labels">
              <span>Variant A (15%)</span>
              <span class="bold">AI Vernacular Routing Allocation (85% to Winner)</span>
              <span>Variant B (85%)</span>
            </div>
            <div class="routing-progress-track">
              <div class="routing-progress-fill A-fill" style="width: 15%"></div>
              <div class="routing-progress-fill B-fill" style="width: 85%"></div>
            </div>
          </div>
        </div>

        <!-- Bento Row 2: Card 2 - Omni-Channel -->
        <div class="card col-span-4 omni-channel-card">
          <div class="card-header-custom">
            <div>
              <h2 class="card-section-title">Omni-Channel Mix</h2>
              <p class="card-section-subtitle">Volume routing breakdown</p>
            </div>
          </div>

          <div class="channel-distribution-list">
            <!-- Channel 1: WhatsApp -->
            <div class="channel-item">
              <div class="channel-info">
                <div class="channel-icon whatsapp">💬</div>
                <div>
                  <h4 class="channel-name">WhatsApp</h4>
                  <span class="channel-desc font-mono">Rich Media & Graphics</span>
                </div>
              </div>
              <div class="channel-values">
                <span class="channel-vol">{{ channelStats.whatsapp.count.toLocaleString() }} ({{ channelStats.whatsapp.percentage }}%)</span>
                <div class="channel-bar-container">
                  <div class="channel-bar-fill whatsapp-bar" :style="{ width: channelStats.whatsapp.percentage + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Channel 2: Voice IVR -->
            <div class="channel-item">
              <div class="channel-info">
                <div class="channel-icon voice">📞</div>
                <div>
                  <h4 class="channel-name">Voice IVR</h4>
                  <span class="channel-desc font-mono">Feature Phone Voice Messages</span>
                </div>
              </div>
              <div class="channel-values">
                <span class="channel-vol">{{ channelStats.voice.count.toLocaleString() }} ({{ channelStats.voice.percentage }}%)</span>
                <div class="channel-bar-container">
                  <div class="channel-bar-fill voice-bar" :style="{ width: channelStats.voice.percentage + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Channel 3: SMS -->
            <div class="channel-item">
              <div class="channel-info">
                <div class="channel-icon sms">✉️</div>
                <div>
                  <h4 class="channel-name">SMS Alert</h4>
                  <span class="channel-desc font-mono">Offline / Low Bandwidth</span>
                </div>
              </div>
              <div class="channel-values">
                <span class="channel-vol">{{ channelStats.sms.count.toLocaleString() }} ({{ channelStats.sms.percentage }}%)</span>
                <div class="channel-bar-container">
                  <div class="channel-bar-fill sms-bar" :style="{ width: channelStats.sms.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="channel-summary-note">
            <span class="info-icon">ℹ️</span>
            <p>Voice and SMS channels active automatically for growers flagged in <strong>Offline Status</strong> due to bad cell connection.</p>
          </div>
        </div>

        <!-- Bento Row 3: Card 3 - Field Rep Dispatch Triggers -->
        <div class="card col-span-12 rep-dispatches-card">
          <div class="card-header-custom flex-row-responsive">
            <div>
              <h2 class="card-section-title">Autonomous Field Rep Dispatches</h2>
              <p class="card-section-subtitle">Digital engagement rules automatically triggering physical agronomic support in the field</p>
            </div>
            <div class="rule-indicator-badge">
              <span>Rule Engine: ACTIVE</span>
            </div>
          </div>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Location</th>
                  <th>Digital Trigger Alert</th>
                  <th>Physical Action Dispatched</th>
                  <th>Assigned Field Rep</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trigger in fieldTriggers" :key="trigger.id" :class="{ 'new-dispatch-row': String(trigger.id).startsWith('api-') && pulseNewDispatch }">
                  <td class="font-semibold">{{ trigger.farmer }}</td>
                  <td>{{ trigger.location }}</td>
                  <td>
                    <span class="trigger-badge font-mono" :class="trigger.severity">
                      {{ trigger.triggerText }}
                    </span>
                  </td>
                  <td>{{ trigger.action }}</td>
                  <td>{{ trigger.rep }}</td>
                  <td>
                    <span class="status-badge" :class="trigger.status.toLowerCase().replace(' ', '-')">
                      {{ trigger.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  LayoutDashboard, 
  Users, 
  Smartphone, 
  MessageSquare, 
  Settings, 
  Zap, 
  Send, 
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-vue-next'
import { fetchDashboardStats } from '../api'
import { useRealtimeSync } from '../composables/useRealtimeSync'
import { useToast } from '../composables/useToast'

const isSidebarOpen = ref(false)
const isOnline = ref(navigator.onLine)
const winningVariant = ref('B')

const sync = useRealtimeSync()
const toast = useToast()

const pulseKpi = ref(false)
const pulseNewDispatch = ref(false)

// All KPIs are now database-driven (no fake base numbers)
const kpiReached = ref(0)
const kpiDialogs = ref(0)
const kpiTriggersCount = ref(0)
const kpiSatisfaction = ref('—')

const channelStats = ref({
  whatsapp: { count: 0, percentage: 0 },
  voice: { count: 0, percentage: 0 },
  sms: { count: 0, percentage: 0 }
})

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

const fieldTriggers = ref([])
const loading = ref(false)

async function loadDashboard() {
  loading.value = true
  try {
    const stats = await fetchDashboardStats()

    // KPI Cards — pure database counts
    kpiReached.value = stats.total_farmers || 0
    kpiDialogs.value = stats.total_campaigns || 0
    kpiTriggersCount.value = stats.total_campaigns || 0
    kpiSatisfaction.value = stats.total_campaigns > 0
      ? `${(stats.observed_ctr * 100).toFixed(1)}%`
      : '—'

    // Channel distribution — pure database counts
    const wa = stats.by_channel?.whatsapp || 0
    const voice = (stats.by_channel?.voice_call || stats.by_channel?.voice || 0)
    const sms = stats.by_channel?.sms || 0
    const totalCh = wa + voice + sms || 1

    channelStats.value.whatsapp = { count: wa, percentage: Math.round((wa / totalCh) * 100) }
    channelStats.value.voice = { count: voice, percentage: Math.round((voice / totalCh) * 100) }
    channelStats.value.sms = { count: sms, percentage: Math.round((sms / totalCh) * 100) }

    // Field dispatches — from recent campaigns in DB
    if (stats.recent_dispatches && stats.recent_dispatches.length > 0) {
      fieldTriggers.value = stats.recent_dispatches.map(d => ({
        id: 'api-' + d.id,
        farmer: d.farmer_name || `Farmer ${d.grower_id}`,
        location: d.location || 'Region',
        triggerText: `${(d.channel || 'CAMPAIGN').toUpperCase()} ${d.product || 'Advisory'} Alert`,
        severity: d.predicted_score > 0.7 ? 'high' : d.predicted_score > 0.4 ? 'medium' : 'low',
        action: `Generated personalized ${d.crop || ''} advisory for ${d.product || 'crop protection'}`,
        rep: d.id % 2 === 0 ? 'Suresh Kumar' : 'Harpreet Singh',
        status: d.actual_clicked ? 'Completed' : 'Scheduled'
      }))
    } else {
      fieldTriggers.value = []
    }
  } catch (err) {
    console.error('Failed to load dashboard stats:', err)
  } finally {
    loading.value = false
  }
}

let cleanupCampaignSync = null
let cleanupInteractionSync = null
let cleanupFarmerSync = null

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  loadDashboard()

  // Real-time synchronization listeners
  cleanupCampaignSync = sync.onCampaignReceived((campaign) => {
    toast.success(`📡 New Campaign Alert dispatched in real-time!`)
    
    // Optimistic UI updates
    kpiDialogs.value += 1
    kpiTriggersCount.value += 1
    
    const newDispatch = {
      id: 'temp-' + Date.now(),
      farmer: campaign.farmer_name || (campaign.content?.farmer_name) || `Farmer ${campaign.grower_id}`,
      location: campaign.location || (campaign.rag?.sources?.[0]?.district ? `${campaign.rag.sources[0].state || ''}, ${campaign.rag.sources[0].district}` : 'Region'),
      triggerText: `${(campaign.channel?.primary_channel || campaign.channel || 'CAMPAIGN').toUpperCase()} ${campaign.content?.campaign_product || campaign.product || 'Advisory'} Alert`,
      severity: (campaign.prediction?.engagement_probability || campaign.predicted_score || 0.5) > 0.7 ? 'high' : (campaign.prediction?.engagement_probability || campaign.predicted_score || 0.5) > 0.4 ? 'medium' : 'low',
      action: `Generated personalized ${campaign.campaign_crop || campaign.crop || ''} advisory for ${campaign.content?.campaign_product || campaign.product || 'crop protection'}`,
      rep: 'Suresh Kumar',
      status: 'Scheduled'
    }
    
    fieldTriggers.value.unshift(newDispatch)
    if (fieldTriggers.value.length > 10) {
      fieldTriggers.value.pop()
    }
    
    // Highlight updated counters and prepend row
    pulseKpi.value = true
    pulseNewDispatch.value = true
    setTimeout(() => {
      pulseKpi.value = false
      pulseNewDispatch.value = false
    }, 2000)
    
    // Reconcile with DB after 500ms
    setTimeout(() => {
      loadDashboard()
    }, 500)
  })

  cleanupInteractionSync = sync.onInteractionReceived((interaction) => {
    toast.info(`📈 Farmer recorded interaction (helpful: ${interaction.actual_clicked})`)
    
    // Update status locally in fieldTriggers
    const dbId = 'api-' + interaction.campaign_id
    const dispatch = fieldTriggers.value.find(d => d.id === dbId)
    if (dispatch) {
      dispatch.status = interaction.actual_clicked ? 'Completed' : 'Dismissed'
    }
    
    pulseKpi.value = true
    setTimeout(() => {
      pulseKpi.value = false
    }, 2000)
    
    // Reconcile with DB after 500ms
    setTimeout(() => {
      loadDashboard()
    }, 500)
  })

  cleanupFarmerSync = sync.onFarmerUpdated((farmer) => {
    toast.info(`👤 Profile synced: Active farmer updated to ${farmer.name || 'Kisan'}`)
    pulseKpi.value = true
    setTimeout(() => {
      pulseKpi.value = false
    }, 2000)
    
    // Reconcile with DB after 500ms
    setTimeout(() => {
      loadDashboard()
    }, 500)
  })
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  
  if (cleanupCampaignSync) cleanupCampaignSync()
  if (cleanupInteractionSync) cleanupInteractionSync()
  if (cleanupFarmerSync) cleanupFarmerSync()
  
  sync.destroy()
})

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--slate-50);
}

/* Sidebar Styling */
.admin-sidebar {
  width: 260px;
  background-color: var(--slate-900);
  color: white;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--slate-800);
  transition: transform 0.3s ease;
  z-index: 100;
}

.sidebar-brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-left: 12px;
}

.brand-icon {
  font-size: 24px;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--emerald-400);
  letter-spacing: -0.025em;
}

.sidebar-nav {
  flex: 1;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-nav .nav-item a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--slate-300);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sidebar-nav .nav-item a:hover {
  background-color: var(--slate-800);
  color: white;
}

.sidebar-nav .nav-item.active a {
  background-color: var(--emerald-900);
  color: var(--emerald-200);
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--slate-800);
  padding-top: 20px;
  padding-left: 12px;
}

.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #ef444420;
  color: #ef4444;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.connection-status.online {
  background-color: #10b98120;
  color: var(--emerald-400);
}

.footer-meta {
  color: var(--slate-500);
  font-size: 11px;
  margin: 0;
}

.main-content-panel {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  max-width: calc(100vw - 260px);
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--slate-900);
}

.sidebar-toggle-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  min-height: auto;
}

.sidebar-toggle-btn .bar {
  width: 100%;
  height: 2px;
  background-color: var(--slate-800);
  border-radius: 2px;
}

.active-campaign-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-700);
  box-shadow: var(--shadow-sm);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.9; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 0.9; }
}

/* KPI Bento Cards */
.kpi-bento-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.kpi-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
}

.kpi-icon-wrapper.reached { background-color: var(--emerald-50); color: var(--emerald-600); }
.kpi-icon-wrapper.interactions { background-color: #fef3c7; color: #d97706; }
.kpi-icon-wrapper.outbound { background-color: #e0f2fe; color: #0284c7; }
.kpi-icon-wrapper.nps { background-color: #f3e8ff; color: #7c3aed; }

.kpi-data {
  display: flex;
  flex-direction: column;
}

.kpi-label {
  font-size: 12px;
  color: var(--slate-500);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-value {
  font-size: 24px;
  font-weight: 800;
  margin: 2px 0;
  color: var(--slate-900);
  line-height: 1.2;
}

.kpi-change {
  font-size: 11px;
  color: var(--slate-400);
  font-weight: 500;
}

.kpi-change.positive {
  color: var(--color-primary);
  font-weight: 600;
}

/* A/B Test Card */
.card-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.card-section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--slate-900);
  margin-bottom: 4px;
}

.card-section-subtitle {
  font-size: 13px;
  color: var(--slate-500);
  margin: 0;
}

.ab-comparison-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.variant-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--slate-50);
  transition: all 0.2s ease;
}

.variant-row.winner-row {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
  position: relative;
}

.variant-meta {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.variant-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--slate-200);
  color: var(--slate-700);
  border-radius: 50%;
  font-weight: 700;
  font-size: 14px;
}

.winner-row .variant-letter {
  background-color: var(--color-primary);
  color: white;
}

.variant-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--slate-800);
  margin-bottom: 4px;
}

.winner-row .variant-title {
  color: var(--emerald-900);
}

.variant-text {
  font-size: 13px;
  color: var(--slate-600);
  font-style: italic;
  max-width: 480px;
  line-height: 1.4;
  margin: 0;
}

.winner-row .variant-text {
  color: var(--emerald-800);
}

.variant-metrics {
  display: flex;
  gap: 24px;
  padding-left: 20px;
}

.metric-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.metric-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--slate-800);
}

.highlight-num {
  color: var(--emerald-800);
  font-size: 24px;
  font-weight: 800;
}

.metric-name {
  font-size: 11px;
  color: var(--slate-400);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.winner-row .metric-name {
  color: var(--emerald-600);
}

.ab-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  z-index: 5;
  display: none; /* simple stacked format is cleaner */
}

.winner-badge {
  position: absolute;
  top: -12px;
  right: 18px;
  background-color: #d97706;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
}

.routing-visualizer {
  margin-top: 24px;
  padding: 16px;
  background-color: var(--slate-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.routing-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--slate-500);
  margin-bottom: 8px;
  font-weight: 600;
}

.routing-labels .bold {
  color: var(--slate-800);
  text-transform: uppercase;
}

.routing-progress-track {
  height: 12px;
  background-color: var(--slate-200);
  border-radius: 999px;
  display: flex;
  overflow: hidden;
}

.routing-progress-fill.A-fill {
  background-color: var(--slate-400);
}

.routing-progress-fill.B-fill {
  background-color: var(--color-primary);
}

/* Omni-Channel Card */
.channel-distribution-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.channel-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.channel-icon {
  font-size: 18px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.channel-icon.whatsapp { background-color: #dcfce7; color: #15803d; }
.channel-icon.voice { background-color: #fef3c7; color: #b45309; }
.channel-icon.sms { background-color: #e0f2fe; color: #0369a1; }

.channel-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--slate-800);
  line-height: 1.2;
}

.channel-desc {
  font-size: 11px;
  color: var(--slate-400);
}

.channel-values {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-left: 44px;
}

.channel-vol {
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-700);
  white-space: nowrap;
}

.channel-bar-container {
  flex: 1;
  height: 6px;
  background-color: var(--slate-100);
  border-radius: 999px;
  overflow: hidden;
}

.channel-bar-fill {
  height: 100%;
  border-radius: 999px;
}

.whatsapp-bar { background-color: #22c55e; }
.voice-bar { background-color: #f59e0b; }
.sms-bar { background-color: #06b6d4; }

.channel-summary-note {
  display: flex;
  gap: 10px;
  background-color: var(--slate-50);
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.info-icon {
  font-size: 16px;
}

.channel-summary-note p {
  font-size: 12px;
  color: var(--slate-500);
  line-height: 1.4;
}

/* Rep dispatches */
.flex-row-responsive {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rule-indicator-badge {
  padding: 6px 12px;
  background-color: var(--color-primary-light);
  border: 1px solid var(--emerald-200);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: var(--emerald-800);
}

.trigger-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.trigger-badge.high { background-color: #fee2e2; color: #991b1b; }
.trigger-badge.medium { background-color: #ffedd5; color: #9a3412; }
.trigger-badge.low { background-color: #f1f5f9; color: #334155; }

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.scheduled { background-color: #e0f2fe; color: #0369a1; }
.status-badge.in-progress { background-color: #fef3c7; color: #b45309; }
.status-badge.completed { background-color: #dcfce7; color: #15803d; }

/* Responsive adjustments */
@media (max-width: 1200px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    transform: translateY(-100%);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    padding-top: 80px;
  }

  .admin-sidebar.sidebar-open {
    transform: translateY(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }

  .main-content-panel {
    max-width: 100%;
    padding: 24px;
  }

  .sidebar-toggle-btn {
    display: flex;
    z-index: 101;
  }

  .dashboard-header {
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .ab-comparison-box {
    gap: 12px;
  }
  .variant-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .variant-metrics {
    padding-left: 0;
    width: 100%;
    justify-content: space-between;
    border-top: 1px dashed var(--color-border);
    padding-top: 12px;
  }
  .flex-row-responsive {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Real-Time Micro-Animations */
@keyframes rowPulse {
  0% { background-color: rgba(16, 185, 129, 0.2); }
  100% { background-color: transparent; }
}

.new-dispatch-row {
  animation: rowPulse 2.5s ease-out;
}

@keyframes kpiPulse {
  0% { transform: scale(1); box-shadow: var(--shadow-md); }
  50% { 
    transform: scale(1.03); 
    border-color: var(--color-primary); 
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.25), 0 4px 6px -2px rgba(16, 185, 129, 0.15); 
  }
  100% { transform: scale(1); box-shadow: var(--shadow-md); }
}

.pulse-highlight {
  animation: kpiPulse 1.8s ease-in-out;
}
</style>
