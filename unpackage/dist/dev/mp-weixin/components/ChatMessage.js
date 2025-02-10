"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "ChatMessage",
  props: {
    message: {
      type: Object,
      required: true
    },
    userAvatar: {
      type: String,
      required: true
    },
    botAvatar: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    botName: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const isUser = common_vendor.computed(() => props.message.char === "USER");
    const avatarSrc = common_vendor.computed(() => isUser.value ? props.userAvatar : props.botAvatar);
    const displayName = common_vendor.computed(() => isUser.value ? props.userName : props.botName);
    const previewImage = () => {
      if (props.message.content.type === "Image") {
        common_vendor.index.previewImage({
          urls: [props.message.content.message]
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: avatarSrc.value,
        b: common_vendor.t(displayName.value),
        c: __props.message.content.type === "Text"
      }, __props.message.content.type === "Text" ? {
        d: common_vendor.t(__props.message.content.message)
      } : __props.message.content.type === "Image" ? {
        f: __props.message.content.message,
        g: common_vendor.o(previewImage)
      } : __props.message.content.type === "Audio" ? {
        i: common_vendor.p({
          type: "sound",
          size: "20"
        }),
        j: common_vendor.t(__props.message.content.length)
      } : {}, {
        e: __props.message.content.type === "Image",
        h: __props.message.content.type === "Audio",
        k: isUser.value ? 1 : "",
        l: isUser.value ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-711b6d90"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ChatMessage.js.map
