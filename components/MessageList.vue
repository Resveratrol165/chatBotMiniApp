<template>
  <scroll-view 
    class="message-list-container"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltoupper="handleScrollToUpper"
  >
    <view v-if="loading" class="loading-more">
      加载中...
    </view>
    
    <view class="messages-list">
      <chat-message
        v-for="(message, index) in chatData.chat"
        :key="index"
        :message="message"
        :user-avatar="chatData.userAvatar"
        :bot-avatar="chatData.botAvatar"
        :user-name="chatData.userName"
        :bot-name="chatData.botName"
      />
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import ChatMessage from './ChatMessage.vue'

const props = defineProps({
  chatData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load-more'])

const scrollTop = ref(0)
const inputHeight = ref(120) // 默认输入框高度

// 监听消息列表变化，自动滚动到底部
watch(
  () => props.chatData.chat.length,
  () => {
    console.log('消息列表长度变化，准备滚动到底部')
    nextTick(() => {
      console.log('执行滚动')
      // 先设置一个很小的值，强制触发滚动更新
      scrollTop.value = 0
      nextTick(() => {
        scrollTop.value = 99999
      })
    })
  }
)

// 处理上拉加载更多
const handleScrollToUpper = () => {
  emit('load-more')
}

// 监听输入框高度变化
const handleInputHeightChange = (height) => {
  inputHeight.value = height + 48 // 加上padding
  // 滚动到底部
  nextTick(() => {
    scrollTop.value = 99999
  })
}

onMounted(() => {
  uni.$on('input-height-changed', handleInputHeightChange)
})

onUnmounted(() => {
  uni.$off('input-height-changed', handleInputHeightChange)
})
</script>

<style>
@import '../static/styles/md3.css';

.message-list-container {
  flex: 1;
  height: calc(100vh - 120rpx - env(safe-area-inset-bottom));
  background-color: var(--md-sys-color-surface);
  padding-bottom: 120rpx; /* 为输入框留出空间 */
}

.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 28rpx;
  font-weight: 500;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 40rpx;
  padding-bottom: 120rpx; /* 确保底部有足够空间，不被输入框遮挡 */
}
</style> 