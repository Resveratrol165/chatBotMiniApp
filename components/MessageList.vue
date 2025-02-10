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
import { ref, watch,nextTick } from 'vue'
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
</script>

<style scoped>
.message-list-container {
  flex: 1;
  height: calc(100vh - 60px - env(safe-area-inset-bottom));
}

.loading-more {
  text-align: center;
  padding: 10px 0;
  color: #999;
  font-size: 14px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
</style> 