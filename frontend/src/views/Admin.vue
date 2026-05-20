<template>
  <div class="mobile-shell app-screen admin-theme">
    <div class="status-bar">
      <span>9:41 AM</span>
      <span>●●●●○ 4G 🔋 82%</span>
    </div>
    
    <div class="header-nav">
      <h2>Admin Dashboard</h2>
      <div class="lang-selector">Rabi 2025–26 · Live</div>
    </div>

    <div class="content">
      <div class="kpi-grid">
        <div class="kpi-card highlight">
          <span class="icon">👥</span>
          <h3>6,000</h3>
          <p>Total Farmers Reached</p>
          <small class="positive">↑ 34% vs WhatsApp-only</small>
        </div>
        
        <div class="kpi-card">
          <span class="icon">📈</span>
          <h3>23.1%</h3>
          <p>Avg Open Rate</p>
          <small>Target: 30%</small>
        </div>

        <div class="kpi-card">
          <span class="icon">🖱️</span>
          <h3>5.0%</h3>
          <p>Click-Through Rate</p>
          <small class="positive">↑ 0.4% this week</small>
        </div>

        <div class="kpi-card">
          <span class="icon">🎯</span>
          <h3>1,521</h3>
          <p>Newly Reachable Farmers</p>
          <small>SMS + Offline channel</small>
        </div>
      </div>

      <div class="section-card">
        <div class="card-header">Open Rate by Crop</div>
        <div class="bar-chart">
          <div class="bar-row">
            <span class="label">Maize</span>
            <div class="bar-track"><div class="bar-fill" style="width: 35.2%"></div></div>
            <span class="value">35.2%</span>
          </div>
          <div class="bar-row">
            <span class="label">Mustard</span>
            <div class="bar-track"><div class="bar-fill" style="width: 25.2%"></div></div>
            <span class="value">25.2%</span>
          </div>
          <div class="bar-row">
            <span class="label">Wheat</span>
            <div class="bar-track"><div class="bar-fill" style="width: 23.1%"></div></div>
            <span class="value">23.1%</span>
          </div>
          <div class="bar-row">
            <span class="label">Potato</span>
            <div class="bar-track"><div class="bar-fill" style="width: 20.1%"></div></div>
            <span class="value">20.1%</span>
          </div>
          <div class="bar-row">
            <span class="label">Cumin</span>
            <div class="bar-track"><div class="bar-fill" style="width: 12.7%"></div></div>
            <span class="value">12.7%</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="card-header">Channel Distribution</div>
        <div class="pie-legend">
          <div class="legend-item">
            <div class="color-dot whatsapp"></div>
            <span>WhatsApp</span>
            <strong>4,479</strong>
          </div>
          <div class="legend-item">
            <div class="color-dot sms"></div>
            <span>SMS/Voice</span>
            <strong>1,028</strong>
          </div>
          <div class="legend-item">
            <div class="color-dot offline"></div>
            <span>Offline</span>
            <strong>493</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-screen {
  background: #1e1e2d; /* Admin dark theme */
  color: white;
}

.status-bar {
  color: white;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #2b2b40;
  border-bottom: 1px solid #3f3f5a;
}

.header-nav h2 {
  margin: 0;
  font-size: 16px;
  color: white;
}

.lang-selector {
  font-size: 12px;
  color: #a0a0b2;
  background: #1e1e2d;
  padding: 4px 8px;
  border-radius: 4px;
}

.content {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.kpi-card {
  background: #2b2b40;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.kpi-card.highlight {
  grid-column: span 2;
  background: linear-gradient(135deg, #1f7a4d, #2e9f68);
}

.kpi-card .icon {
  font-size: 20px;
  margin-bottom: 10px;
}

.kpi-card h3 {
  margin: 0 0 5px 0;
  font-size: 24px;
}

.kpi-card p {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #a0a0b2;
}

.kpi-card.highlight p {
  color: #e0f2e9;
}

.kpi-card small {
  font-size: 11px;
  color: #7a7a92;
}

.kpi-card small.positive {
  color: #4cd964;
}
.kpi-card.highlight small.positive {
  color: #fff;
}

.section-card {
  background: #2b2b40;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.card-header {
  font-size: 11px;
  font-weight: 700;
  color: #888;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.bar-row .label {
  width: 60px;
  font-size: 12px;
  color: #a0a0b2;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #1e1e2d;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #4cd964;
  border-radius: 4px;
}

.bar-row .value {
  width: 40px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.legend-item span {
  flex: 1;
  color: #a0a0b2;
}

.legend-item strong {
  font-weight: 600;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.whatsapp { background: #25d366; }
.sms { background: #34b7f1; }
.offline { background: #f2c14e; }
</style>
