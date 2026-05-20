<template>
  <div class="mobile-shell app-screen">
    <div class="status-bar">
      <span>9:41 AM</span>
      <span>●●●●○ 4G 🔋 82%</span>
    </div>
    
    <div class="header-nav">
      <h2>🌱 AgriPulse AI</h2>
      <div class="lang-selector">हिंदी ▾</div>
    </div>

    <div class="content">
      <div class="alert-box warning">
        <div class="alert-title">
          <span class="icon">⚠</span> Pest Alert — Your Region
        </div>
        <p>High humidity detected in Agra district. Fungal infection risk elevated for wheat in flowering stage. Immediate action advised.</p>
      </div>

      <div class="section-card">
        <div class="card-header">CROP GROWTH STAGE</div>
        <h3>Wheat — Rabi 2025-26</h3>
        <p class="subtitle">Sown Nov 12, 2025 <span class="badge">⏱ 18 days left</span></p>
        <p class="subtitle">Harvest window: Mar 20 – Apr 15</p>
        
        <div class="progress-bar">
          <div class="stage">
            <div class="circle done">✓</div>
            <span>Sowing</span>
          </div>
          <div class="stage">
            <div class="circle done">✓</div>
            <span>Tillering</span>
          </div>
          <div class="stage">
            <div class="circle active">🌸</div>
            <span>Flowering</span>
          </div>
          <div class="stage">
            <div class="circle">🌾</div>
            <span>Harvest</span>
          </div>
        </div>
      </div>

      <div class="section-card recommendation">
        <div class="card-header">RECOMMENDED FOR YOU</div>
        <div class="product-header">
          <div class="icon-box">🧪</div>
          <div>
            <h3>Topik 15 WP</h3>
            <span class="badge blue">Fungicide</span>
          </div>
        </div>
        <p>Recommended for wheat in flowering stage. Protects against powdery mildew and rust. Apply early morning for best results in your current weather conditions.</p>
        <div class="actions">
          <button class="btn-outline">Learn More</button>
          <button class="btn-primary-small">Find Near Me</button>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="card-header">Ask AI 🤖</div>
        <p class="subtitle">Ask anything about your crop, pests, or products</p>
        <div class="chat-input">
          <input type="text" placeholder="My wheat leaves are turning yellow..." />
          <button class="send-btn">➤</button>
        </div>
        <div class="quick-chips">
          <span class="chip">💧 Irrigation tips</span>
          <span class="chip">🐛 Pest ID help</span>
          <span class="chip">💊 Dosage guide</span>
        </div>
      </div>

      <div class="section-card selfie-promo">
        <div class="card-header">COMMUNITY</div>
        <h3>Show your Farmer Pride! 📸</h3>
        <p>Take a selfie with your crop and share it with friends.</p>
        <router-link to="/selfie" class="btn-primary-small" style="display: block; text-align: center; text-decoration: none; margin-top: 10px;">
          Try the Grower Selfie Tool
        </router-link>
      </div>
    </div>

    <div class="bottom-nav">
      <router-link to="/home" class="nav-item router-link-active">
        <span class="icon">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/home" class="nav-item">
        <span class="icon">🌾</span>
        <span>My Crop</span>
      </router-link>
      <router-link to="/inbox" class="nav-item">
        <span class="icon">💬</span>
        <span>Messages</span>
      </router-link>
      <router-link to="/home" class="nav-item">
        <span class="icon">🤖</span>
        <span>Ask AI</span>
      </router-link>
      <router-link to="/home" class="nav-item">
        <span class="icon">👤</span>
        <span>Profile</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.app-screen {
  background: #f4f6f8;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #eee;
}

.header-nav h2 {
  margin: 0;
  font-size: 18px;
  color: #1f7a4d;
}

.lang-selector {
  font-size: 14px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.content {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
}

.alert-box {
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  font-size: 14px;
}

.alert-box.warning {
  background: #fff4e5;
  border: 1px solid #ffd8a8;
  color: #b35900;
}

.alert-title {
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.card-header {
  font-size: 11px;
  font-weight: 700;
  color: #888;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.section-card h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.subtitle {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 13px;
}

.badge {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  color: #555;
}

.badge.blue {
  background: #e5f0ff;
  color: #0055cc;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #eee;
  z-index: 0;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  gap: 5px;
}

.circle {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.circle.done {
  background: #1f7a4d;
  color: white;
}

.circle.active {
  background: #ffe3e3;
  border: 2px solid #ff6b6b;
}

.stage span {
  font-size: 11px;
  color: #666;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.icon-box {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.recommendation p {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-outline {
  flex: 1;
  padding: 10px;
  border: 1px solid #1f7a4d;
  color: #1f7a4d;
  background: white;
  border-radius: 8px;
  font-weight: 600;
}

.btn-primary-small {
  flex: 1;
  padding: 10px;
  background: #1f7a4d;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

.chat-input-area {
  padding: 15px;
  background: white;
  border-radius: 12px;
}

.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.send-btn {
  background: #1f7a4d;
  color: white;
  border: none;
  width: 44px;
  border-radius: 8px;
  font-size: 18px;
}

.quick-chips {
  display: flex;
  gap: 8px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.chip {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
  color: #555;
}
</style>
