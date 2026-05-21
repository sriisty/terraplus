<template>
  <div class="web-page-wrapper farmer-dashboard">
    <!-- Dynamic Background Blobs -->
    <div class="bg-blob-container">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
    </div>
    <!-- Header Nav -->
    <header class="dashboard-topbar">
      <div class="brand-container">
        <span class="brand-icon">🌱</span>
        <span class="brand-name">Terrapulse</span>
      </div>
      
      <div class="profile-summary">
        <div class="info-pill">
          <Sprout :size="16" class="emerald-text" />
          <span>{{ farmerCrop }}</span>
        </div>
        <div class="info-pill">
          <MapPin :size="16" class="emerald-text" />
          <span>{{ districtName }}</span>
        </div>
        <div class="language-dropdown">
          <span>🌐 {{ farmerLanguage }}</span>
        </div>
        <div class="user-avatar-pill">
          <User :size="16" />
          <span class="desktop-only">{{ farmerName }}</span>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="dashboard-content">
      <div class="dashboard-grid">
        
        <!-- Left Main Column -->
        <main class="main-column">
          <!-- Welcome and weather widget row -->
          <section class="welcome-row card glass-card hover-lift animate-fade-in-up">
            <div class="welcome-text">
              <h2>Namaste, {{ farmerName }}!</h2>
              <p>Here is the real-time status of your crop in {{ districtName }}. Monitor disease risks and take recommended actions below.</p>
            </div>
            <div class="weather-widget">
              <div class="temp-box">
                <Thermometer :size="24" class="temp-icon" />
                <div>
                  <strong>32°C</strong>
                  <span>Temp</span>
                </div>
              </div>
              <div class="temp-box">
                <CloudRain :size="24" class="rain-icon" />
                <div>
                  <strong>82%</strong>
                  <span>Humidity</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Alert Banner -->
          <section class="alert-banner-custom animate-fade-in-up delay-1" :class="[cropNameClean.toLowerCase(), pestAlert.level === 'High Risk' ? 'glow-red' : 'glow-amber']">
            <div class="alert-icon-wrapper">
              <AlertTriangle :size="24" />
            </div>
            <div class="alert-body">
              <div class="alert-meta">
                <span class="alert-title">{{ pestAlert.title }}</span>
                <span class="alert-badge">{{ pestAlert.level }}</span>
              </div>
              <p class="alert-description">{{ pestAlert.desc }}</p>
            </div>
          </section>

          <!-- Crop Growth Stage Tracker Card -->
          <section class="card growth-tracker-card glass-card hover-lift animate-fade-in-up delay-1">
            <div class="card-header-simple">
              <h3>Crop Timeline — {{ farmerCrop }}</h3>
              <span class="badge time-badge">⏱ Harvest in ~45 days</span>
            </div>
            
            <div class="timeline-steps">
              <div class="timeline-line"></div>
              <div class="timeline-line-fill" :style="timelineStyle">
                <div class="glossy-sweep"></div>
              </div>
              
              <div class="timeline-step done">
                <div class="step-circle">✓</div>
                <div class="step-label">
                  <strong>Sowing</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div class="timeline-step done">
                <div class="step-circle">✓</div>
                <div class="step-label">
                  <strong>Vegetative Growth</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div class="timeline-step active">
                <div class="step-circle pulse-circle">🌸</div>
                <div class="step-label">
                  <strong>Flowering / Tubering</strong>
                  <span class="active-tag">Active Stage</span>
                </div>
              </div>

              <div class="timeline-step pending">
                <div class="step-circle">🌾</div>
                <div class="step-label">
                  <strong>Harvest Window</strong>
                  <span>Future</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Personalized Recommended Solution Card -->
          <section class="card product-card glass-card hover-lift animate-fade-in-up delay-2">
            <div class="product-badge">RECOMMENDED SOLUTION</div>
            <div class="product-main">
              <div class="product-visual">
                <span class="product-icon-emoji">{{ recommendedProduct.icon }}</span>
              </div>
              <div class="product-details">
                <span class="product-category">{{ recommendedProduct.category }}</span>
                <h2>{{ recommendedProduct.name }}</h2>
                <p class="product-desc">{{ recommendedProduct.desc }}</p>
                
                <div class="dosage-table">
                  <div class="dosage-row">
                    <strong>Recommended Dose:</strong>
                    <span>{{ recommendedProduct.dosage }}</span>
                  </div>
                  <div class="dosage-row">
                    <strong>Best Timing:</strong>
                    <span>{{ recommendedProduct.timing }}</span>
                  </div>
                </div>

                <div class="product-actions">
                  <button class="btn btn-secondary active-scale">
                    <span>View Safety Manual</span>
                  </button>
                  <button class="btn btn-primary active-scale">
                    <span>Find Local Retailer</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- Right Sidebar Column -->
        <aside class="sidebar-column">
          <!-- Ask Terrapulse AI Chatbot -->
          <section class="card chatbot-card glass-card hover-lift animate-fade-in-up delay-3">
            <div class="chatbot-header">
              <div class="bot-avatar">🤖</div>
              <div>
                <h3>Ask Terrapulse AI</h3>
                <span class="online-indicator">
                  <span class="dot"></span> Online Agronomist
                </span>
              </div>
            </div>

            <!-- Chat message bubble area -->
            <div class="chat-message-area" ref="chatContainer">
              <TransitionGroup name="chat-list">
                <div 
                  v-for="(msg, idx) in chatMessages" 
                  :key="'msg-' + idx" 
                  class="chat-bubble-wrapper"
                  :class="msg.sender"
                >
                  <div class="chat-bubble" :class="msg.sender">
                    <p>{{ msg.text }}</p>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Typing indicator -->
              <div v-if="isChatTyping" class="chat-bubble-wrapper ai">
                <div class="chat-bubble ai typing">
                  <div class="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prompt Chips -->
            <div class="quick-prompt-chips">
              <button 
                v-for="(chip, idx) in promptChips" 
                :key="idx" 
                @click="sendChatMessage(chip.query)"
                class="chip-btn active-scale"
              >
                {{ chip.text }}
              </button>
            </div>

            <!-- Chat input -->
            <div class="chat-input-row">
              <input 
                type="text" 
                v-model="chatInputText" 
                @keyup.enter="sendChatMessage(chatInputText)" 
                placeholder="Ask about dosage, irrigation..." 
                class="hover-lift"
              />
              <button @click="sendChatMessage(chatInputText)" class="send-message-btn active-scale">
                <Send :size="16" />
              </button>
            </div>
          </section>

          <!-- Grower Pride Camera Promo -->
          <section class="card grower-pride-promo-card glass-card hover-lift animate-fade-in-up delay-4">
            <div class="promo-content">
              <Camera :size="32" class="camera-icon-promo" />
              <h3>Show Your Grower Pride! 📸</h3>
              <p>Upload a picture of your healthy field and crop to generate a customized, shareable brand poster for WhatsApp.</p>
              <router-link to="/selfie" class="btn btn-primary btn-promo active-scale">
                <span>Open AI Poster Studio</span>
                <ChevronRight :size="16" />
              </router-link>
            </div>
          </section>
        </aside>

      </div>
    </div>

    <!-- Mobile Navigation Bar -->
    <nav class="mobile-bottom-bar">
      <router-link to="/home" class="mobile-nav-item active">
        <span class="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/inbox" class="mobile-nav-item">
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Send, 
  MessageSquare, 
  Camera, 
  User, 
  ChevronRight, 
  HelpCircle,
  Thermometer,
  CloudRain,
  CheckCircle2
} from 'lucide-vue-next'

