<template>
  <div class="contact-view">
    <div class="header">
      <div class="title">联系人</div>
      <div class="add-btn" @click="handleAddBot">
        <text class="add-icon">+</text>
      </div>
    </div>
    <div class="contact-list">
      <contact-component
        v-for="bot in botList"
        :key="bot.id"
        :bot="bot"
        @select="handleBotSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBotList } from '../model/bot_model'
import ContactComponent from '../components/contactComponent.vue'

const botList = ref([
  {
    id: 'test_bot_1',
    name: 'Claude AI',
    avatar: '/static/images/claude.png',
    description: '由 Anthropic 开发的 AI 助手'
  },
  {
    id: 'test_bot_2',
    name: 'GPT Assistant',
    avatar: '/static/images/gpt.png',
    description: '智能对话助手，擅长编程和写作'
  },
  {
    id: 'test_bot_3',
    name: '文心一言',
    avatar: '/static/images/wenxin.png',
    description: '百度研发的知识增强大模型'
  }
])

const handleBotSelect = (bot) => {
  // 处理机器人选择事件，可以跳转到聊天页面或其他操作
  console.log('选择了机器人:', bot)
}

const handleAddBot = () => {
  console.log('添加新机器人')
  // 这里可以添加创建新机器人的逻辑
}

// 暂时注释掉实际的数据获取
// onMounted(async () => {
//   try {
//     botList.value = await getBotList()
//   } catch (error) {
//     console.error('获取机器人列表失败:', error)
//   }
// })
</script>

<style scoped>
.contact-view {
  height: 100%;
  background-color: var(--md-sys-color-surface, #fff);
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: var(--md-sys-color-surface-container, #f8f9fa);
  position: relative;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--md-sys-color-outline-variant, rgba(0,0,0,0.08));
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface, #1f1f1f);
  letter-spacing: 0.15px;
}

.add-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.2s ease;
  color: var(--md-sys-color-on-surface-variant, #49454f);
}

.add-btn:hover {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.08));
}

.add-btn:active {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.12));
}

.add-icon {
  font-size: 28px;
  font-weight: 300;
  line-height: 28px;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  background-color: var(--md-sys-color-surface, #fff);
}

/* 添加滚动条样式 */
.contact-list::-webkit-scrollbar {
  width: 8px;
}

.contact-list::-webkit-scrollbar-track {
  background: transparent;
}

.contact-list::-webkit-scrollbar-thumb {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.2));
  border-radius: 4px;
}

.contact-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--md-sys-color-surface-variant, rgba(0,0,0,0.3));
}
</style>
