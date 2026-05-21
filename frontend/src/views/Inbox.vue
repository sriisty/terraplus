<template>
  <div class="web-page-wrapper inbox-page">
    <!-- Dynamic Background Blobs -->
    <div class="bg-blob-container">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
    </div>
    
    <!-- Top Nav Header -->
    <header class="inbox-topbar">
      <div class="brand-container">
        <span class="brand-icon">💬</span>
        <span class="brand-name">Terrapulse Messages</span>
      </div>
      <div class="unread-badge-container">
        <span class="unread-pill">{{ unreadCount }} Unread Alerts</span>
      </div>
    </header>

    <!-- Split-Pane Workspace -->
    <div class="inbox-container">
      <div class="inbox-split-pane" :class="{ 'detail-view-active': isMobileActiveDetail }">
        
        <!-- Left Pane: Message List -->
        <aside class="message-list-pane">
          <div class="pane-header">
            <h3>Inbox Feed</h3>
            <span class="sub">Personalized Alerts & Advisory Logs</span>
          </div>

          <div class="messages-list">
            <button 
              v-for="(msg, idx) in messages" 
              :key="msg.id"
              @click="selectMessage(msg.id)"
              class="message-list-item animate-fade-in-up active-scale"
              :class="['delay-' + (idx + 1), { active: selectedMsgId === msg.id, unread: msg.isUnread }]"
            >
              <div class="msg-item-header">
                <span class="channel-badge" :class="msg.channel.toLowerCase().replace(/[^a-z0-9]/g, '-')">
                  {{ msg.channelIcon }} {{ msg.channel }}
                </span>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <h4 class="msg-title">{{ msg.title }}</h4>
              <p class="msg-summary">{{ msg.summary }}</p>
              <div class="msg-status-row">
                <span class="receptivity-rating" v-if="msg.score">
                  AI Receptivity Score: <strong>{{ msg.score }}</strong>
                </span>
                <span class="unread-dot" v-if="msg.isUnread"></span>
              </div>
            </button>
          </div>
        </aside>

        <!-- Right Pane: Message Detail Pane -->
        <main class="message-detail-pane">
          <!-- Back button on mobile view -->
          <div class="mobile-back-bar">
            <button @click="isMobileActiveDetail = false" class="back-link-btn active-scale">
              <ArrowLeft :size="16" />
              <span>Back to Inbox List</span>
            </button>
          </div>

          <transition name="fade-slide" mode="out-in">
            <div v-if="activeMessage" :key="activeMessage.id" class="active-msg-content">
              <!-- Header metadata -->
              <div class="detail-header-card glass-card hover-lift animate-fade-in-up">
                <div class="detail-channel-meta">
                  <span class="channel-badge-large" :class="activeMessage.channel.toLowerCase().replace(/[^a-z0-9]/g, '-')">
                    {{ activeMessage.channelIcon }} Campaign Outbound: {{ activeMessage.channel }}
                  </span>
                  <span class="time-label">{{ activeMessage.time }}</span>
                </div>
                <h2 class="detail-msg-title">{{ activeMessage.title }}</h2>
                
                <div class="delivery-status-box">
                  <div class="status-item" :class="{ visible: deliverySteps.delivered }">
                    <CheckCheck :size="16" class="status-check-icon blue" />
                    <span>Delivered successfully</span>
                  </div>
                  <div class="status-item" :class="{ visible: deliverySteps.read }">
                    <CheckCheck :size="16" class="status-check-icon blue" />
                    <span>Opened / Read by Farmer</span>
                  </div>
                  <div class="status-item" :class="{ visible: deliverySteps.feedback && voteStatus[activeMessage.id] }">
                    <CheckCircle2 :size="16" class="status-check-icon green" />
                    <span>Feedback Collected</span>
                  </div>
                </div>
              </div>

              <!-- Chat / Message Bubble Simulator -->
              <div class="bubble-simulator-container glass-dark-card hover-lift animate-fade-in-up delay-1">
                <div class="device-preview-header">
                  <span class="dot-btn red"></span>
                  <span class="dot-btn yellow"></span>
                  <span class="dot-btn green"></span>
                  <span class="title-text">Official Notification Preview</span>
                </div>
                
                <div class="device-body-preview">
                  <!-- If WhatsApp, render as a clean WhatsApp message card with green heading -->
                  <div v-if="activeMessage.channel.includes('WhatsApp')" class="whatsapp-bubble">
                    <div class="wa-header-green">
                      <span>🌱 Terrapulse Business Assistant</span>
                      <span class="verified-tick">✓ Verified</span>
                    </div>
                    <div class="wa-body-text">
                      <p>{{ activeMessage.body }}</p>
                    </div>
                    <div class="wa-time-row">
                      <span>{{ activeMessage.time }}</span>
                      <span class="ticks">✓✓</span>
                    </div>
                  </div>

                  <!-- If SMS, render as a sleek terminal SMS layout -->
                  <div v-else-if="activeMessage.channel.includes('SMS')" class="sms-bubble">
                    <span class="sms-sender">From: TD-TRAPLS</span>
                    <div class="sms-body-text">
                      <p>{{ activeMessage.body }}</p>
                    </div>
                    <span class="sms-time">{{ activeMessage.time }}</span>
                  </div>

                  <!-- If IVR, render as a voice call visualizer -->
                  <div v-else class="voice-bubble">
                    <div class="voice-header">
                      <span>📞 Voice Outbound Call Record</span>
                    </div>
                    <div class="voice-audio-preview">
                      <span class="wave-anim">📊</span>
                      <div class="audio-timer">
                        <strong>0:45</strong>
                        <span>Audio Advisory Transcript</span>
                      </div>
                    </div>
                    <p class="voice-text">"{{ activeMessage.body }}"</p>
                  </div>
                </div>
              </div>

              <!-- Interactive Feedback Loop & Rep Dispatching -->
              <div class="interactive-sandbox card glass-card hover-lift animate-fade-in-up delay-2">
                <div class="sandbox-head">
                  <Sparkles :size="18" class="emerald-text" />
                  <h4>Grower Response Loop</h4>
                </div>

                <!-- Vote thumbs -->
                <div class="vote-section">
                  <p>Was this campaign alert useful and accurate for your farm?</p>
                  
                  <div class="vote-buttons" v-if="!voteStatus[activeMessage.id]">
                    <button @click="handleVote(activeMessage.id, 'up')" class="btn-vote positive active-scale">
                      <ThumbsUp :size="16" />
                      <span>Yes, helpful</span>
                    </button>
                    <button @click="handleVote(activeMessage.id, 'down')" class="btn-vote negative active-scale">
                      <ThumbsDown :size="16" />
                      <span>Not relevant</span>
                    </button>
                  </div>
                  <div v-else class="feedback-success-message animate-fade-in-up">
                    <span class="check-icon">✓</span>
                    <span v-if="voteStatus[activeMessage.id] === 'up'">
                      Rated helpful! Feedback routed to Terrapulse AI marketing models.
                    </span>
                    <span v-else>
                      Rated irrelevant. Learning models will adjust vernacular routing rules for your region.
                    </span>
                  </div>
                </div>

                <!-- Dispatch representative action -->
                <div class="sandbox-action-section">
                  <p class="desc-text" v-if="activeMessage.type === 'alert'">
                    Need direct assistance? You can dispatch a certified Syngenta representative to check your field for fungal infection.
                  </p>
                  <p class="desc-text" v-else-if="activeMessage.type === 'visit'">
                    Schedule a face-to-face appointment with field representative सुरेश कुमार (Suresh Kumar) during his upcoming visit.
                  </p>
                  <p class="desc-text" v-else>
                    Request our voice system to call your phone number with direct audio guides.
                  </p>

                  <div v-if="!actionDispatched[activeMessage.id]">
                    <button 
                      @click="dispatchAction(activeMessage.id)" 
                      class="btn btn-primary btn-action-dispatch active-scale"
                    >
                      <span v-if="activeMessage.type === 'alert'">Request Field Representative Inspection</span>
                      <span v-else-if="activeMessage.type === 'visit'">Confirm Free Consultation Slot</span>
                      <span v-else>Request IVR Phone Callback</span>
                    </button>
                  </div>
                  <div v-else class="action-success-card animate-fade-in-up">
                    <CheckCircle2 :size="20" class="success-alert-icon" />
                    <div>
                      <strong>Action Dispatched Automatically!</strong>
                      <p v-if="activeMessage.type === 'alert' || activeMessage.type === 'visit'">
                        Rep {{ activeMessage.repName }} has been notified. They will contact you shortly to coordinate a field visit in {{ districtName }}.
                      </p>
                      <p v-else>
                        A voice callback has been scheduled for your registered phone number.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div v-else class="empty-detail-state animate-fade-in-up">
              <span class="envelope-icon">✉️</span>
              <h3>Select a message</h3>
              <p>Click on any alert in the sidebar list to inspect the outbound campaign template and submit feedback logs.</p>
            </div>
          </transition>
        </main>

      </div>
    </div>

    <!-- Mobile Navigation Bar -->
    <nav class="mobile-bottom-bar">
      <router-link to="/home" class="mobile-nav-item">
        <span class="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/inbox" class="mobile-nav-item active">
        <span class="mobile-nav-icon">💬</span>
        <span>Messages</span>
      </router-link>
      <router-link to="/selfie" class="mobile-nav-item">
        <span class="mobile-nav-icon">📸</span>
        <span>Poster Studio</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Check, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Smartphone, 
  Sparkles, 
  CheckCheck
} from 'lucide-vue-next'

