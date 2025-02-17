"use strict";
const common_vendor = require("../common/vendor.js");
const model_bot_model = require("../model/bot_model.js");
if (!Math) {
  ContactComponent();
}
const ContactComponent = () => "../components/contactComponent.js";
const _sfc_main = {
  __name: "contactView",
  setup(__props) {
    const botList = common_vendor.ref([]);
    const fetchBotList = async () => {
      try {
        botList.value = await model_bot_model.getBotList();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/contactView.vue:33", "获取机器人列表失败:", error);
        common_vendor.index.showToast({
          title: "获取列表失败",
          icon: "none"
        });
      }
    };
    const handleBotSelect = (bot) => {
      common_vendor.index.__f__("log", "at pages/contactView.vue:42", "选择了机器人:", bot);
    };
    const handleAddBot = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addBotView"
      });
    };
    common_vendor.onShow(() => {
      fetchBotList();
    });
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