// LocalStorage references
const farmerName = ref(localStorage.getItem('farmer_name') || "Ram Singh")
const farmerLanguage = ref(localStorage.getItem('farmer_language') || "Hindi")
const farmerCrop = ref(localStorage.getItem('farmer_crop') || "🌾 Wheat")
const farmerLocation = ref(localStorage.getItem('farmer_location') || "Uttar Pradesh · Agra")
const farmerSize = ref(localStorage.getItem('farmer_size') || "2–5 acres")

// Timeline animation state
const isMobileTimeline = ref(typeof window !== 'undefined' ? window.innerWidth <= 640 : false)
const timelineProgress = ref(66.6)

const timelineStyle = computed(() => {
  if (isMobileTimeline.value) {
    return { height: `${timelineProgress.value}%`, width: '4px' }
  } else {
    return { width: `${timelineProgress.value}%`, height: '4px' }
  }
})

// Chat container ref and scroll handler
const chatContainer = ref(null)

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }, 50)
  }
}

let checkMobile = null

onMounted(() => {
  // Timeline check on resize
  checkMobile = () => {
    isMobileTimeline.value = window.innerWidth <= 640
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  if (checkMobile) {
    window.removeEventListener('resize', checkMobile)
  }
})

// Crop details helper
const cropNameClean = computed(() => {
  return farmerCrop.value.replace(/[^a-zA-Z\s]/g, '').trim()
})

const districtName = computed(() => {
  const parts = farmerLocation.value.split('·')
  return parts.length > 1 ? parts[1].trim() : farmerLocation.value
})

// Personalization mappings
const pestAlert = computed(() => {
  const crop = cropNameClean.value.toLowerCase()
  if (crop === 'wheat') {
    return {
      title: "Pest Alert: Powdery Mildew Risk",
      level: "High Risk",
      desc: `High humidity (>80%) detected in ${districtName.value} district. Conditions are highly favorable for fungal infections in the flowering stage. Proactive spray is strongly recommended.`
    }
  } else if (crop === 'maize') {
    return {
      title: "Pest Alert: Fall Armyworm",
      level: "Medium Risk",
      desc: `Scattered alerts of Fall Armyworm reported in neighboring fields. Monitor the central whorl of maize crops daily. Apply insecticide immediately if feeding marks appear.`
    }
  } else if (crop === 'mustard') {
    return {
      title: "Pest Alert: Aphid Infestation",
      level: "High Risk",
      desc: `Cloudy weather and low temperatures expected this week in ${districtName.value}. This will accelerate aphid colony growth. Inspect crop stems and leaves.`
    }
  } else { // Potato
    return {
      title: "Pest Alert: Late Blight Warning",
      level: "High Risk",
      desc: `Persistent wet soils and fog in ${districtName.value} are optimal for Late Blight development. Spray preventive fungicide to secure tuber yield.`
    }
  }
})

const recommendedProduct = computed(() => {
  const crop = cropNameClean.value.toLowerCase()
  if (crop === 'wheat') {
    return {
      name: "Topik 15 WP",
      category: "Fungicide",
      icon: "🧪",
      desc: "Specially formulated for wheat crop protection during active growth and flowering. Highly effective against powdery mildew, rust, and narrow-leafed weeds.",
      dosage: "160 grams per acre, dissolved in 150 liters of water.",
      timing: "Apply during early morning when wind is low and leaves are dry."
    }
  } else if (crop === 'maize') {
    return {
      name: "Ampligo",
      category: "Insecticide",
      icon: "🐛",
      desc: "Fast-acting contact and ingestion insecticide targeting chewing pests. Excellent knockdown action against Fall Armyworm and stem borers.",
      dosage: "80 ml per acre, sprayed evenly over the foliage.",
      timing: "Spray in early evening when armyworm larvae are most active."
    }
  } else if (crop === 'mustard') {
    return {
      name: "Actara 25 WG",
      category: "Insecticide",
      icon: "🛡️",
      desc: "Systemic insecticide offering long-lasting protection against sucking pests like aphids, jassids, and whiteflies. Absorbed quickly by leaves.",
      dosage: "40 grams per acre, using clean spray equipment.",
      timing: "Apply at the first appearance of aphid colonies on flower heads."
    }
  } else { // Potato
    return {
      name: "Revus",
      category: "Fungicide",
      icon: "🥔",
      desc: "Premium crop protection against Late Blight in potatoes. Rainfast within rain-wash zones, protecting new growing leaves.",
      dosage: "250 ml per acre in 200 liters of water.",
      timing: "Apply preventively or immediately when weather flags late blight humidity."
    }
  }
})

// Chatbot setup
const chatInputText = ref("")
const isChatTyping = ref(false)
const chatMessages = ref([
  {
    sender: 'ai',
    text: `Hello! I am your Terrapulse AI assistant. I see you are growing ${farmerCrop.value} in ${districtName.value} on a ${farmerSize.value} plot. How can I help you today?`
  }
])

watch([chatMessages, isChatTyping], () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

const promptChips = computed(() => {
  const crop = cropNameClean.value
  return [
    { text: `💧 ${crop} Irrigation`, query: `What are the best irrigation practices for my ${crop} crop?` },
    { text: `🐛 Pest Control`, query: `How do I protect my ${crop} against the current regional pest threats?` },
    { text: `💊 Dosage Guide`, query: `What is the exact recommended dose and timing for applying ${recommendedProduct.value.name}?` }
  ]
})

const sendChatMessage = (text) => {
  if (!text.trim()) return
  
  // User message
  chatMessages.value.push({
    sender: 'user',
    text: text
  })
  chatInputText.value = ""
  isChatTyping.value = true

  // Simulate AI typing and response
  setTimeout(() => {
    isChatTyping.value = false
    let reply = ""
    const query = text.toLowerCase()
    
    if (query.includes('irrigation') || query.includes('water') || query.includes('irrigate')) {
      reply = `For ${farmerCrop.value}, maintaining moisture is crucial. We suggest irrigating at key stages: Sowing/Crown root initiation, Tillering, and Flowering. Avoid waterlogging which can trigger fungal root infections.`
    } else if (query.includes('pest') || query.includes('bug') || query.includes('mildew') || query.includes('blight') || query.includes('rust')) {
      reply = `We have flagged a ${pestAlert.value.level} alert for ${cropNameClean.value} in ${districtName.value}. We recommend a preventive application of ${recommendedProduct.value.name}. Be sure to inspect the crop leaves daily.`
    } else if (query.includes('dosage') || query.includes('dose') || query.includes('apply') || query.includes('spray')) {
      reply = `The recommended dosage for ${recommendedProduct.value.name} is **${recommendedProduct.value.dosage}**. ${recommendedProduct.value.timing}. Always wear protective gloves and mask when spraying.`
    } else {
      reply = `Thank you for your question about ${cropNameClean.value}. Based on your local profile in ${districtName.value}, we advise maintaining clean fields, verifying soil moisture, and consulting our local distributor or field rep for a free diagnostics visit if you notice leaf discoloration.`
    }

    chatMessages.value.push({
      sender: 'ai',
      text: reply
    })
  }, 650)
}
</script>

<style scoped>
.farmer-dashboard {
  background-color: var(--slate-100);
  min-height: 100vh;
}

/* Dashboard Topbar Styling */
.dashboard-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
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

.profile-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--slate-100);
  border: 1px solid var(--slate-200);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-700);
}

