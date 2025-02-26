<template>
  <view class="md3-page audio-view">
    <!-- 机器人信息区域 -->
    <view class="bot-info" v-if="bot">
      <view class="bot-avatar-container">
        <!-- 头像和状态指示器 -->
        <view class="bot-avatar-wrapper" :class="{ 'avatar-pulse': isProcessing }">
          <image
            class="bot-avatar"
            :src="bot?.config?.avatar || '/static/default_avatar.png'"
            mode="aspectFill"
          />
          <view class="avatar-status" :class="{ 'status-active': isProcessing }"></view>
        </view>
        <text class="bot-name">{{ bot?.config?.name || '语音助手' }}</text>
      </view>
      
      <view class="bot-status">
        <text class="status-text">{{ statusText }}</text>
      </view>
    </view>

    <!-- 聊天历史记录
    <scroll-view 
      class="chat-history" 
      scroll-y 
      :scroll-top="scrollTop"
      :class="{ 'history-active': chatHistory.length > 0 }"
    >
      <view class="chat-messages">
        <view 
          v-for="(message, index) in chatHistory" 
          :key="index" 
          class="message-item"
          :class="{ 'user-message': message.char === 'USER', 'bot-message': message.char === 'SYSTEM' }"
        >
          <view class="message-avatar">
            <image 
              :src="message.char === 'USER' ? '/static/user-avatar.png' : bot?.config?.avatar" 
              mode="aspectFill"
            />
          </view>
          <view class="message-content">
            <view class="message-text">{{ message.content.message }}</view>
            <view class="message-actions" v-if="message.content.type === 'Audio'">
              <view class="audio-action" @tap="playAudio(message.content.imageId)">
                <text class="audio-icon">🔊</text>
                <text class="audio-text">播放</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view> -->

    <!-- 音频波形可视化 -->
    <view class="audio-visualizer" :class="{ 'visualizer-active': isRecording }">
      <view 
        v-for="(bar, index) in visualizerBars" 
        :key="index" 
        class="visualizer-bar"
        :style="{ height: `${bar}rpx`, animationDelay: `${index * 0.05}s` }"
      ></view>
    </view>

    <!-- 录音按钮区域 -->
    <view class="audio-controls">
      <!-- 动态圆圈容器 -->
      <view class="circle-container" :class="{ 'circle-active': isRecording }">
        <view 
          class="dynamic-circle" 
          :style="{
            transform: `scale(${circleScale})`,
            borderWidth: `${circleBorderWidth}rpx`
          }"
        ></view>
      </view>
      
      <!-- 加载动画 -->
      <view class="loading-container" :class="{ 'loading-active': isPending }">
        <view class="loading-circle"></view>
      </view>
      
      <!-- 主按钮 -->
      <view 
        class="audio-button"
        :class="{
          'recording': isRecording,
          'pending': isPending
        }"
        @touchstart="startRecording"
        @touchend="stopRecording"
        @touchcancel="cancelRecording"
      >
        <text class="button-icon">{{ buttonIcon }}</text>
        <text class="button-text">{{ buttonText }}</text>
      </view>
    </view>

    <!-- 提示信息 -->
    <view class="audio-tips" :class="{ 'tips-hidden': isRecording || isPending }">
      <text class="tips-text">{{ tipsText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick } from 'vue';
import { getBot, getBotChatHistory } from '../model/bot_model';
import api from '@/utils/api.js';

// 状态变量
const isRecording = ref(false);
const isPending = ref(false);
const isProcessing = ref(false);
const bot = ref(null);
const botId = ref(null);
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const circleScale = ref(1);
const circleBorderWidth = ref(4);
const recordingDuration = ref(0);
const recordingTimer = ref(null);
const visualizerBars = reactive(Array(20).fill(10)); // 初始化20个波形条
const chatHistory = ref([]);
const scrollTop = ref(0);

// 计算属性
const buttonText = computed(() => {
  if (isRecording.value) return '松开发送';
  if (isPending.value) return '处理中...';
  return '按住说话';
});

const buttonIcon = computed(() => {
  if (isRecording.value) return '🎤';
  if (isPending.value) return '⏳';
  return '🎤';
});

const statusText = computed(() => {
  if (isRecording.value) return `正在录音 ${formatDuration(recordingDuration.value)}`;
  if (isPending.value) return '正在处理...';
  if (isProcessing.value) return '正在思考...';
  return '等待您的语音指令';
});

const tipsText = computed(() => {
  if (bot.value) {
    return `与 ${bot.value.config.name} 进行语音对话`;
  }
  return '按住按钮开始录音，松开发送';
});

// 格式化录音时长
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 生命周期钩子
onMounted(async () => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  botId.value = currentPage.options.botId;
  
  if (botId.value) {
    try {
      bot.value = await getBot(botId.value);
      console.log('获取到机器人信息:', bot.value);
      
      // 获取聊天历史记录
      chatHistory.value = await getBotChatHistory(botId.value);
      scrollToBottom();
    } catch (error) {
      console.error('获取机器人信息失败:', error);
      uni.showToast({
        title: '获取机器人信息失败',
        icon: 'none'
      });
    }
  }
  
  // 初始化录音管理器
  setupRecorderManager();
  
  // 初始化音频播放器
  setupAudioContext();
});

