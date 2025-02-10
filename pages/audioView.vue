<template>
  <view class="audio-container">
    <view class="audio-button-container">
      <!-- 动态圆圈容器 -->
      <view class="circle-container" :class="{ 'circle-active': isRecording }">
        <view class="dynamic-circle" :style="{
          transform: `scale(${circleScale})`,
          borderWidth: `${circleBorderWidth}rpx`
        }"></view>
      </view>
      
      <!-- Windows 11 风格加载动画 -->
      <view class="loading-container" :class="{ 'loading-active': isPending }">
        <view class="loading-circle"></view>
      </view>
      
      <!-- 主按钮 -->
      <view class="audio-button"
            :class="{
              'recording': isRecording,
              'pending': isPending
            }"
            @touchstart="startRecording"
            @touchend="stopRecording"
            @touchcancel="cancelRecording">
        <text class="button-text">{{ buttonText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const isRecording = ref(false);
const isPending = ref(false);
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const circleScale = ref(1);
const circleBorderWidth = ref(4);

// 按钮文字
const buttonText = computed(() => {
  if (isRecording.value) return '松开发送';
  if (isPending.value) return '处理中...';
  return '按住说话';
});

// 开始录音
const startRecording = () => {
  if (innerAudioContext.paused === false) {
    innerAudioContext.stop();
  }
  
  isPending.value = false;
  isRecording.value = true;
  circleScale.value = 1;
  circleBorderWidth.value = 4;
  
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
};

// 取消录音
const cancelRecording = () => {
  isRecording.value = false;
  isPending.value = false;
  recorderManager.stop();
  stopVolumeAnimation();
};

let volumeTimer = null;

// 音量动画
const startVolumeAnimation = () => {
  // 监听音量变化
  recorderManager.onFrameRecorded((res) => {
    // 模拟音量值，实际应该使用res中的音量数据
    const volume = Math.random(); // 0-1之间的值
    
    // 根据音量调整圆圈大小和边框宽度
    circleScale.value = 1 + volume * 0.5; // 1-1.5倍大小变化
    circleBorderWidth.value = 4 + volume * 16; // 4-20rpx边框宽度变化
  });
};

const stopVolumeAnimation = () => {
  circleScale.value = 1;
  circleBorderWidth.value = 4;
};

// 录音完成事件处理
recorderManager.onStop(async (res) => {
  if (!isPending.value) return; // 如果不是在pending状态，说明是取消录音
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 这里添加发送录音文件到服务器的逻辑
    // const response = await sendAudioToServer(res.tempFilePath);
    // 播放返回的音频
    // innerAudioContext.src = response.audioUrl;
    // innerAudioContext.play();
    
    // TODO: 替换为实际的API调用
    console.log('录音文件路径：', res.tempFilePath);
    
    // 重置状态
    isPending.value = false;
  } catch (error) {
    console.error('处理录音失败：', error);
    uni.showToast({
      title: '处理失败，请重试',
      icon: 'none'
    });
    isPending.value = false;
  }
});

// 错误处理
recorderManager.onError((error) => {
  console.error('录音错误：', error);
  uni.showToast({
    title: '录音出错，请重试',
    icon: 'none'
  });

  // 检查是否是权限被拒绝
  if (error.errMsg.includes('auth deny')) {
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
  stopVolumeAnimation();
});
</script>

<style scoped>
.audio-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #FAFAFA;
}

.audio-button-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600rpx;
  height: 600rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280rpx;
  height: 280rpx;
  border-radius: 140rpx;
  background: #007AFF;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.audio-button.recording {
  transform: translate(-50%, -50%) scale(0.95);
  background: #0066CC;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.audio-button.pending {
  animation: none;
  transform: translate(-50%, -50%) scale(0.95);
  background: #0066CC;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.button-text {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
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
  border: 4rpx solid rgba(0, 122, 255, 0.3);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380rpx; /* 比按钮大约135% */
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
  border-top-color: #007AFF;
  border-right-color: #007AFF;
  border-bottom-color: #007AFF;
  animation: win11-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-sizing: border-box;
}

@keyframes win11-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 