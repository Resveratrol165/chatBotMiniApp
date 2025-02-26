import { request, post } from '@/utils/http_utils'
import { getFomalData, formalMessage } from '@/utils/formalData.js'
import { updateBotChatHistory } from '../model/bot_model'

// 基础URL配置
// 多模态大模型请求相关参数
const CHAT_URL = 'http://10.64.68.86:37861';
const CHAT_HEADER = {
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Connection": "keep-alive",
}

// 语音相关API配置
const SPEECH_TO_TEXT_URL = `${CHAT_URL}/api/speech-to-text`; // 语音转文字API
const TEXT_TO_SPEECH_URL = `${CHAT_URL}/api/text-to-speech`; // 文字转语音API
const AUDIO_HEADER = {
  "Content-Type": "multipart/form-data",
  "Accept": "*/*",
  "Connection": "keep-alive",
}

/**
 * 生成系统提示
 * @param {Object} botConfig - 机器人配置
 * @returns {string} 格式化的系统提示
 */
const generateSystemPrompt = (botConfig) => {
  if (!botConfig) return '';
  
  let prompt = '';
  
  // 添加人设
  if (botConfig.persona) {
    prompt += `角色设定：${botConfig.persona}\n\n`;
  }
  
  // 添加背景
  if (botConfig.background) {
    prompt += `背景信息：${botConfig.background}\n\n`;
  }
  
  // 添加描述
  if (botConfig.description) {
    prompt += `描述：${botConfig.description}\n\n`;
  }
  
  return prompt.trim();
}

