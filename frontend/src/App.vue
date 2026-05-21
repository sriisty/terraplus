<template>
  <div>
    <!-- Navigation for dev purposes -->
    <nav class="dev-nav" v-if="showDevNav">
      <router-link to="/">Onboarding</router-link>
      <router-link to="/home">Farmer Home</router-link>
      <router-link to="/inbox">Inbox</router-link>
      <router-link to="/admin">Admin Analytics</router-link>
      <router-link to="/selfie">Grower Selfie</router-link>
      <router-link to="/dev-tool">API Dev Tool</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showDevNav = computed(() => true)
</script>

<style>
.dev-nav {
  padding: 12px 16px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  font-family: sans-serif;
  font-size: 13px;
  scrollbar-width: none;
}
.dev-nav::-webkit-scrollbar {
  display: none;
}
.dev-nav a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.dev-nav a:hover {
  color: #ffffff;
  background: #1e293b;
}
.dev-nav a.router-link-active {
  color: #059669;
  background: #ecfdf5;
}

@media (max-width: 768px) {
  .dev-nav {
    justify-content: flex-start;
    padding: 10px 12px;
  }
}

/* Base Responsive Page Layout Wrapper */
.web-page-wrapper {
  width: 100%;
  min-height: calc(100vh - 45px);
  background-color: var(--slate-50);
  display: flex;
  flex-direction: column;
  font-family: var(--font-sans);
}

/* Mobile Mock Styles (Legacy fallback) */
.mobile-shell {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  background: #f8f9fa;
  box-shadow: 0 0 30px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
}

@media (max-width: 480px) {
  .mobile-shell {
    max-width: 100%;
    box-shadow: none;
  }
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  background: transparent;
  z-index: 10;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 15px 10px;
  background: white;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #888;
  font-size: 11px;
  text-decoration: none;
  gap: 4px;
}

.nav-item.router-link-active {
  color: #1f7a4d;
}

.nav-item svg {
  width: 24px;
  height: 24px;
}
</style>