// 设置录音管理器
const setupRecorderManager = () => {
  // 录音完成事件处理
  recorderManager.onStop(handleRecordingStop);
  
  // 错误处理
  recorderManager.onError(handleRecordingError);
  
  // 录音帧处理
  recorderManager.onFrameRecorded(handleFrameRecorded);
};

// 设置音频播放器
const setupAudioContext = () => {
  innerAudioContext.onPlay(() => {
    console.log('开始播放音频');
  });
  
  innerAudioContext.onEnded(() => {
    console.log('音频播放结束');
  });
  
  innerAudioContext.onError((res) => {
    console.error('音频播放错误:', res);
    uni.showToast({
      title: '音频播放失败',
      icon: 'none'
    });
  });
};

// 播放音频
const playAudio = (audioUrl) => {
  if (innerAudioContext.src === audioUrl && !innerAudioContext.paused) {
    // 如果当前正在播放同一个音频，则暂停
    innerAudioContext.pause();
    return;
  }
  
  // 设置音频源并播放
  innerAudioContext.src = audioUrl;
  innerAudioContext.play();
};

// 开始录音
const startRecording = () => {
  if (innerAudioContext.paused === false) {
    innerAudioContext.stop();
  }
  
  isPending.value = false;
  isRecording.value = true;
  circleScale.value = 1;
  circleBorderWidth.value = 4;
  recordingDuration.value = 0;
  
  // 开始计时
  recordingTimer.value = setInterval(() => {
    recordingDuration.value++;
    // 60秒自动停止
    if (recordingDuration.value >= 60) {
      stopRecording();
    }
  }, 1000);
  
  recorderManager.start({
    duration: 60000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 96000,
    format: 'mp3',
  });
  
  startVolumeAnimation();
};