.emerald-text {
  color: var(--emerald-600);
}

.language-dropdown {
  background-color: var(--slate-50);
  border: 1px solid var(--slate-200);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-700);
}

.user-avatar-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--emerald-50);
  color: var(--emerald-800);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

/* Dashboard Content Grid */
.dashboard-content {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Welcome Row */
.welcome-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
}

.welcome-text h2 {
  font-size: 24px;
  font-weight: 800;
  color: var(--slate-900);
  margin-bottom: 4px;
}

.welcome-text p {
  font-size: 14px;
  color: var(--slate-500);
  line-height: 1.5;
}

.weather-widget {
  display: flex;
  gap: 16px;
}

.temp-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--slate-50);
  border: 1px solid var(--slate-200);
  padding: 12px 18px;
  border-radius: var(--radius-md);
}

.temp-icon { color: #f59e0b; }
.rain-icon { color: #3b82f6; }

.temp-box strong {
  display: block;
  font-size: 18px;
  color: var(--slate-800);
}

.temp-box span {
  font-size: 11px;
  color: var(--slate-400);
  text-transform: uppercase;
}

/* Alert Banner Styling */
.alert-banner-custom {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-lg);
  border-left: 6px solid #ef4444;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.alert-banner-custom.wheat { background-color: #fef2f2; border-color: #ef4444; color: #991b1b; }
.alert-banner-custom.maize { background-color: #fffbeb; border-color: #f59e0b; color: #92400e; }
.alert-banner-custom.mustard { background-color: #fef2f2; border-color: #ef4444; color: #991b1b; }
.alert-banner-custom.potato { background-color: #fef2f2; border-color: #ef4444; color: #991b1b; }

.alert-icon-wrapper {
  background-color: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.wheat .alert-icon-wrapper { color: #ef4444; }
.maize .alert-icon-wrapper { color: #f59e0b; }
.mustard .alert-icon-wrapper { color: #ef4444; }
.potato .alert-icon-wrapper { color: #ef4444; }

.alert-body {
  flex: 1;
}

.alert-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.alert-title {
  font-size: 16px;
  font-weight: 700;
}

.alert-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.maize .alert-badge {
  background-color: rgba(245, 158, 11, 0.1);
}

.alert-description {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
}

/* Crop Progress Timeline */
.growth-tracker-card {
  padding: 24px;
}

.card-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header-simple h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--slate-900);
}

.time-badge {
  background-color: var(--emerald-50);
  color: var(--emerald-800);
  font-weight: 600;
  padding: 4px 10px;
}

.timeline-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding-bottom: 12px;
}

.timeline-line {
  position: absolute;
  top: 20px;
  left: 30px;
  right: 30px;
  height: 4px;
  background-color: var(--slate-200);
  z-index: 1;
}

.timeline-line-fill {
  position: absolute;
  top: 20px;
  left: 30px;
  height: 4px;
  background: linear-gradient(90deg, var(--emerald-400), var(--emerald-600));
  z-index: 1;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1), height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
  overflow: hidden; /* For glossy sweep */
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  text-align: center;
  flex: 1;
}

.step-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--slate-200);
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--slate-500);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  font-size: 16px;
}

.timeline-step.done .step-circle {
  background-color: var(--emerald-600);
  color: white;
}

.timeline-step.active .step-circle {
  background-color: var(--emerald-600);
  border-color: var(--emerald-100);
  color: white;
}

.pulse-circle {
  position: relative;
}

.pulse-circle::before, .pulse-circle::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid var(--emerald-400);
  opacity: 0;
  pointer-events: none;
}

.pulse-circle::before {
  animation: ripple 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
.pulse-circle::after {
  animation: ripple 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.25s;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.step-label {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  padding: 0 8px;
}

.step-label strong {
  font-size: 13px;
  color: var(--slate-800);
}

.step-label span {
  font-size: 11px;
  color: var(--slate-400);
}

.timeline-step.active .step-label strong {
  color: var(--emerald-600);
}

.active-tag {
  color: var(--emerald-600) !important;
  font-weight: 700;
}

/* Recommended Solution Card */
.product-card {
  position: relative;
  overflow: hidden;
}

.product-badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--emerald-600);
  color: white;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 6px 16px;
  border-bottom-right-radius: var(--radius-sm);
}

.product-main {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.product-visual {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-md);
  background-color: var(--slate-50);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-icon-emoji {
  font-size: 48px;
}

.product-details {
  flex: 1;
}

.product-category {
  font-size: 11px;
  font-weight: 700;
  color: var(--slate-400);
  text-transform: uppercase;
}

.product-details h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--slate-900);
  margin-top: 2px;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 14px;
  color: var(--slate-600);
  line-height: 1.5;
  margin-bottom: 16px;
}

.dosage-table {
  background-color: var(--slate-50);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dosage-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.dosage-row strong {
  color: var(--slate-700);
}

.dosage-row span {
  color: var(--slate-900);
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 12px;
}

.product-actions button {
  flex: 1;
}

/* Chatbot Card Styling */
.chatbot-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 480px; /* Fixed height for chatbot box */
}

.chatbot-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.bot-avatar {
  font-size: 28px;
  background-color: var(--emerald-50);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--emerald-600);
  font-weight: 600;
}