// API方法封装 一些示例后续可以调整改动
export default {
  // 聊天相关接口
  chat: {
    /**
     * 发送文本消息并获取回复
     * @param {Array} chatHistory - 当前聊天历史
     * @param {string} message - 用户发送的文本消息
     * @param {string} botId - 机器人ID，用于保存聊天记录
     * @param {Object} botConfig - 机器人配置
     * @returns {Object} 包含用户消息和机器人回复的对象
     */
    async sendTextMessage(chatHistory, message, botId, botConfig) {
      // 创建用户消息对象
      const userMessage = formalMessage('USER', 'Text', message)
      
      try {
        // 添加用户消息到聊天历史
        chatHistory.push(userMessage)
        
        // 生成系统提示
        const systemPrompt = generateSystemPrompt(botConfig);
        
        // 准备请求数据并发送请求
        const data = getFomalData(chatHistory, systemPrompt)
        const result = await post(CHAT_URL+'/chat/chat/completions', data, CHAT_HEADER)
        
        // 处理响应
        const response = result["choices"][0]["message"]["content"]
        const botMessage = formalMessage('SYSTEM', 'Text', response)
        
        // 添加机器人回复到聊天历史
        chatHistory.push(botMessage)
        
        // 保存用户消息到存储
        if (botId) {
          await updateBotChatHistory(botId, userMessage)
          await updateBotChatHistory(botId, botMessage)
        }
        
        return {
          userMessage,
          botMessage
        }
      } catch (error) {
        console.error('发送消息失败:', error)
        throw error
      }
    },
    
    /**
     * 发送图片消息并获取回复
     * @param {Array} chatHistory - 当前聊天历史
     * @param {string} imagePath - 图片本地路径
     * @param {string} imageId - 图片ID
     * @param {string} botId - 机器人ID，用于保存聊天记录
     * @param {Object} botConfig - 机器人配置
     * @returns {Object} 包含用户消息和机器人回复的对象
     */
    async sendImageMessage(chatHistory, imagePath, imageId, botId, botConfig) {
      try {
        // 封装imageUrl
        const imageUrl = `${CHAT_URL}/v1/files/${imageId}==/content`;
        const userMessage = formalMessage('USER', 'Image', imagePath, imageUrl);
        
        // 添加用户消息到聊天历史
        chatHistory.push(userMessage);
        
        // 生成系统提示
        const systemPrompt = generateSystemPrompt(botConfig);
        
        // 准备请求数据并发送请求
        const data = getFomalData(chatHistory, systemPrompt);
        const result = await post(CHAT_URL+'/chat/chat/completions', data, CHAT_HEADER)
        
        // 处理响应
        const response = result["choices"][0]["message"]["content"]
        const botMessage = formalMessage('ASSISTANT', 'Text', response)
        
        // 添加机器人回复到聊天历史
        chatHistory.push(botMessage)
        
        // 保存消息到存储
        if (botId) {
          await updateBotChatHistory(botId, userMessage)
          await updateBotChatHistory(botId, botMessage)
        }
        
        return {
          userMessage,
          botMessage
        }
      } catch (error) {
        console.error('发送图片消息失败:', error)
        throw error
      }
    },
    
    /**
     * 发送语音消息并获取回复
     * @param {Array} chatHistory - 当前聊天历史
     * @param {string} audioPath - 语音文件本地路径
     * @param {string} botId - 机器人ID，用于保存聊天记录
     * @param {Object} botConfig - 机器人配置
     * @returns {Object} 包含用户消息、机器人回复和语音URL的对象
     */
    async sendAudioMessage(chatHistory, audioPath, botId, botConfig) {
      try {
        // 1. 将语音转换为文字
        const textResult = await this.speechToText(audioPath);
        const transcribedText = textResult.text;
        
        // 2. 创建用户语音消息对象
        const userMessage = formalMessage('USER', 'Audio', transcribedText, audioPath);
        
        // 3. 添加用户消息到聊天历史
        chatHistory.push(userMessage);
        
        // 4. 生成系统提示
        const systemPrompt = generateSystemPrompt(botConfig);
        
        // 5. 准备请求数据并发送请求
        const data = getFomalData(chatHistory, systemPrompt);
        const result = await post(CHAT_URL+'/chat/chat/completions', data, CHAT_HEADER);
        
        // 6. 处理文本响应
        const textResponse = result["choices"][0]["message"]["content"];
        
        // 7. 将文本转换为语音
        const audioResult = await this.textToSpeech(textResponse, botConfig);
        
        // 8. 创建机器人语音消息对象
        const botMessage = formalMessage('SYSTEM', 'Audio', textResponse, audioResult.audioUrl);
        
        // 9. 添加机器人回复到聊天历史
        chatHistory.push(botMessage);
        
        // 10. 保存消息到存储
        if (botId) {
          await updateBotChatHistory(botId, userMessage);
          await updateBotChatHistory(botId, botMessage);
        }
        
        return {
          userMessage,
          botMessage,
          transcribedText,
          botAudioUrl: audioResult.audioUrl
        };
      } catch (error) {
        console.error('发送语音消息失败:', error);
        throw error;
      }
    },
    
    /**
     * 语音转文字API
     * @param {string} audioPath - 语音文件本地路径
     * @returns {Promise<Object>} 包含转换后文本的对象
     */
    async speechToText(audioPath) {
      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('audio', {
          uri: audioPath,
          type: 'audio/mp3',
          name: 'audio.mp3'
        });
        
        // 发送请求
        // 注意：这里使用了模拟实现，实际项目中需要替换为真实API
        // const result = await post(SPEECH_TO_TEXT_URL, formData, AUDIO_HEADER);
        
        // 模拟API响应
        console.log('语音转文字请求路径:', audioPath);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          text: "这是从语音中识别出的文本内容。实际项目中应替换为真实API返回的文本。",
          confidence: 0.95
        };
      } catch (error) {
        console.error('语音转文字失败:', error);
        throw error;
      }
    },
    
    /**
     * 文字转语音API
     * @param {string} text - 需要转换为语音的文本
     * @param {Object} botConfig - 机器人配置，可用于设置语音特性
     * @returns {Promise<Object>} 包含语音URL的对象
     */
    async textToSpeech(text, botConfig) {
      try {
        // 准备请求数据
        const data = {
          text: text,
          voice: botConfig.voice || 'default', // 可以在机器人配置中设置语音特性
          speed: botConfig.speechSpeed || 1.0,
          pitch: botConfig.speechPitch || 1.0
        };
        
        // 发送请求
        // 注意：这里使用了模拟实现，实际项目中需要替换为真实API
        // const result = await post(TEXT_TO_SPEECH_URL, data, CHAT_HEADER);
        
        // 模拟API响应
        console.log('文字转语音请求:', text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 返回模拟的语音URL
        return {
          audioUrl: 'https://example.com/audio/response.mp3', // 实际项目中应替换为真实API返回的URL
          duration: text.length * 0.1 // 模拟语音时长（秒）
        };
      } catch (error) {
        console.error('文字转语音失败:', error);
        throw error;
      }
    }
  },
}