const selectedMsgId = ref(1)
const isMobileActiveDetail = ref(false)

const farmerCrop = ref(localStorage.getItem('farmer_crop') || "🌾 Wheat")
const farmerLocation = ref(localStorage.getItem('farmer_location') || "Uttar Pradesh · Agra")
const farmerSize = ref(localStorage.getItem('farmer_size') || "2–5 acres")

const deliverySteps = ref({ delivered: false, read: false, feedback: false })
let deliveryTimer = null

const triggerDeliveryAnimation = (msgId) => {
  if (deliveryTimer) clearTimeout(deliveryTimer)
  deliverySteps.value = { delivered: false, read: false, feedback: false }
  
  setTimeout(() => {
    deliverySteps.value.delivered = true
  }, 200)
  
  setTimeout(() => {
    deliverySteps.value.read = true
  }, 600)
  
  deliveryTimer = setTimeout(() => {
    deliverySteps.value.feedback = true
  }, 1000)
}

onMounted(() => {
  triggerDeliveryAnimation(selectedMsgId.value)
})

const cropName = computed(() => {
  return farmerCrop.value.replace(/[^a-zA-Z\s]/g, '').trim()
})

const districtName = computed(() => {
  const parts = farmerLocation.value.split('·')
  return parts.length > 1 ? parts[1].trim() : farmerLocation.value
})

