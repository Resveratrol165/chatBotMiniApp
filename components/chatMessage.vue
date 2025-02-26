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

<style>
@import '../static/styles/md3.css';
</style>
