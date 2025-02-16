import { setStorageData, getStorageData } from '../utils/storage';

// 存储键名常量
const BOT_STORAGE_KEY = 'chatbot_config';
const BOT_LIST_KEY = 'chatbot_list';  // 新增机器人列表的存储键名

/**
 * Bot 数据结构
 * @typedef {Object} BotConfig
 * @property {string} avatar - 机器人头像URL
 * @property {string} greeting - 默认的欢迎语
 * @property {string} persona - 人物设定
 * @property {string} [background] - 背景设定，可选
 */

/**
 * 默认的机器人配置
 */
const DEFAULT_BOT_CONFIG = {
  avatar: '/static/default_avatar.png', // 默认头像路径
  greeting: '你好！我是你的AI助手，有什么我可以帮你的吗？',
  persona: '我是一个友好、专业的AI助手',
  background: ''
};

/**
 * Bot 类 - 管理单个机器人的配置
 */
class Bot {
  /**
   * @param {string} id - 机器人ID
   * @param {Object} config - 机器人配置
   * @param {string} config.name - 机器人名称
   * @param {string} config.avatar - 机器人头像
   * @param {string} config.description - 机器人描述
   * @param {string} config.greeting - 欢迎语
   * @param {string} config.persona - 人物设定
   * @param {string} [config.background] - 背景设定
   * @param {string} [config.createTime] - 创建时间
   */
  constructor(id, config) {
    this.id = id;
    this.config = config;
  }

  /**
   * 更新机器人配置
   * @param {Partial<BotConfig>} updates - 需要更新的字段
   * @returns {Promise<void>}
   */
  async update(updates) {
    try {
      // 更新配置
      this.config = { ...this.config, ...updates };
      
      // 保存到存储
      await setStorageData(`${BOT_STORAGE_KEY}_${this.id}`, this.config);
      
      // 如果更新了列表项相关的字段，也更新列表
      if (updates.name || updates.avatar || updates.description) {
        const list = await getStorageData(BOT_LIST_KEY) || [];
        const updatedList = list.map(item => {
          if (item.id === this.id) {
            return {
              ...item,
              name: this.config.name,
              avatar: this.config.avatar,
              description: this.config.description
            };
          }
          return item;
        });
        await setStorageData(BOT_LIST_KEY, updatedList);
      }
    } catch (error) {
      console.error('更新机器人配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取完整配置
   * @returns {Object} 机器人完整配置
   */
  getConfig() {
    return this.config;
  }
}

/**
 * 获取机器人列表
 * @returns {Promise<Bot[]>} 返回机器人对象数组
 */
export const getBotList = async () => {
  try {
    const list = await getStorageData(BOT_LIST_KEY) || [];
    const bots = await Promise.all(
      list.map(async (item) => {
        const config = await getStorageData(`${BOT_STORAGE_KEY}_${item.id}`);
        return new Bot(item.id, { ...config, ...item });
      })
    );
    return bots;
  } catch (error) {
    console.error('获取机器人列表失败:', error);
    return [];
  }
};

/**
 * 根据ID获取机器人
 * @param {string} botId - 机器人ID
 * @returns {Promise<Bot>} 返回机器人对象
 */
export const getBot = async (botId) => {
  try {
    const config = await getStorageData(`${BOT_STORAGE_KEY}_${botId}`);
    const list = await getStorageData(BOT_LIST_KEY) || [];
    const listItem = list.find(item => item.id === botId);
    
    if (!config || !listItem) {
      throw new Error('机器人不存在');
    }
    
    return new Bot(botId, { ...config, ...listItem });
  } catch (error) {
    console.error(`获取机器人(${botId})失败:`, error);
    throw error;
  }
};

/**
 * 创建新的机器人
 * @param {Object} botInfo - 机器人信息
 * @returns {Promise<Bot>} 返回新创建的机器人对象
 */
export const newBot = async (botInfo) => {
  try {
    const botId = 'bot_' + Date.now();
    const config = {
      ...botInfo,
      createTime: new Date().toISOString()
    };
    
    // 创建新的Bot实例
    const bot = new Bot(botId, config);
    
    // 保存配置
    await setStorageData(`${BOT_STORAGE_KEY}_${botId}`, config);
    
    // 更新列表
    const currentList = await getStorageData(BOT_LIST_KEY) || [];
    const listItem = {
      id: botId,
      name: botInfo.name,
      avatar: botInfo.avatar,
      description: botInfo.description,
      createTime: config.createTime
    };
    await setStorageData(BOT_LIST_KEY, [...currentList, listItem]);
    
    return bot;
  } catch (error) {
    console.error('创建新机器人失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取特定机器人的配置
 * @param {string} botId - 机器人ID
 * @returns {Promise<BotConfig>}
 */
export const getBotConfigById = async (botId) => {
  try {
    const config = await getStorageData(`${BOT_STORAGE_KEY}_${botId}`);
    return config || DEFAULT_BOT_CONFIG;
  } catch (error) {
    console.error(`获取机器人(${botId})配置失败:`, error);
    return DEFAULT_BOT_CONFIG;
  }
};

/**
 * 保存机器人配置
 * @param {BotConfig} botConfig - 机器人配置对象
 * @returns {Promise<void>}
 */
export const saveBotConfig = async (botConfig) => {
  try {
    await setStorageData(BOT_STORAGE_KEY, botConfig);
  } catch (error) {
    console.error('保存机器人配置失败:', error);
    throw error;
  }
};

/**
 * 获取机器人配置
 * @returns {Promise<BotConfig>} 返回机器人配置对象
 */
export const getBotConfig = async () => {
  try {
    const config = await getStorageData(BOT_STORAGE_KEY);
    return config || DEFAULT_BOT_CONFIG;
  } catch (error) {
    console.error('获取机器人配置失败，使用默认配置:', error);
    return DEFAULT_BOT_CONFIG;
  }
};

/**
 * 更新机器人配置的特定字段
 * @param {Partial<BotConfig>} updates - 需要更新的字段
 * @returns {Promise<BotConfig>} 返回更新后的完整配置
 */
export const updateBotConfig = async (updates) => {
  try {
    const currentConfig = await getBotConfig();
    const newConfig = { ...currentConfig, ...updates };
    await saveBotConfig(newConfig);
    return newConfig;
  } catch (error) {
    console.error('更新机器人配置失败:', error);
    throw error;
  }
};
