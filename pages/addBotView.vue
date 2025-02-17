<template>
  <view class="add-bot-view">
    <view class="header">
      <view 
        class="nav-right" 
        :class="{ disabled: !isFormValid }"
        @click="handleSave"
      >
        <text>保存</text>
      </view>
    </view>

    <view class="content">
      <view class="avatar-section">
        <view class="avatar-wrapper" @click="chooseImage">
          <van-image
            round
            width="120rpx"
            height="120rpx"
            :src="formData.avatar || '/static/default_avatar.png'"
          />
          <view class="avatar-overlay">
            <text class="material-symbols-outlined">photo_camera</text>
          </view>
        </view>
      </view>

      <view class="form-fields">
        <view class="md3-field" :class="{
          'md3-field--focused': focusedField === 'name',
          'md3-field--filled': formData.name
        }">
          <input
            v-model="formData.name"
            class="md3-field__input"
            placeholder=" "
            :maxlength="20"
            @focus="focusedField = 'name'"
            @blur="focusedField = ''"
          />
          <label class="md3-field__label">名称</label>
          <text class="md3-field__counter">{{ formData.name.length }}/20</text>
        </view>
        
        <view class="md3-field" :class="{
          'md3-field--focused': focusedField === 'description',
          'md3-field--filled': formData.description
        }">
          <input
            v-model="formData.description"
            class="md3-field__input"
            placeholder=" "
            :maxlength="50"
            @focus="focusedField = 'description'"
            @blur="focusedField = ''"
          />
          <label class="md3-field__label">描述</label>
          <text class="md3-field__counter">{{ formData.description.length }}/50</text>
        </view>
        
        <view class="md3-field md3-field--multiline" :class="{
          'md3-field--focused': focusedField === 'greeting',
          'md3-field--filled': formData.greeting
        }">
          <textarea
            v-model="formData.greeting"
            class="md3-field__textarea"
            placeholder=" "
            :maxlength="100"
            @focus="focusedField = 'greeting'"
            @blur="focusedField = ''"
          />
          <label class="md3-field__label">欢迎语</label>
          <text class="md3-field__counter">{{ formData.greeting.length }}/100</text>
        </view>
        
        <view class="md3-field md3-field--multiline" :class="{
          'md3-field--focused': focusedField === 'persona',
          'md3-field--filled': formData.persona
        }">
          <textarea
            v-model="formData.persona"
            class="md3-field__textarea"
            placeholder=" "
            :maxlength="500"
            @focus="focusedField = 'persona'"
            @blur="focusedField = ''"
          />
          <label class="md3-field__label">人物设定</label>
          <text class="md3-field__counter">{{ formData.persona.length }}/500</text>
        </view>
        
        <view class="md3-field md3-field--multiline" :class="{
          'md3-field--focused': focusedField === 'background',
          'md3-field--filled': formData.background
        }">
          <textarea
            v-model="formData.background"
            class="md3-field__textarea"
            placeholder=" "
            :maxlength="1000"
            @focus="focusedField = 'background'"
            @blur="focusedField = ''"
          />
          <label class="md3-field__label">背景设定（可选）</label>
          <text class="md3-field__counter">{{ formData.background.length }}/1000</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { newBot } from '../model/bot_model'

const formData = ref({
  name: '',
  avatar: '',
  description: '',
  greeting: '你好！我是你的AI助手，有什么我可以帮你的吗？',
  persona: '我是一个友好、专业的AI助手',
  background: ''
})

const isFormValid = computed(() => {
  return formData.value.name && 
         formData.value.description && 
         formData.value.greeting && 
         formData.value.persona
})

const focusedField = ref('')

const handleBack = () => {
  uni.navigateBack()
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0]
    }
  })
}

const handleSave = async () => {
  if (!isFormValid.value) return

  try {
    await newBot(formData.value)
    uni.navigateBack()
  } catch (error) {
    console.error('创建机器人失败:', error)
    uni.showToast({
      title: '创建失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
@import '../static/styles/md3.css';
.add-bot-view {
  padding: 0 32rpx;
  
  .header {
    height: 88rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    .nav-right {
      padding: 20rpx;
      color: var(--md-sys-color-primary);
      
      &.disabled {
        opacity: 0.5;
      }
    }
  }

  .avatar-section {
    display: flex;
    justify-content: center;
    margin: 32rpx 0;

    .avatar-wrapper {
      position: relative;
      width: 120rpx;
      height: 120rpx;
      
      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:active .avatar-overlay {
        opacity: 1;
      }
    }
  }
}
</style> 