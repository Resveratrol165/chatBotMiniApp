<template>
  <div class="input-container">
    <div class="input-wrapper">
      <textarea
        ref="textareaRef"
        class="input-field"
        v-model="inputText"
        placeholder="请输入消息..."
        @input="adjustHeight"
        :maxlength="500"
        auto-height
        confirm-type="send"
        @confirm="sendMessage"
      />
      <div class="action-buttons">
        <button class="image-btn" @tap="chooseImage">
          <van-icon name="photo-o" size="48rpx" />
        </button>
        <button 
          class="send-btn" 
          :class="{ 'send-btn-active': inputText.trim().length > 0 }"
          @tap="sendMessage"
        >
          <van-icon name="guide-o" size="48rpx" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const emit = defineEmits(['send', 'image-selected'])

const inputText = ref('')
const textareaRef = ref(null)
const imageServeUrl = 'http://10.64.68.86:37861/v1/files'

// 调整文本框高度
const adjustHeight = async () => {
  await nextTick()
  const textarea = textareaRef.value
  if (!textarea) return
  
  // 获取当前高度
  const currentHeight = textarea.clientHeight
  
  // 使用uni-app的auto-height属性自动调整高度
  // 我们只需要确保在文本超出最大高度时，滚动条能够正常工作
  if (textarea.scrollHeight > textarea.clientHeight) {
    textarea.scrollTop = textarea.scrollHeight
  }
  
  // 如果高度发生变化，通知消息列表
  if (currentHeight !== textarea.clientHeight) {
    uni.$emit('input-height-changed', textarea.clientHeight)
  }
}

// 发送消息
const sendMessage = () => {
  if (inputText.value.trim()) {
    emit('send', inputText.value)
    inputText.value = ''
    
    // 重置输入框高度
    nextTick(() => {
      if (textareaRef.value) {
        adjustHeight()
      }
    })
  }
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      console.log(res)
      uni.uploadFile({
        url: imageServeUrl, // 图片服务器
        filePath: res.tempFilePaths[0],
        name: 'file',
        success: (uploadFileRes) => {
          const data = JSON.parse(uploadFileRes.data);
          console.log(data);
          emit('image-selected', res.tempFilePaths[0], data.id)
        }
      });
    }
  })
}
</script>

<style>
@import '../static/styles/md3.css';

.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--md-sys-color-surface-container);
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-top: 2rpx solid var(--md-sys-color-outline-variant);
  z-index: 100;
  box-sizing: border-box;
}

.input-wrapper {
  display: flex;
  background-color: var(--md-sys-color-surface);
  border-radius: 32rpx;
  padding: 16rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  align-items: flex-start;
}

.input-field {
  flex: 1;
  border: none;
  font-size: 32rpx;
  line-height: 44rpx;
  padding: 12rpx 16rpx;
  background: transparent;
  box-sizing: border-box;
  min-height: 64rpx;
  max-height: 240rpx;
  display: block;
  resize: none;
  overflow-y: auto;
  color: var(--md-sys-color-on-surface);
  word-break: break-all;
  white-space: pre-wrap;
  width: 100%;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16rpx;
  padding: 8rpx;
  margin-left: 8rpx;
  height: 100%;
}

.image-btn, .send-btn {
  background: transparent;
  border: none;
  padding: 12rpx;
  margin: 0;
  line-height: 1;
  height: auto;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-btn:active, .send-btn:active {
  background-color: var(--md-sys-color-surface-variant);
  transform: scale(0.95);
}

.send-btn {
  opacity: 0.5;
}

.send-btn-active {
  opacity: 1;
}

/* 修改图标颜色，使用Material Design变量 */
.image-btn .van-icon {
  color: var(--md-sys-color-on-surface-variant) !important;
}

.send-btn .van-icon {
  color: var(--md-sys-color-on-surface-variant) !important;
}

.send-btn-active .van-icon {
  color: var(--md-sys-color-primary) !important;
}
</style>
