<template>
  <div class="mobile-shell onboarding-screen">
    <div class="status-bar">
      <span>9:41 AM</span>
      <span>●●●●○ 4G 🔋 82%</span>
    </div>
    
    <div class="header">
      <h2>🌱 AgriPulse AI</h2>
    </div>

    <div class="content">
      <div class="welcome">
        <h1>Welcome, Farmer!</h1>
        <p>Tell us about yourself to get personalized crop advice & alerts</p>
      </div>

      <div class="form-group">
        <label>CHOOSE YOUR LANGUAGE</label>
        <div class="lang-grid">
          <button v-for="lang in ['हिंदी', 'ਪੰਜਾਬੀ', 'मराठी', 'ગુજ.', 'বাংলা', 'ಕನ್ನಡ']" 
                  :key="lang" 
                  class="lang-btn" 
                  :class="{ active: selectedLang === lang }"
                  @click="selectedLang = lang">
            {{ lang }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>YOUR MAIN CROP</label>
        <select v-model="selectedCrop">
          <option>🌾 Wheat</option>
          <option>🌽 Maize</option>
          <option>🌼 Mustard</option>
          <option>🥔 Potato</option>
        </select>
      </div>

      <div class="form-group">
        <label>STATE / DISTRICT</label>
        <select v-model="selectedLocation">
          <option>Uttar Pradesh · Agra</option>
          <option>Punjab · Ludhiana</option>
          <option>Bihar · Patna</option>
        </select>
      </div>

      <div class="form-group">
        <label>FARM SIZE</label>
        <select v-model="selectedSize">
          <option>2–5 acres</option>
          <option>5–10 acres</option>
          <option>10+ acres</option>
        </select>
      </div>
    </div>

    <div class="footer">
      <router-link to="/home" class="btn-primary">Get Started →</router-link>
      <p class="subtitle">Smart Farming Assistant</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedLang = ref('हिंदी')
const selectedCrop = ref('🌾 Wheat')
const selectedLocation = ref('Uttar Pradesh · Agra')
const selectedSize = ref('2–5 acres')
</script>

<style scoped>
.onboarding-screen {
  background: white;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 15px 20px;
  color: #1f7a4d;
}

.header h2 {
  margin: 0;
  font-size: 18px;
}

.content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.welcome h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.welcome p {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.lang-btn {
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.lang-btn.active {
  border-color: #1f7a4d;
  background: #eaf5ef;
  color: #1f7a4d;
  font-weight: 600;
}

select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  appearance: none;
}

.footer {
  padding: 20px;
  text-align: center;
}

.btn-primary {
  display: block;
  background: #1f7a4d;
  color: white;
  padding: 15px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
}

.subtitle {
  color: #aaa;
  font-size: 12px;
}
</style>