const messages = ref([
  {
    id: 1,
    title: `${cropName.value} Alert: Fungal Risk`,
    summary: `Apply crop protection this week — critical growth stage detected.`,
    body: cropName.value.toLowerCase() === 'maize' 
      ? `किसान भाइयों, आपके क्षेत्र में मक्का की फसल में फॉल आर्मीवर्म (Fall Armyworm) कीट का खतरा बढ़ गया है। सुरक्षा हेतु आज ही Ampligo का 80ml/एकड़ की दर से स्प्रे करें।`
      : cropName.value.toLowerCase() === 'mustard'
      ? `किसान भाइयों, आपके क्षेत्र में सरसों की फसल में चेपा (Aphid Infestation) कीट का खतरा बढ़ गया है। सुरक्षा हेतु आज ही Actara 25 WG का 40g/एकड़ की दर से स्प्रे करें।`
      : cropName.value.toLowerCase() === 'potato'
      ? `किसान भाइयों, आपके क्षेत्र में आलू की फसल में पछेता झुलसा (Late Blight) रोग का खतरा बढ़ गया है। सुरक्षा हेतु आज ही Revus का 250ml/एकड़ की दर से स्प्रे करें।`
      : `किसान भाइयों, आपके क्षेत्र में आर्द्रता अधिक होने से गेहूं की फसल में फफूंद संक्रमण (Yellow Rust) का खतरा बढ़ गया है। फूल आने की अवस्था (Flowering Stage) में सुरक्षा हेतु आज ही Topik 15 WP का 160g/एकड़ की दर से 150 लीटर पानी में घोल बनाकर सुबह के समय छिड़काव करें।`,
    channel: `WhatsApp`,
    channelIcon: `💬`,
    time: `Today, 8:00 AM`,
    isUnread: true,
    score: `94%`,
    repName: `Suresh Kumar`,
    type: `alert`
  },
  {
    id: 2,
    title: `Field Representative Visit`,
    summary: `Field rep Suresh Kumar will visit ${districtName.value} tehsil on May 21. Book free slot.`,
    body: `नमस्ते राम सिंह जी, हमारे कृषि विशेषज्ञ सुरेश कुमार दिनांक 21 मई को आपके फतेहबाद (${districtName.value}) क्षेत्र में आ रहे हैं। यदि आपको अपनी फसल में किसी बीमारी का लक्षण दिख रहा है, तो निःशुल्क परामर्श के लिए आज ही अपना समय बुक करें।`,
    channel: `WhatsApp`,
    channelIcon: `💬`,
    time: `Yesterday, 4:15 PM`,
    isUnread: true,
    score: `88%`,
    repName: `Suresh Kumar`,
    type: `visit`
  },
  {
    id: 3,
    title: `${cropName.value} Care Tip`,
    summary: `Irrigate at critical growth stage for 15-20% better yield. Weather dry for 5 days.`,
    body: cropName.value.toLowerCase() === 'maize'
      ? `साप्ताहिक सलाह: आगामी 5 दिनों तक मौसम शुष्क रहने की संभावना है। मक्का में नर मंजरी (Tasseling) अवस्था के दौरान सिंचाई अवश्य करें, इससे भुट्टे का आकार बढ़ता है और पैदावार 15-20% तक बढ़ती है।`
      : cropName.value.toLowerCase() === 'mustard'
      ? `साप्ताहिक सलाह: आगामी 5 दिनों तक मौसम शुष्क रहने की संभावना है। सरसों में फूल आने की अवस्था के दौरान सिंचाई अवश्य करें, इससे फलियों में दानों की संख्या बढ़ती है और पैदावार 15-20% तक बढ़ती है।`
      : cropName.value.toLowerCase() === 'potato'
      ? `साप्ताहिक सलाह: आगामी 5 दिनों तक मौसम शुष्क रहने की संभावना है। आलू में कंद बनने (Tuberization) की अवस्था के दौरान हल्की सिंचाई अवश्य करें, इससे आलू का आकार बढ़ता है और पैदावार 15-20% तक बढ़ती है।`
      : `साप्ताहिक सलाह: आगामी 5 दिनों तक मौसम शुष्क रहने की संभावना है। गेहूँ में बाली निकलने से ठीक पहले सिंचाई अवश्य करें, इससे दानों का भराव अच्छा होता है और पैदावार 15-20% तक बढ़ती है।`,
    channel: `SMS`,
    channelIcon: `✉️`,
    time: `2 days ago`,
    isUnread: true,
    score: `76%`,
    repName: `Harpreet Singh`,
    type: `tip`
  },
  {
    id: 4,
    title: `Rabi 2025-26 Campaign Start`,
    summary: `Season campaign started. Welcome to Terrapulse AI alerts.`,
    body: `प्रिय किसान भाई, रबी सीजन 2025-26 के लिए टेरापल्स एआई में आपका स्वागत है। आपके खेत के आकार (${farmerSize.value}) और मुख्य फसल (${farmerCrop.value}) के आधार पर आपको इस पूरे सीजन समय-समय पर सही सलाह और सुरक्षा निर्देश प्राप्त होते रहेंगे।`,
    channel: `Voice (IVR)`,
    channelIcon: `📞`,
    time: `Oct 10, 2025`,
    isUnread: false,
    score: `91%`,
    repName: `Suresh Kumar`,
    type: `welcome`
  }
])

