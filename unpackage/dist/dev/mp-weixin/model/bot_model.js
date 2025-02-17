"use strict";
const common_vendor = require("../common/vendor.js");
const utils_storage = require("../utils/storage.js");
const BOT_STORAGE_KEY = "chatbot_config";
const BOT_LIST_KEY = "chatbot_list";
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
      this.config = { ...this.config, ...updates };
      await utils_storage.setStorageData(`${BOT_STORAGE_KEY}_${this.id}`, this.config);
      if (updates.name || updates.avatar || updates.description) {
        const list = await utils_storage.getStorageData(BOT_LIST_KEY) || [];
        const updatedList = list.map((item) => {
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
        await utils_storage.setStorageData(BOT_LIST_KEY, updatedList);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at model/bot_model.js:76", "更新机器人配置失败:", error);
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
const getBotList = async () => {
  try {
    const list = await utils_storage.getStorageData(BOT_LIST_KEY) || [];
    const bots = await Promise.all(
      list.map(async (item) => {
        const config = await utils_storage.getStorageData(`${BOT_STORAGE_KEY}_${item.id}`);
        return new Bot(item.id, { ...config, ...item });
      })
    );
    return bots;
  } catch (error) {
    common_vendor.index.__f__("error", "at model/bot_model.js:105", "获取机器人列表失败:", error);
    return [];
  }
};
const newBot = async (botInfo) => {
  try {
    const botId = "bot_" + Date.now();
    const config = {
      ...botInfo,
      createTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    const bot = new Bot(botId, config);
    await utils_storage.setStorageData(`${BOT_STORAGE_KEY}_${botId}`, config);
    let currentList = [];
    try {
      currentList = await utils_storage.getStorageData(BOT_LIST_KEY) || [];
    } catch (error) {
      if (error.errMsg && error.errMsg.includes("data not found")) {
        currentList = [];
      } else {
        throw error;
      }
    }
    const listItem = {
      id: botId,
      name: botInfo.name,
      avatar: botInfo.avatar,
      description: botInfo.description,
      createTime: config.createTime
    };
    await utils_storage.setStorageData(BOT_LIST_KEY, [...currentList, listItem]);
    return bot;
  } catch (error) {
    common_vendor.index.__f__("error", "at model/bot_model.js:179", "创建新机器人失败:", error);
    throw error;
  }
};
exports.getBotList = getBotList;
exports.newBot = newBot;
//# sourceMappingURL=../../.sourcemap/mp-weixin/model/bot_model.js.map
