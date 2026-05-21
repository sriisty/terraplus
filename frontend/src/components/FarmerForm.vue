<template>
  <form class="panel form" novalidate @submit.prevent="onSubmit">
    <div class="panel-head">
      <Sprout :size="20" aria-hidden="true" />
      <h2>Farmer context</h2>
      <button
        type="button"
        class="link-btn"
        :disabled="loading"
        @click="$emit('reset')"
      >
        Reset
      </button>
    </div>

    <div class="grid two">
      <label>
        <span>Farmer name</span>
        <input v-model="state.farmer_name" autocomplete="off" />
      </label>
      <label>
        <span>Grower ID</span>
        <input v-model="state.farmer.grower_id" autocomplete="off" />
      </label>

      <label :class="{ invalid: errors.state }">
        <span>State <em aria-hidden="true">*</em></span>
        <input
          v-model="state.farmer.state"
          required
          :aria-invalid="!!errors.state"
          @input="clearError('state')"
        />
        <small v-if="errors.state" class="field-error">{{ errors.state }}</small>
      </label>
      <label :class="{ invalid: errors.district }">
        <span>District <em aria-hidden="true">*</em></span>
        <input
          v-model="state.farmer.district"
          required
          :aria-invalid="!!errors.district"
          @input="clearError('district')"
        />
        <small v-if="errors.district" class="field-error">{{ errors.district }}</small>
      </label>

      <label>
        <span>Tehsil / block</span>
        <input v-model="state.farmer.tehsil_block" />
      </label>
      <label>
        <span>Season</span>
        <input v-model="state.farmer.season" placeholder="Kharif / Rabi / Zaid" />
      </label>

      <label>
        <span>Language</span>
        <select v-model="state.farmer.language">
          <option value="">Infer from region</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Marathi</option>
          <option>Punjabi</option>
          <option>Gujarati</option>
          <option>Kannada</option>
          <option>English</option>
        </select>
      </label>
      <label :class="{ invalid: errors.main_crop }">
        <span>Crop <em aria-hidden="true">*</em></span>
        <input
          v-model="state.farmer.main_crop"
          required
          :aria-invalid="!!errors.main_crop"
          @input="clearError('main_crop')"
        />
        <small v-if="errors.main_crop" class="field-error">{{ errors.main_crop }}</small>
      </label>

      <label>
        <span>Product</span>
        <input v-model="state.farmer.campaign_product" placeholder="e.g. Tilt 250 EC" />
      </label>
      <label :class="{ invalid: errors.pest_threat }">
        <span>Pest / disease <em aria-hidden="true">*</em></span>
        <input
          v-model="state.farmer.pest_threat"
          required
          :aria-invalid="!!errors.pest_threat"
          @input="clearError('pest_threat')"
        />
        <small v-if="errors.pest_threat" class="field-error">{{ errors.pest_threat }}</small>
      </label>

      <label>
        <span>Weather risk</span>
        <input v-model="state.farmer.weather_risk" placeholder="rain, dry spell, humidity" />
      </label>
      <label>
        <span>Farm size (acres)</span>
        <input
          v-model.number="state.farmer.grower_farm_size"
          type="number"
          min="0"
          step="0.1"
        />
      </label>

      <label>
        <span>Device</span>
        <select v-model="state.farmer.device_type">
          <option value="smartphone">Smartphone</option>
          <option value="keypad_phone">Keypad phone</option>
          <option value="feature_phone">Feature phone</option>
        </select>
      </label>
      <label>
        <span>Connectivity</span>
        <select v-model="state.farmer.connectivity">
          <option value="good">Good</option>
          <option value="weak">Weak</option>
          <option value="offline">Offline</option>
        </select>
      </label>

      <label>
        <span>Literacy</span>
        <select v-model="state.farmer.literacy_level">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label class="check">
        <input
          v-model="state.farmer.high_value_farmer"
          type="checkbox"
        />
        <span>High-value farmer · add voice follow-up</span>
      </label>
    </div>

    <button class="primary" :disabled="loading">
      <Send :size="18" aria-hidden="true" />
      <span>{{ loading ? 'Generating campaign…' : 'Generate campaign' }}</span>
    </button>
  </form>
</template>

<script setup>
import { Sprout, Send } from 'lucide-vue-next'

defineProps({
  state: { type: Object, required: true },
  errors: { type: Object, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'reset', 'clear-error'])

function clearError(key) {
  emit('clear-error', key)
}
function onSubmit() {
  emit('submit')
}
</script>
