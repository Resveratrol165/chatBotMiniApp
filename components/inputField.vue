<template>
  <div class="input-container">
    <div class="input-wrapper">
      <textarea
        ref="textareaRef"
        class="input-field"
        v-model="inputText"
        :style="{ height: textareaHeight + 'px' }"
        placeholder="请输入消息..."
        @input="adjustHeight"
        :maxlength="500"
      />
      <div class="action-buttons">
        <button class="image-btn" @tap="chooseImage">
          <van-icon name="photo-o" size="24px" color="#666666" />
        </button>
        <button 
          class="send-btn" 
          :class="{ 'send-btn-active': inputText.trim().length > 0 }"
          @tap="sendMessage"
        >
          <van-icon 
            name="guide-o" 
            size="24px" 
            :color="inputText.trim().length > 0 ? '#007AFF' : '#999999'" 
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const emit = defineEmits(['send', 'image-selected'])

const inputText = ref('')
const textareaHeight = ref(32)
const MIN_HEIGHT = 32
const MAX_HEIGHT = 120 // 增加最大高度
const textareaRef = ref(null) // 添加 textarea 的 ref

// 调整文本框高度
const adjustHeight = async () => {
  await nextTick()
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = MIN_HEIGHT + 'px'
  const scrollHeight = textarea.scrollHeight
  textareaHeight.value = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
}

// 发送消息
const sendMessage = () => {
  if (inputText.value.trim()) {
    emit('send', inputText.value)
    inputText.value = ''
    textareaHeight.value = MIN_HEIGHT
  }
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      emit('image-selected', res.tempFilePaths[0])
    }
  })
}
</script>

<style scoped>
.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  padding: 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid #e5e5e5;
  z-index: 100;
  height: calc(52px + env(safe-area-inset-bottom)); /* 固定高度 */
  box-sizing: border-box;
}

.input-wrapper {
  display: flex;
  align-items: flex-end; /* 改回flex-end */
  background-color: #fff;
  border-radius: 8px;
  padding: 4px 8px;
}

.input-field {
  flex: 1;
  border: none;
  font-size: 16px;
  line-height: 22px;
  padding: 4px 8px;
  background: transparent;
  box-sizing: border-box;
  min-height: 32px;
  max-height: 120px; /* 恢复最大高度限制，但给予更多空间 */
  display: block;
  resize: none;
  overflow-y: auto; /* 改为auto，允许内容超出时滚动 */
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.image-btn, .send-btn {
  background: transparent;
  border: none;
  padding: 6px;
  margin: 0;
  line-height: 1;
  height: auto;
}

.image-btn:active, .send-btn:active {
  opacity: 0.7;
}

.send-btn {
  opacity: 0.5;
}

.send-btn-active {
  opacity: 1;
}
</style>
