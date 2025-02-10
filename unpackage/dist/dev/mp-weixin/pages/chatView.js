"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  (MessageList + InputField)();
}
const MessageList = () => "../components/MessageList.js";
const InputField = () => "../components/InputField.js";
const _sfc_main = {
  __name: "chatView",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const chatData = common_vendor.ref({
      userName: "",
      botName: "",
      userAvatar: "",
      botAvatar: "",
      chat: []
    });
    const handleSendMessage = (message) => {
      chatData.value.chat.push({
        char: "USER",
        content: {
          type: "Text",
          message
        }
      });
    };
    const handleImageSelected = (imagePath) => {
      chatData.value.chat.push({
        char: "USER",
        content: {
          type: "Image",
          message: imagePath
        }
      });
    };
    const initMessages = async () => {
      try {
        const response = {
          userName: "用户",
          botName: "AI助手",
          userAvatar: "/static/user-avatar.png",
          botAvatar: "/static/bot-avatar.png",
          chat: [
            {
              char: "USER",
              content: {
                type: "Text",
                message: "你好"
              }
            },
            {
              char: "BOT",
              content: {
                type: "Text",
                message: "你好！很高兴为你服务。我可以帮你处理文字、图片和音频消息。"
              }
            },
            {
              char: "USER",
              content: {
                type: "Image",
                message: "https://img.picui.cn/free/2025/02/04/67a19ace30f9b.jpg"
              }
            },
            {
              char: "BOT",
              content: {
                type: "Text",
                message: "我看到你发送了一张图片。图片处理功能正常工作中。"
              }
            },
            {
              char: "USER",
              content: {
                type: "Audio",
                message: "audio_file_url",
                length: 15
              }
            },
            {
              char: "BOT",
              content: {
                type: "Text",
                message: "收到你的语音消息，时长15秒。"
              }
            }
          ]
        };
        chatData.value = response;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatView.vue:111", "Failed to load messages:", error);
      }
    };
    const loadMoreMessages = async () => {
      if (loading.value || !hasMore.value)
        return;
      loading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const moreMessages = [];
        chatData.value.chat.unshift(...moreMessages);
        page.value++;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chatView.vue:126", "Failed to load more messages:", error);
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      initMessages();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(loadMoreMessages),
        b: common_vendor.p({
          ["chat-data"]: chatData.value,
          loading: loading.value
        }),
        c: common_vendor.o(handleSendMessage),
        d: common_vendor.o(handleImageSelected)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2ed22421"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/chatView.js.map