// 停止录音
const stopRecording = () => {
  if (!isRecording.value) return;
  
  isRecording.value = false;
  isPending.value = true;
  recorderManager.stop();
  stopVolumeAnimation();
  
  // 清除计时器
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

// 取消录音
const cancelRecording = () => {
  isRecording.value = false;
  isPending.value = false;
  recorderManager.stop();
  stopVolumeAnimation();
  
  // 清除计时器
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  uni.showToast({
    title: '已取消录音',
    icon: 'none'
  });
};

// 音量动画
const startVolumeAnimation = () => {
  // 启动波形动画
  updateVisualizerBars();
};

const stopVolumeAnimation = () => {
  circleScale.value = 1;
  circleBorderWidth.value = 4;
};

// 更新可视化波形
const updateVisualizerBars = () => {
  if (!isRecording.value) return;
  
  // 随机生成波形高度
  for (let i = 0; i < visualizerBars.length; i++) {
    visualizerBars[i] = 10 + Math.random() * 90;
  }
  
  // 持续更新
  setTimeout(updateVisualizerBars, 100);
};

// 处理录音帧
const handleFrameRecorded = (res) => {
  // 模拟音量值，实际应该使用res中的音量数据
  const volume = Math.random(); // 0-1之间的值
  
  // 根据音量调整圆圈大小和边框宽度
  circleScale.value = 1 + volume * 0.5; // 1-1.5倍大小变化
  circleBorderWidth.value = 4 + volume * 16; // 4-20rpx边框宽度变化
};

// 处理录音完成
const handleRecordingStop = async (res) => {
  if (!isPending.value) return; // 如果不是在pending状态，说明是取消录音
  
  try {
    // 设置处理状态
    isProcessing.value = true;
    
    // 发送语音消息到服务器
    const response = await api.chat.sendAudioMessage(
      chatHistory.value, 
      res.tempFilePath, 
      botId.value, 
      bot.value.config
    );
    
    // 播放返回的音频
    if (response.botAudioUrl) {
      innerAudioContext.src = response.botAudioUrl;
      innerAudioContext.play();
    }
    
    // 滚动到底部
    scrollToBottom();
    
    // 重置状态
    isPending.value = false;
    isProcessing.value = false;
    
    // 显示成功提示
    uni.showToast({
      title: '处理成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('处理录音失败：', error);
    uni.showToast({
      title: '处理失败，请重试',
      icon: 'none'
    });
    isPending.value = false;
    isProcessing.value = false;
  }
};

// // 滚动到底部
// const scrollToBottom = async () => {
//   await nextTick();
//   // 使用一个很大的值确保滚动到底部
//   scrollTop.value = 999999;
// };

// 处理录音错误
const handleRecordingError = (error) => {
  console.error('录音错误：', error);
  uni.showToast({
    title: '录音出错，请重试',
    icon: 'none'
  });

  // 检查是否是权限被拒绝
  if (error.errMsg && error.errMsg.includes('auth deny')) {
    uni.showModal({
      title: '权限问题',
      content: '录音权限被拒绝，请前往设置中开启录音权限',
      showCancel: false,
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          // 引导用户进入设置页面
          uni.openSetting({
            success: (settingdata) => {
              console.log('用户已进入设置页面，当前权限设置：', settingdata.authSetting);
              if (settingdata.authSetting['scope.record']) {
                console.log('录音权限已开启');
              } else {
                console.log('录音权限仍未开启');
              }
            }
          });
        }
      }
    });
  }

  // 重置状态
  isRecording.value = false;
  isPending.value = false;
  isProcessing.value = false;
  stopVolumeAnimation();
  
  // 清除计时器
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};
</script>

<style>
@import '../static/styles/md3.css';

.audio-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--md-sys-color-surface), var(--md-sys-color-surface-variant));
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding-top: 80rpx;
}

/* 机器人信息区域 */
.bot-info {
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bot-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}