const unreadCount = computed(() => {
  return messages.value.filter(m => m.isUnread).length
})

const activeMessage = computed(() => {
  return messages.value.find(m => m.id === selectedMsgId.value) || messages.value[0]
})

const selectMessage = (id) => {
  selectedMsgId.value = id
  const msg = messages.value.find(m => m.id === id)
  if (msg) {
    msg.isUnread = false
  }
  isMobileActiveDetail.value = true
  triggerDeliveryAnimation(id)
}

const voteStatus = ref({}) // msgId -> 'up' or 'down'
const actionDispatched = ref({}) // msgId -> true/false

const handleVote = (msgId, status) => {
  voteStatus.value[msgId] = status
}

const dispatchAction = (msgId) => {
  actionDispatched.value[msgId] = true
}
</script>

<style scoped>
.inbox-page {
  background-color: var(--slate-100);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Inbox Topbar Header */
.inbox-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  font-size: 24px;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--emerald-600);
  letter-spacing: -0.025em;
}

.unread-badge-container {
  display: flex;
}

.unread-pill {
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
}

/* Content Container */
.inbox-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.inbox-split-pane {
  display: flex;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 100%;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* Left Pane: Message List */
.message-list-pane {
  width: 380px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: white;
}

.pane-header {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.pane-header h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--slate-900);
}

