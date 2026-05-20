<template>
  <div class="mobile-shell app-screen">
    <div class="status-bar">
      <span>9:41 AM</span>
      <span>●●●●○ 4G 🔋 82%</span>
    </div>
    
    <div class="header-nav">
      <router-link to="/home" class="back-btn">← Back</router-link>
      <h2>Grower Pride 📸</h2>
      <div style="width: 50px;"></div>
    </div>

    <div class="content">
      <div class="intro">
        <h3>Show your pride!</h3>
        <p>Take a selfie and share your harvest with the community.</p>
      </div>

      <div class="form-group">
        <label>I AM PROUDLY GROWING</label>
        <select v-model="crop" @change="drawCanvas">
          <option>🌾 Wheat</option>
          <option>🌽 Maize</option>
          <option>🌼 Mustard</option>
          <option>🥔 Potato</option>
        </select>
      </div>

      <div class="form-group">
        <label>MY TRUSTED BRAND</label>
        <select v-model="brand" @change="drawCanvas">
          <option>Topik 15 WP</option>
          <option>Amistar Top</option>
          <option>Actara 25 WG</option>
          <option>Score 250 EC</option>
        </select>
      </div>

      <div class="upload-area" v-if="!imageLoaded" @click="$refs.fileInput.click()">
        <span class="icon">📷</span>
        <p>Tap to upload or take a selfie</p>
        <input type="file" ref="fileInput" accept="image/*" style="display: none;" @change="handleFileUpload" />
      </div>

      <div class="preview-area" v-show="imageLoaded">
        <canvas ref="canvasEl" width="1080" height="1080" style="width: 100%; border-radius: 12px;"></canvas>
        
        <div class="actions">
          <button class="btn-outline" @click="resetImage">Retake</button>
          <button class="btn-primary" @click="shareImage">
            <span class="icon">📱</span> Share to WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fileInput = ref(null)
const canvasEl = ref(null)
const imageLoaded = ref(false)
const userImage = ref(null)
const crop = ref('🌾 Wheat')
const brand = ref('Topik 15 WP')

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      userImage.value = img
      imageLoaded.value = true
      drawCanvas()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function resetImage() {
  imageLoaded.value = false
  userImage.value = null
  fileInput.value.value = ''
}

function drawCanvas() {
  if (!userImage.value || !canvasEl.value) return

  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw user image, cover style
  const size = canvas.width
  const scale = Math.max(size / userImage.value.width, size / userImage.value.height)
  const x = (size / 2) - (userImage.value.width / 2) * scale
  const y = (size / 2) - (userImage.value.height / 2) * scale
  
  ctx.drawImage(userImage.value, x, y, userImage.value.width * scale, userImage.value.height * scale)

  // Draw overlay gradient at bottom
  const gradient = ctx.createLinearGradient(0, size * 0.6, 0, size)
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(0,100,50,0.8)') // Syngenta green tint
  ctx.fillStyle = gradient
  ctx.fillRect(0, size * 0.6, size, size * 0.4)

  // Draw Badge Box
  ctx.fillStyle = '#ffffff'
  ctx.roundRect = ctx.roundRect || function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  }
  
  ctx.roundRect(40, size - 260, size - 80, 220, 30)
  ctx.fill()

  // Draw Logo (Mock Text Logo)
  ctx.fillStyle = '#1f7a4d'
  ctx.font = 'bold 50px sans-serif'
  ctx.fillText('Syngenta', 80, size - 170)

  // Draw Text
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 70px sans-serif'
  ctx.fillText(`Proud to grow ${crop.value.replace(/[^a-zA-Z\s]/g, '').trim()}`, 80, size - 80)
  
  // Draw Brand Badge
  ctx.fillStyle = '#f2c14e'
  ctx.roundRect(size - 400, size - 200, 320, 80, 20)
  ctx.fill()
  
  ctx.fillStyle = '#333'
  ctx.font = 'bold 36px sans-serif'
  ctx.fillText(`Uses: ${brand.value}`, size - 370, size - 145)
}

function shareImage() {
  if (!canvasEl.value) return
  const dataUrl = canvasEl.value.toDataURL('image/jpeg', 0.8)
  
  // Trigger download (In a real app, we'd use Web Share API or send to server)
  const link = document.createElement('a')
  link.download = 'my_syngenta_harvest.jpg'
  link.href = dataUrl
  link.click()
  
  alert('Image downloaded! You can now share it directly to WhatsApp.')
}
</script>

<style scoped>
.app-screen {
  background: white;
  display: flex;
  flex-direction: column;
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

.back-btn {
  text-decoration: none;
  color: #666;
  font-weight: 600;
  font-size: 14px;
}

.content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.intro {
  margin-bottom: 25px;
}

.intro h3 {
  margin: 0 0 5px 0;
  font-size: 22px;
}

.intro p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;
}

.upload-area {
  margin-top: 30px;
  border: 2px dashed #1f7a4d;
  background: #eaf5ef;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-area .icon {
  font-size: 48px;
}

.upload-area p {
  color: #1f7a4d;
  font-weight: 600;
  margin: 0;
}

.preview-area {
  margin-top: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-outline {
  padding: 15px;
  border: 1px solid #1f7a4d;
  color: #1f7a4d;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  flex: 1;
}

.btn-primary {
  padding: 15px;
  background: #25d366; /* WhatsApp Green */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
