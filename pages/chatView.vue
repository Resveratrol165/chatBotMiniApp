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
import { getBot, getBotChatHistory, updateBotChatHistory } from '../model/bot_model'

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
  const newMessage = {
    char: "USER",
    content: {
      type: "Text",
      message: message
    }
  }
  
  try {
    // 更新UI
    chatData.value.chat.push(newMessage)
    
    // 保存到存储
    await updateBotChatHistory(bot.value.id, newMessage)
  } catch (error) {
    console.error('保存消息失败:', error)
  }
}

// 处理图片选择
const handleImageSelected = async (imagePath) => {
  const newMessage = {
    char: "USER",
    content: {
      type: "Image",
      message: imagePath
    }
  }
  
  try {
    // 更新UI
    chatData.value.chat.push(newMessage)
    
    // 保存到存储
    await updateBotChatHistory(bot.value.id, newMessage)
  } catch (error) {
    console.error('保存图片消息失败:', error)
  }
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

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
</style>