.bot-avatar-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bot-avatar {
  width: 152rpx;
  height: 152rpx;
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  border: 4rpx solid var(--md-sys-color-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
  object-fit: cover;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.avatar-pulse::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: transparent;
  border: 4rpx solid var(--md-sys-color-primary);
  opacity: 0.7;
  animation: avatar-pulse-effect 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  z-index: 0;
  box-sizing: border-box;
}

@keyframes avatar-pulse-effect {
  0% {
    width: 160rpx;
    height: 160rpx;
    opacity: 0.7;
  }
  100% {
    width: 240rpx;
    height: 240rpx;
    opacity: 0;
  }
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: var(--md-sys-color-outline);
  border: 4rpx solid var(--md-sys-color-surface);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.status-active {
  background-color: var(--md-sys-color-primary);
  animation: status-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes status-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.bot-name {
  font-size: 40rpx;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.bot-status {
  padding: 16rpx 32rpx;
  background-color: var(--md-sys-color-surface-container);
  border-radius: 40rpx;
  margin-top: 16rpx;
}

.status-text {
  font-size: 28rpx;
  color: var(--md-sys-color-on-surface-variant);
}

/* 聊天历史记录 */
.chat-history {
  flex: 1;
  padding: 0 32rpx;
  margin: 16rpx 0;
  max-height: 0;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.history-active {
  max-height: 600rpx;
  opacity: 1;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 24rpx;
}

.message-item {
  display: flex;
  gap: 16rpx;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-message {
  align-self: flex-start;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  background-color: var(--md-sys-color-surface-container);
  padding: 16rpx 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background-color: var(--md-sys-color-primary-container);
  border-top-right-radius: 4rpx;
}

.bot-message .message-content {
  background-color: var(--md-sys-color-surface-container-high);
  border-top-left-radius: 4rpx;
}

.message-text {
  font-size: 28rpx;
  color: var(--md-sys-color-on-surface);
  line-height: 1.5;
}

.user-message .message-text {
  color: var(--md-sys-color-on-primary-container);
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8rpx;
}

.audio-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.audio-icon {
  font-size: 24rpx;
}

.audio-text {
  font-size: 24rpx;
}

/* 音频可视化区域 */
.audio-visualizer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 200rpx;
  gap: 8rpx;
  padding: 0 32rpx;
  margin: 32rpx 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.visualizer-active {
  opacity: 1;
}

.visualizer-bar {
  width: 12rpx;
  height: 10rpx;
  background-color: var(--md-sys-color-primary);
  border-radius: 6rpx;
  transition: height 0.1s ease-in-out;
  animation: bar-pulse 1s ease-in-out infinite;
}

@keyframes bar-pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 录音控制区域 */
.audio-controls {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48rpx 0;
  margin-top: auto;
}

.circle-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280rpx;
  height: 280rpx;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.circle-container.circle-active {
  opacity: 1;
}

.dynamic-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(0, 136, 209, 0.3);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380rpx;
  height: 380rpx;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-container.loading-active {
  opacity: 1;
}

.loading-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 12rpx solid transparent;
  border-top-color: var(--md-sys-color-primary);
  border-right-color: var(--md-sys-color-primary);
  border-bottom-color: var(--md-sys-color-primary);
  animation: loading-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-sizing: border-box;
}

@keyframes loading-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.audio-button {
  width: 280rpx;
  height: 280rpx;
  border-radius: 140rpx;
  background: var(--md-sys-color-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 136, 209, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
}

.audio-button::before {
  content: '';
  position: absolute;
  top: -16rpx;
  left: -16rpx;
  right: -16rpx;
  bottom: -16rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 136, 209, 0.1) 0%, rgba(0, 136, 209, 0) 70%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.audio-button:active::before {
  opacity: 1;
}

.audio-button.recording {
  transform: scale(0.95);
  background: var(--md-sys-color-primary-container);
  box-shadow: 0 4rpx 12rpx rgba(0, 136, 209, 0.4);
}

.audio-button.pending {
  transform: scale(0.95);
  background: var(--md-sys-color-primary-container);
  box-shadow: 0 4rpx 12rpx rgba(0, 136, 209, 0.4);
}

.button-icon {
  font-size: 64rpx !important;
  color: var(--md-sys-color-on-primary);
}

.button-text {
  color: var(--md-sys-color-on-primary);
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}

/* 提示信息 */
.audio-tips {
  text-align: center;
  padding: 32rpx;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tips-hidden {
  opacity: 0;
}

.tips-text {
  font-size: 28rpx;
  color: var(--md-sys-color-on-surface-variant);
}
</style> 