.pane-header .sub {
  font-size: 11px;
  color: var(--slate-400);
  font-weight: 600;
  text-transform: uppercase;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message-list-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 0;
  background-color: white;
  border-bottom: 1px solid var(--slate-100);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: auto;
}

.message-list-item:hover {
  background-color: var(--slate-50);
}

.message-list-item.active {
  background-color: var(--emerald-50) !important;
  border-left: 4px solid var(--emerald-600);
}

.msg-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.channel-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
}

.channel-badge.whatsapp { background-color: #25d36620; color: #25d366; }
.channel-badge.sms { background-color: #3b82f620; color: #3b82f6; }
.channel-badge.voice--ivr- { background-color: #7c3aed20; color: #7c3aed; }

.msg-time {
  font-size: 11px;
  color: var(--slate-400);
  font-weight: 500;
}

.msg-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--slate-800);
  margin-bottom: 4px;
}

.msg-summary {
  font-size: 12px;
  color: var(--slate-500);
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.msg-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.receptivity-rating {
  font-size: 11px;
  color: var(--slate-400);
}

.receptivity-rating strong {
  color: var(--slate-700);
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
}

/* Right Pane: Detail View */
.message-detail-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--slate-50);
  overflow-y: auto;
  position: relative;
}

.mobile-back-bar {
  display: none;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  padding: 12px 16px;
}

.back-link-btn {
  background: transparent;
  border: 0;
  color: var(--slate-600);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  min-height: auto;
}

.active-msg-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Detail header details */
.detail-header-card {
  background-color: white;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.detail-channel-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.channel-badge-large {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
}

.channel-badge-large.whatsapp { background-color: #25d36620; color: #25d366; }
.channel-badge-large.sms { background-color: #3b82f620; color: #3b82f6; }
.channel-badge-large.voice--ivr- { background-color: #7c3aed20; color: #7c3aed; }

.time-label {
  font-size: 12px;
  color: var(--slate-400);
  font-weight: 600;
}

.detail-msg-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--slate-900);
  margin-bottom: 16px;
}

.delivery-status-box {
  display: flex;
  gap: 16px;
  border-top: 1px solid var(--slate-100);
  padding-top: 16px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--slate-500);
  font-weight: 600;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.status-item.visible {
  opacity: 1;
  transform: translateX(0);
}

.status-check-icon.blue { color: #3b82f6; }
.status-check-icon.green { color: var(--emerald-600); }

/* Bubble simulator box */
.bubble-simulator-container {
  background-color: var(--slate-900);
  border-radius: var(--radius-lg);
  border: 1px solid var(--slate-800);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.device-preview-header {
  background-color: var(--slate-950);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--slate-800);
}

.dot-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot-btn.red { background-color: #ef4444; }
.dot-btn.yellow { background-color: #f59e0b; }
.dot-btn.green { background-color: #10b981; }

.device-preview-header .title-text {
  margin-left: 12px;
  color: var(--slate-500);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.device-body-preview {
  padding: 24px;
  display: flex;
  justify-content: center;
  background-color: #e5ddd5; /* WhatsApp chat background */
  min-height: 220px;
}

.whatsapp-bubble {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.wa-header-green {
  background-color: #075e54;
  color: white;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
}

.verified-tick {
  background-color: #128c7e;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
}

.wa-body-text {
  padding: 12px 14px;
}

.wa-body-text p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--slate-800);
}

.wa-time-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--slate-400);
  padding: 2px 12px 8px;
}

.wa-time-row .ticks {
  color: #34b7f1;
  font-weight: bold;
}

/* SMS style */
.sms-bubble {
  background-color: #f1f3f4;
  border: 1px solid var(--slate-300);
  border-radius: 16px;
  padding: 16px;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.sms-sender {
  font-size: 11px;
  font-weight: 700;
  color: var(--slate-500);
  margin-bottom: 6px;
}

.sms-body-text p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--slate-800);
}

.sms-time {
  align-self: flex-end;
  font-size: 10px;
  color: var(--slate-400);
  margin-top: 8px;
}

/* Voice Preview */
.voice-bubble {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--slate-200);
  padding: 20px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.voice-header {
  font-size: 12px;
  font-weight: 700;
  color: var(--slate-800);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.voice-audio-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--slate-50);
  border: 1px solid var(--slate-200);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  margin-bottom: 14px;
}

.wave-anim {
  font-size: 24px;
  animation: pulse-dot 1s infinite alternate;
}

.audio-timer {
  display: flex;
  flex-direction: column;
}

.audio-timer strong {
  font-size: 14px;
  color: var(--slate-800);
}

.audio-timer span {
  font-size: 10px;
  color: var(--slate-400);
}

.voice-text {
  font-size: 12.5px;
  font-style: italic;
  line-height: 1.4;
  color: var(--slate-600);
  margin: 0;
}

/* Feedback section styling */
.interactive-sandbox {
  padding: 24px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sandbox-head {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--slate-100);
  padding-bottom: 10px;
}

.sandbox-head h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: var(--slate-850);
}

.vote-section p, .sandbox-action-section p {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--slate-700);
  margin-bottom: 12px;
}

