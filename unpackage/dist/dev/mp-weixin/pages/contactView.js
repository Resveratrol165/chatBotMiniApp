"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  ContactComponent();
}
const ContactComponent = () => "../components/contactComponent.js";
const _sfc_main = {
  __name: "contactView",
  setup(__props) {
    const botList = common_vendor.ref([
      {
        id: "test_bot_1",
        name: "Claude AI",
        avatar: "/static/images/claude.png",
        description: "由 Anthropic 开发的 AI 助手"
      },
      {
        id: "test_bot_2",
        name: "GPT Assistant",
        avatar: "/static/images/gpt.png",
        description: "智能对话助手，擅长编程和写作"
      },
      {
        id: "test_bot_3",
        name: "文心一言",
        avatar: "/static/images/wenxin.png",
        description: "百度研发的知识增强大模型"
      }
    ]);
    const handleBotSelect = (bot) => {
      common_vendor.index.__f__("log", "at pages/contactView.vue:48", "选择了机器人:", bot);
    };
    const handleAddBot = () => {
      common_vendor.index.__f__("log", "at pages/contactView.vue:52", "添加新机器人");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleAddBot),
        b: common_vendor.f(botList.value, (bot, k0, i0) => {
          return {
            a: bot.id,
            b: common_vendor.o(handleBotSelect, bot.id),
            c: "6ddd0609-0-" + i0,
            d: common_vendor.p({
              bot
            })
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ddd0609"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/contactView.js.map
