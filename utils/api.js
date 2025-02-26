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
    }
  },
}