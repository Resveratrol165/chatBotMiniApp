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
import { request, post } from '@/utils/http_utils.js'
import { getFomalData, formalMessage } from '@/utils/formalData.js'

const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const bot = ref(null)

// 多模态大模型请求相关参数
const url = 'http://10.64.68.86:37861/chat/chat/completions';
const header = {
		"Content-Type": "application/json",
		"Accept": "*/*",
		"Connection": "keep-alive",
}

const chatData = ref({
  userName: '用户',
  userAvatar: '/static/user-avatar.png',
  botName: '',
  botAvatar: '',
  chat: []
})


// 处理发送消息
const handleSendMessage = async (message) => {
  const newMessage = formalMessage('USER','Text',message)

  try {
    // 更新UI
    chatData.value.chat.push(newMessage)
	// 请求回应
	const data = getFomalData(chatData.value.chat)
	const result = await post(url, data, header)
	const response = result["choices"][0]["message"]["content"]
	const robotMes = formalMessage('SYSTEM','Text',response)
	
	// 更新UI
	chatData.value.chat.push(robotMes)
    // 保存到存储
    await updateBotChatHistory(bot.value.id, newMessage)
  } catch (error) {
    console.error('返回消息失败:', error)
  }
}

// 处理图片选择
const handleImageSelected = async (imagePath, id) => {
  try {
    // 封装imageUrl
    const newID = `http://10.64.68.86:37861/v1/files/${id}==/content`;
	const newMessage = formalMessage('USER','Image',imagePath,newID);
	// 更新UI
	chatData.value.chat.push(newMessage);
	// 请求
	const data = getFomalData(chatData.value.chat);
	const result = await post(url, data, header)
	const response = result["choices"][0]["message"]["content"]
	const robotMes = formalMessage('SYSTEM','Text',response)
	// 更新UI
	chatData.value.chat.push(robotMes)
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

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
</style>
