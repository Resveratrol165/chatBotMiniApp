"use strict";
const common_vendor = require("../common/vendor.js");
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  _component_van_icon();
}
const MIN_HEIGHT = 32;
const MAX_HEIGHT = 120;
const _sfc_main = {
  __name: "InputField",
  emits: ["send", "image-selected"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const inputText = common_vendor.ref("");
    const textareaHeight = common_vendor.ref(32);
    const textareaRef = common_vendor.ref(null);
    const adjustHeight = async () => {
      await common_vendor.nextTick$1();
      const textarea = textareaRef.value;
      if (!textarea)
        return;
      textarea.style.height = MIN_HEIGHT + "px";
      const scrollHeight = textarea.scrollHeight;
      textareaHeight.value = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    };
    const sendMessage = () => {
      if (inputText.value.trim()) {
        emit("send", inputText.value);
        inputText.value = "";
        textareaHeight.value = MIN_HEIGHT;
      }
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          emit("image-selected", res.tempFilePaths[0]);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: textareaHeight.value + "px",
        b: common_vendor.o([($event) => inputText.value = $event.detail.value, adjustHeight]),
        c: inputText.value,
        d: common_vendor.p({
          name: "photo-o",
          size: "24px",
          color: "#666666"
        }),
        e: common_vendor.o(chooseImage),
        f: common_vendor.p({
          name: "guide-o",
          size: "24px",
          color: inputText.value.trim().length > 0 ? "#007AFF" : "#999999"
        }),
        g: inputText.value.trim().length > 0 ? 1 : "",
        h: common_vendor.o(sendMessage)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-89861275"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/InputField.js.map
