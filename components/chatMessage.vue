<template>
  <div class="message-item" :class="{ 'message-right': isUser }">
    <div class="avatar">
      <image :src="avatarSrc" mode="aspectFill" />
    </div>
    <div class="message-content">
      <div class="name">{{ displayName }}</div>
      <div class="bubble" :class="{ 'bubble-right': isUser }">
        <!-- 文本消息 -->
        <template v-if="message.content.type === 'Text'">
          {{ message.content.message }}
        </template>
        
        <!-- 图片消息 -->
        <template v-else-if="message.content.type === 'Image'">
          <image 
            :src="message.content.message" 
            mode="widthFix" 
            class="message-image"
            @tap="previewImage"
          />
        </template>
        
        <!-- 音频消息 -->
        <template v-else-if="message.content.type === 'Audio'">
          <div class="audio-message">
            <uni-icons type="sound" size="20"></uni-icons>
            <text class="audio-duration">{{message.content.length}}秒</text>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  userAvatar: {
    type: String,
    required: true
  },
  botAvatar: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  botName: {
    type: String,
    required: true
  }
})

const isUser = computed(() => props.message.char === 'USER')
const avatarSrc = computed(() => isUser.value ? props.userAvatar : props.botAvatar)
const displayName = computed(() => isUser.value ? props.userName : props.botName)

// 图片预览功能
const previewImage = () => {
  if (props.message.content.type === 'Image') {
    uni.previewImage({
      urls: [props.message.content.message]
    })
  }
}
</script>

<style scoped>
.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.message-right {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar image {
  width: 100%;
  height: 100%;
}

.message-content {
  max-width: 70%;
}

.name {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.message-right .name {
  text-align: right;
}

.message-image {
  max-width: 200px;
  border-radius: 8px;
}

.audio-message {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.audio-duration {
  font-size: 14px;
}

.bubble {
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 16px;
  border-top-left-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bubble-right {
  background-color: #007AFF;
  color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 4px;
}

.bubble .message-image {
  margin: -12px -16px;
  border-radius: inherit;
}
</style>
