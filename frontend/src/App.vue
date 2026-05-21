<template>
  <div>
    <!-- Navigation for dev purposes -->
    <nav class="dev-nav" v-if="showDevNav">
      <router-link to="/">Onboarding</router-link> |
      <router-link to="/home">Farmer Home</router-link> |
      <router-link to="/inbox">Inbox</router-link> |
      <router-link to="/admin">Admin Analytics</router-link> |
      <router-link to="/dev-tool">API Dev Tool</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showDevNav = computed(() => route.path !== '/dev-tool')
</script>

<style>
.dev-nav {
  padding: 10px;
  background: #333;
  color: white;
  text-align: center;
  font-family: sans-serif;
  font-size: 14px;
}
.dev-nav a {
  color: #aaddff;
  text-decoration: none;
  margin: 0 5px;
}
.dev-nav a:hover {
  text-decoration: underline;
}

/* Mobile Mock Styles */
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