.vote-buttons {
  display: flex;
  gap: 12px;
}

.btn-vote {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  border: 1px solid var(--color-border);
  background-color: white;
  transition: all 0.2s ease;
  min-height: auto;
}

.btn-vote:hover {
  background-color: var(--slate-50);
}

.btn-vote.positive {
  color: var(--emerald-700);
}

.btn-vote.positive:hover {
  border-color: var(--emerald-400);
  background-color: var(--emerald-50);
}

.btn-vote.negative {
  color: #ef4444;
}

.btn-vote.negative:hover {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.feedback-success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--emerald-800);
  background-color: var(--emerald-50);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--emerald-200);
  font-weight: 600;
}

.feedback-success-message .check-icon {
  background-color: var(--emerald-600);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.sandbox-action-section {
  border-top: 1px solid var(--slate-100);
  padding-top: 20px;
}

.sandbox-action-section .desc-text {
  font-size: 12.5px;
  color: var(--slate-500);
  font-weight: normal;
  line-height: 1.5;
}

.btn-action-dispatch {
  width: 100%;
}

.action-success-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background-color: var(--emerald-50);
  border: 1px solid var(--emerald-200);
  border-radius: var(--radius-md);
  color: var(--emerald-900);
}

.success-alert-icon {
  color: var(--emerald-600);
  flex-shrink: 0;
  margin-top: 2px;
}

.action-success-card strong {
  font-size: 13.5px;
  display: block;
  margin-bottom: 2px;
}

.action-success-card p {
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
  color: var(--emerald-800);
  font-weight: normal;
}

/* Empty detail state */
.empty-detail-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  flex: 1;
  text-align: center;
  color: var(--slate-400);
}

.envelope-icon {
  font-size: 48px;
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-detail-state h3 {
  font-size: 18px;
  color: var(--slate-600);
  margin-bottom: 6px;
}

.empty-detail-state p {
  font-size: 13px;
  max-width: 320px;
  line-height: 1.5;
}

/* Mobile Bottom Navigation Bar (hidden on desktop) */
.mobile-bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid var(--color-border);
  justify-content: space-around;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 99;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: var(--slate-500);
  text-decoration: none;
  font-weight: 600;
}

.mobile-nav-item.active {
  color: var(--emerald-600);
}

.mobile-nav-icon {
  font-size: 20px;
}

/* Split Pane Responsiveness */
@media (max-width: 768px) {
  .inbox-topbar {
    padding: 12px 16px;
  }
  .inbox-container {
    padding: 0;
    border-radius: 0;
  }
  .inbox-split-pane {
    border-radius: 0;
    border: 0;
  }
  .message-list-pane {
    width: 100%;
    height: calc(100vh - 100px); /* Fill screen minus headers and footer */
  }
  .message-detail-pane {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    z-index: 20;
    background-color: var(--slate-50);
    transition: transform 0.25s ease;
  }
  .detail-view-active .message-detail-pane {
    transform: translateX(-100%);
  }
  .mobile-back-bar {
    display: block;
  }
  .active-msg-content {
    padding: 16px;
    padding-bottom: 100px;
  }
  .mobile-bottom-bar {
    display: flex;
  }
}
</style>
