<template>
  <div class="contact-item" @click="$emit('select', bot)">
    <div class="avatar">
      <img :src="bot.config.avatar" :alt="bot.config.name">
    </div>
    <div class="info">
      <div class="name">{{ bot.config.name }}</div>
      <div class="description">{{ bot.config.description }}</div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  bot: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.contact-item {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin: 0 8px;
  border-radius: 12px;
}

.contact-item:hover {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.05));
}

.contact-item:active {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.08));
}

.avatar {
  width: 48px;
  height: 48px;
  margin-right: 16px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface, #1f1f1f);
  margin-bottom: 4px;
  letter-spacing: 0.15px;
}

.description {
  font-size: 14px;
  color: var(--md-sys-color-on-surface-variant, #49454f);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.25px;
}
</style> 