.online-indicator .dot {
  width: 6px;
  height: 6px;
  background-color: var(--emerald-500);
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.9; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 0.9; }
}

.chat-message-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-bubble-wrapper {
  display: flex;
  width: 100%;
}

.chat-bubble-wrapper.ai {
  justify-content: flex-start;
}

.chat-bubble-wrapper.user {
  justify-content: flex-end;
}

.chat-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.4;
}

.chat-bubble p {
  margin: 0;
  white-space: pre-line;
}

.chat-bubble.ai {
  background-color: var(--slate-100);
  color: var(--slate-800);
  border-bottom-left-radius: 2px;
}

.chat-bubble.user {
  background-color: var(--emerald-600);
  color: white;
  border-bottom-right-radius: 2px;
}

/* Chat bubble typing effect */
.typing-dots {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

@keyframes typingWave {
  0%, 100% {
    transform: translateY(0);
    background-color: var(--slate-400);
  }
  50% {
    transform: translateY(-6px);
    background-color: var(--emerald-500);
  }
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background-color: var(--slate-400);
  border-radius: 50%;
  display: inline-block;
  animation: typingWave 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.15s; }
.typing-dots span:nth-child(3) { animation-delay: 0.3s; }

/* Chat Transition Animations */
.chat-list-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-list-leave-to {
  opacity: 0;
}

.quick-prompt-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.quick-prompt-chips::-webkit-scrollbar {
  display: none;
}

.chip-btn {
  background-color: white;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--slate-600);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: auto;
}

