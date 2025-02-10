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

const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

const chatData = ref({
  userName: '',
  botName: '',
  userAvatar: '',
  botAvatar: '',
  chat: []
})

// 处理发送消息
const handleSendMessage = (message) => {
  chatData.value.chat.push({
    char: "USER",
    content: {
      type: "Text",
      message: message
    }
  })
}

// 处理图片选择
const handleImageSelected = (imagePath) => {
  chatData.value.chat.push({
    char: "USER",
    content: {
      type: "Image",
      message: imagePath
    }
  })
}

// 初始化消息列表
const initMessages = async () => {
  try {
    // 模拟从服务器获取数据
    const response = {
      userName: "用户",
      botName: "AI助手",
      userAvatar: "/static/user-avatar.png",
      botAvatar: "/static/bot-avatar.png",
      chat: [
        {
          char: "USER", 
          content: {
            type: "Text",
            message: "你好"
          }
        },
        {
          char: "BOT", 
          content: {
            type: "Text",
            message: "你好！很高兴为你服务。我可以帮你处理文字、图片和音频消息。"
          }
        },
        {
          char: "USER", 
          content: {
            type: "Image",
            message: "https://img.picui.cn/free/2025/02/04/67a19ace30f9b.jpg"
          }
        },
        {
          char: "BOT", 
          content: {
            type: "Text",
            message: "我看到你发送了一张图片。图片处理功能正常工作中。"
          }
        },
        {
          char: "USER", 
          content: {
            type: "Audio",
            message: "audio_file_url",
            length: 15
          }
        },
        {
          char: "BOT", 
          content: {
            type: "Text",
            message: "收到你的语音消息，时长15秒。"
          }
        }
      ]
    }
    chatData.value = response
  } catch (error) {
    console.error('Failed to load messages:', error)
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
  initMessages()
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
