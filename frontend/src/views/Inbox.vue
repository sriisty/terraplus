<template>
  <div class="mobile-shell app-screen">
    <div class="status-bar">
      <span>9:41 AM</span>
      <span>●●●●○ 4G 🔋 82%</span>
    </div>
    
    <div class="header-nav">
      <h2>🌱 My Messages</h2>
      <div class="lang-selector">हिंदी ▾</div>
    </div>

    <div class="content">
      <div class="inbox-header">
        <h3>Inbox</h3>
        <span class="badge">3 unread</span>
      </div>

      <div class="message unread">
        <div class="msg-icon">🌾</div>
        <div class="msg-content">
          <p><strong>Wheat Alert:</strong> Apply Topik 15 WP this week — flowering stage detected. High fungal risk in your district.</p>
          <div class="msg-meta">
            <span>📱 WhatsApp</span>
            <span>Today, 8:00 AM</span>
            <span class="action">Tap to read</span>
          </div>
        </div>
      </div>

      <div class="message unread">
        <div class="msg-icon">󰳎</div>
        <div class="msg-content">
          <p><strong>Field Rep Visit:</strong> Our rep Suresh will visit Agra tehsil on May 21. Book a slot for a free crop consultation.</p>
          <div class="msg-meta">
            <span>📱 WhatsApp</span>
            <span>Yesterday</span>
            <span class="action">Tap to read</span>
          </div>
        </div>
      </div>

      <div class="message unread">
        <div class="msg-icon">📊</div>
        <div class="msg-content">
          <p><strong>Weekly Tip:</strong> Irrigate wheat before anthesis for 15–20% better yield. Weather forecast: dry for 5 days.</p>
          <div class="msg-meta">
            <span>📱 WhatsApp</span>
            <span>2 days ago</span>
            <span class="action">Tap to read</span>
          </div>
        </div>
      </div>

      <div class="message read">
        <div class="msg-icon">✅</div>
        <div class="msg-content">
          <p><strong>Season Start:</strong> Rabi 2025-26 campaign has begun. Check your personalized crop plan inside.</p>
          <div class="msg-meta">
            <span>📱 WhatsApp</span>
            <span>Oct 10, 2025</span>
            <span>Read</span>
          </div>
        </div>
        
        <div class="feedback">
          <p>Was this message useful?</p>
          <div class="feedback-actions">
            <button class="btn-vote">👍 Yes, helpful</button>
            <button class="btn-vote">👎 Not relevant</button>
          </div>
          <small>Your feedback trains our AI to send better messages</small>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <span class="icon">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/home" class="nav-item">
        <span class="icon">🌾</span>
        <span>My Crop</span>
      </router-link>
      <router-link to="/inbox" class="nav-item router-link-active">
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

.inbox-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.inbox-header h3 {
  margin: 0;
  color: #333;
}

.badge {
  background: #ff4757;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.message {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  flex-wrap: wrap;
}

.message.unread {
  border-left: 4px solid #1f7a4d;
}

.message.read {
  opacity: 0.8;
  border-left: 4px solid transparent;
}

.msg-icon {
  font-size: 24px;
  background: #f0f0f0;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-content {
  flex: 1;
}

.msg-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.msg-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #888;
}

.msg-meta .action {
  color: #1f7a4d;
  font-weight: 600;
  margin-left: auto;
}

.feedback {
  width: 100%;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.feedback p {
  font-size: 13px;
  margin: 0 0 10px 0;
  color: #555;
  font-weight: 600;
}

.feedback-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-vote {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

.feedback small {
  display: block;
  text-align: center;
  color: #aaa;
  font-size: 10px;
}
</style>