.chip-btn:hover {
  background-color: var(--slate-50);
  border-color: var(--slate-400);
  color: var(--slate-800);
}

.chat-input-row {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.chat-input-row input {
  flex: 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  padding: 10px 14px;
  font-size: 13px;
  background-color: var(--slate-50);
  min-height: auto;
}

.send-message-btn {
  background-color: var(--emerald-600);
  color: white;
  border: 0;
  border-radius: var(--radius-md);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0;
  min-height: auto;
}

.send-message-btn:hover {
  background-color: var(--emerald-700);
}

/* Grower Pride Promo Card */
.grower-pride-promo-card {
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, var(--slate-900) 0%, var(--emerald-950) 100%);
  color: white;
  border: 0;
}

.camera-icon-promo {
  color: var(--emerald-400);
  margin-bottom: 12px;
}

.grower-pride-promo-card h3 {
  font-size: 16px;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
}

.grower-pride-promo-card p {
  font-size: 12px;
  color: var(--slate-300);
  line-height: 1.4;
  margin-bottom: 16px;
}

.btn-promo {
  width: 100%;
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

/* Desktop and Laptop Responsiveness */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-topbar {
    padding: 12px 16px;
  }
  .dashboard-content {
    padding: 16px;
    padding-bottom: 80px; /* Space for mobile nav */
  }
  .mobile-bottom-bar {
    display: flex;
  }
  .desktop-only {
    display: none;
  }
  .welcome-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .weather-widget {
    width: 100%;
  }
  .temp-box {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .timeline-steps {
    flex-direction: column;
    gap: 24px;
    padding-left: 16px;
  }
  .timeline-line {
    top: 20px;
    bottom: 20px;
    left: 20px;
    width: 4px;
    height: auto;
  }
  .timeline-line-fill {
    left: 20px;
    top: 20px;
  }
  .timeline-step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    gap: 16px;
  }
  .step-label {
    margin-top: 0;
  }
  .product-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .dosage-row {
    flex-direction: column;
    gap: 4px;
    text-align: left;
  }
  .product-actions {
    flex-direction: column;
  }
}
</style>
