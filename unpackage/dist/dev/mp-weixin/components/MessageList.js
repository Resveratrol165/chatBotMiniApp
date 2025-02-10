"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  ChatMessage();
}
const ChatMessage = () => "./ChatMessage.js";
const _sfc_main = {
  __name: "MessageList",
  props: {
    chatData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["load-more"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const scrollTop = common_vendor.ref(0);
    common_vendor.watch(
      () => props.chatData.chat.length,
      () => {
        common_vendor.index.__f__("log", "at components/MessageList.vue:49", "消息列表长度变化，准备滚动到底部");
        common_vendor.nextTick$1(() => {
          common_vendor.index.__f__("log", "at components/MessageList.vue:51", "执行滚动");
          scrollTop.value = 0;
          common_vendor.nextTick$1(() => {
            scrollTop.value = 99999;
          });
        });
      }
    );
    const handleScrollToUpper = () => {
      emit("load-more");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.loading
      }, __props.loading ? {} : {}, {
        b: common_vendor.f(__props.chatData.chat, (message, index, i0) => {
          return {
            a: index,
            b: "1cfce119-0-" + i0,
            c: common_vendor.p({
              message,
              ["user-avatar"]: __props.chatData.userAvatar,
              ["bot-avatar"]: __props.chatData.botAvatar,
              ["user-name"]: __props.chatData.userName,
              ["bot-name"]: __props.chatData.botName
            })
          };
        }),
        c: scrollTop.value,
        d: common_vendor.o(handleScrollToUpper)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cfce119"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/MessageList.js.map
