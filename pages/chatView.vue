<template>
  <view class="chat-container">
    <message-list
      :chat-data="chatData"
      :loading="loading"
      @load-more="loadMoreMessages"
    />
    <input-field
      @send="handleSendMessage"
      @image-selected="handleImageSelected"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MessageList from '@/components/MessageList.vue'
import InputField from '@/components/InputField.vue'
import { getBot, getBotChatHistory } from '../model/bot_model'
import api from '@/utils/api.js'

const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const bot = ref(null)

const chatData = ref({
  userName: '用户',
  userAvatar: '/static/user-avatar.png',
  botName: '',
  botAvatar: '',
  chat: []
})

// 处理发送消息
const handleSendMessage = async (message) => {
  try {
    await api.chat.sendTextMessage(chatData.value.chat, message, bot.value.id, bot.value.config)
  } catch (error) {
    console.error('发送消息失败:', error)
    uni.showToast({
      title: '发送消息失败',
      icon: 'none'
    })
  }
}

// 处理图片选择
const handleImageSelected = async (imagePath, id) => {
  try {
    await api.chat.sendImageMessage(chatData.value.chat, imagePath, id, bot.value.id, bot.value.config)
  } catch (error) {
    console.error('发送图片消息失败:', error)
    uni.showToast({
      title: '发送图片消息失败',
      icon: 'none'
    })
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 初始化聊天数据
const initChat = async (botId) => {
  try {
    bot.value = await getBot(botId)
    
    // 设置机器人信息
    chatData.value.botName = bot.value.config.name
    chatData.value.botAvatar = bot.value.config.avatar
    
    // 获取聊天历史记录
    chatData.value.chat = await getBotChatHistory(botId)
  } catch (error) {
    console.error('初始化聊天失败:', error)
    uni.showToast({
      title: '初始化聊天失败',
      icon: 'none'
    })
  }
}

// 加载更多历史消息
const loadMoreMessages = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const moreMessages = []
    chatData.value.chat.unshift(...moreMessages)
    page.value++
  } catch (error) {
    console.error('Failed to load more messages:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 获得页面参数id
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const botId = currentPage.options.botId
  
  if (botId) {
    initChat(botId)
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
  }
})
</script>

<style>
@import '../static/styles/md3.css';

.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-surface);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  height: 88rpx;
  background-color: var(--md-sys-color-surface);
  border-bottom: 2rpx solid var(--md-sys-color-outline-variant);
  position: sticky;
  top: 0;
  z-index: 100;
  padding-top: env(safe-area-inset-top);
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.nav-right {
  display: flex;
  align-items: center;
}
</style>
