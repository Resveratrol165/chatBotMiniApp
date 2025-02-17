"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "contactComponent",
  props: {
    bot: {
      type: Object,
      required: true
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClick = () => {
      emit("select", props.bot);
    };
    return (_ctx, _cache) => {
      return {
        a: __props.bot.config.avatar,
        b: __props.bot.config.name,
        c: common_vendor.t(__props.bot.config.name),
        d: common_vendor.t(__props.bot.config.description),
        e: common_vendor.o(handleClick)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8323ab56"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/contactComponent.js.map
