"use strict";
const common_vendor = require("../common/vendor.js");
const model_bot_model = require("../model/bot_model.js");
if (!Array) {
  const _component_van_image = common_vendor.resolveComponent("van-image");
  _component_van_image();
}
const _sfc_main = {
  __name: "addBotView",
  setup(__props) {
    const formData = common_vendor.ref({
      name: "",
      avatar: "",
      description: "",
      greeting: "你好！我是你的AI助手，有什么我可以帮你的吗？",
      persona: "我是一个友好、专业的AI助手",
      background: ""
    });
    const isFormValid = common_vendor.computed(() => {
      return formData.value.name && formData.value.description && formData.value.greeting && formData.value.persona;
    });
    const focusedField = common_vendor.ref("");
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          formData.value.avatar = res.tempFilePaths[0];
        }
      });
    };
    const handleSave = async () => {
      if (!isFormValid.value)
        return;
      try {
        await model_bot_model.newBot(formData.value);
        common_vendor.index.navigateBack();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/addBotView.vue:157", "创建机器人失败:", error);
        common_vendor.index.showToast({
          title: "创建失败",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: !isFormValid.value ? 1 : "",
        b: common_vendor.o(handleSave),
        c: common_vendor.p({
          round: true,
          width: "120rpx",
          height: "120rpx",
          src: formData.value.avatar || "/static/default_avatar.png"
        }),
        d: common_vendor.o(chooseImage),
        e: common_vendor.o(($event) => focusedField.value = "name"),
        f: common_vendor.o(($event) => focusedField.value = ""),
        g: formData.value.name,
        h: common_vendor.o(($event) => formData.value.name = $event.detail.value),
        i: common_vendor.t(formData.value.name.length),
        j: focusedField.value === "name" ? 1 : "",
        k: formData.value.name ? 1 : "",
        l: common_vendor.o(($event) => focusedField.value = "description"),
        m: common_vendor.o(($event) => focusedField.value = ""),
        n: formData.value.description,
        o: common_vendor.o(($event) => formData.value.description = $event.detail.value),
        p: common_vendor.t(formData.value.description.length),
        q: focusedField.value === "description" ? 1 : "",
        r: formData.value.description ? 1 : "",
        s: common_vendor.o(($event) => focusedField.value = "greeting"),
        t: common_vendor.o(($event) => focusedField.value = ""),
        v: formData.value.greeting,
        w: common_vendor.o(($event) => formData.value.greeting = $event.detail.value),
        x: common_vendor.t(formData.value.greeting.length),
        y: focusedField.value === "greeting" ? 1 : "",
        z: formData.value.greeting ? 1 : "",
        A: common_vendor.o(($event) => focusedField.value = "persona"),
        B: common_vendor.o(($event) => focusedField.value = ""),
        C: formData.value.persona,
        D: common_vendor.o(($event) => formData.value.persona = $event.detail.value),
        E: common_vendor.t(formData.value.persona.length),
        F: focusedField.value === "persona" ? 1 : "",
        G: formData.value.persona ? 1 : "",
        H: common_vendor.o(($event) => focusedField.value = "background"),
        I: common_vendor.o(($event) => focusedField.value = ""),
        J: formData.value.background,
        K: common_vendor.o(($event) => formData.value.background = $event.detail.value),
        L: common_vendor.t(formData.value.background.length),
        M: focusedField.value === "background" ? 1 : "",
        N: formData.value.background ? 1 : ""
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/addBotView.js.map
