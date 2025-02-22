<template>
  <view class="md3-page">
    <!-- 顶部栏 -->
    <view class="md3-top-bar">
      <view class="md3-icon-button" @click="handleEdit">
          <van-icon name="edit" />
        </view>
      <view class="actions">
        <view class="md3-icon-button md3-icon-button--error" @click="handleDelete">
          <van-icon name="delete" />
        </view>
      </view>
    </view>

    <!-- 机器人信息卡片 -->
    <view class="md3-card">
      <view class="avatar-section">
        <van-image
          round
          width="160rpx"
          height="160rpx"
          :src="bot?.config?.avatar || '/static/default_avatar.png'"
        />
        <text class="bot-name">{{ bot?.config?.name }}</text>
        <text class="bot-description">{{ bot?.config?.description }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="md3-button md3-button--primary" @click="navigateToChat">
        <van-icon name="chat" />
        <text>开始对话</text>
      </view>
      
      <view class="md3-button md3-button--secondary" @click="navigateToAudio">
        <van-icon name="volume" />
        <text>语音对话</text>
      </view>

      <view class="md3-button md3-button--error" @click="handleClearHistory">
        <van-icon name="delete" />
        <text>清除聊天记录</text>
      </view>
    </view>

    <!-- 机器人详细信息 -->
    <view class="bot-details">
      <view class="md3-text-area">
        <text class="md3-text-area__title">欢迎语</text>
        <text class="md3-text-area__content">{{ bot?.config?.greeting }}</text>
      </view>
      
      <view class="md3-text-area">
        <text class="md3-text-area__title">人物设定</text>
        <text class="md3-text-area__content">{{ bot?.config?.persona }}</text>
      </view>
      
      <view class="md3-text-area" v-if="bot?.config?.background">
        <text class="md3-text-area__title">背景设定</text>
        <text class="md3-text-area__content">{{ bot?.config?.background }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBot, removeBotChatHistory } from '../model/bot_model'

const bot = ref(null)

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const botId = currentPage.options.id
  
  if (!botId) {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
    return
  }

  try {
    bot.value = await getBot(botId)
  } catch (error) {
    console.error('获取机器人信息失败:', error)
    uni.showToast({
      title: '获取信息失败',
      icon: 'none'
    })
  }
})

const handleEdit = () => {
  // 通过 URL 参数传递编辑模式和机器人 ID
  uni.navigateTo({
    url: `/pages/addBotView?mode=edit&id=${bot.value.id}`
  })
}

const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个机器人吗？此操作不可撤销。',
    success: async function (res) {
      if (res.confirm) {
        try {
          await bot.value.delete()
          uni.navigateBack()
        } catch (error) {
          console.error('删除机器人失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const navigateToChat = () => {
  uni.navigateTo({
    url: `/pages/chatView?botId=${bot.value.id}`
  })
}

const navigateToAudio = () => {
  uni.navigateTo({
    url: `/pages/audioView?botId=${bot.value.id}`
  })
}

// 处理清除历史记录
const handleClearHistory = () => {
  uni.showModal({
    title: '确认清除',
    content: '确定要清除所有聊天记录吗？此操作不可撤销。',
    success: async function (res) {
      if (res.confirm) {
        try {
          await removeBotChatHistory(bot.value.id)
          uni.showToast({
            title: '清除成功',
            icon: 'success'
          })
        } catch (error) {
          console.error('清除聊天记录失败:', error)
          uni.showToast({
            title: '清除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style>
@import '../static/styles/md3.css';

/* 按钮容器样式 */
.action-buttons {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.avatar-section .bot-name {
  font-size: 40rpx;
  font-weight: 500;
}

.avatar-section .bot-description {
  font-size: 28rpx;
  color: var(--md-sys-color-on-surface-variant);
  text-align: center;
}

.van-icon {
  font-size: 40rpx !important;
}

/* 添加错误按钮样式 */
.md3-button--error {
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
}
</style> 