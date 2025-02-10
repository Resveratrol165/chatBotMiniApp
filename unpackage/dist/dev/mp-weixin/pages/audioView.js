"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "audioView",
  setup(__props) {
    const isRecording = common_vendor.ref(false);
    const isPending = common_vendor.ref(false);
    const recorderManager = common_vendor.index.getRecorderManager();
    const innerAudioContext = common_vendor.index.createInnerAudioContext();
    const circleScale = common_vendor.ref(1);
    const circleBorderWidth = common_vendor.ref(4);
    const buttonText = common_vendor.computed(() => {
      if (isRecording.value)
        return "松开发送";
      if (isPending.value)
        return "处理中...";
      return "按住说话";
    });
    const startRecording = () => {
      if (innerAudioContext.paused === false) {
        innerAudioContext.stop();
      }
      isPending.value = false;
      isRecording.value = true;
      circleScale.value = 1;
      circleBorderWidth.value = 4;
      recorderManager.start({
        duration: 6e4,
        sampleRate: 16e3,
        numberOfChannels: 1,
        encodeBitRate: 96e3,
        format: "mp3"
      });
      startVolumeAnimation();
    };
    const stopRecording = () => {
      if (!isRecording.value)
        return;
      isRecording.value = false;
      isPending.value = true;
      recorderManager.stop();
      stopVolumeAnimation();
    };
    const cancelRecording = () => {
      isRecording.value = false;
      isPending.value = false;
      recorderManager.stop();
      stopVolumeAnimation();
    };
    const startVolumeAnimation = () => {
      recorderManager.onFrameRecorded((res) => {
        const volume = Math.random();
        circleScale.value = 1 + volume * 0.5;
        circleBorderWidth.value = 4 + volume * 16;
      });
    };
    const stopVolumeAnimation = () => {
      circleScale.value = 1;
      circleBorderWidth.value = 4;
    };
    recorderManager.onStop(async (res) => {
      if (!isPending.value)
        return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 3e3));
        common_vendor.index.__f__("log", "at pages/audioView.vue:124", "录音文件路径：", res.tempFilePath);
        isPending.value = false;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/audioView.vue:129", "处理录音失败：", error);
        common_vendor.index.showToast({
          title: "处理失败，请重试",
          icon: "none"
        });
        isPending.value = false;
      }
    });
    recorderManager.onError((error) => {
      common_vendor.index.__f__("error", "at pages/audioView.vue:140", "录音错误：", error);
      common_vendor.index.showToast({
        title: "录音出错，请重试",
        icon: "none"
      });
      if (error.errMsg.includes("auth deny")) {
        common_vendor.index.showModal({
          title: "权限问题",
          content: "录音权限被拒绝，请前往设置中开启录音权限",
          showCancel: false,
          confirmText: "去设置",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.openSetting({
                success: (settingdata) => {
                  common_vendor.index.__f__("log", "at pages/audioView.vue:158", "用户已进入设置页面，当前权限设置：", settingdata.authSetting);
                  if (settingdata.authSetting["scope.record"]) {
                    common_vendor.index.__f__("log", "at pages/audioView.vue:160", "录音权限已开启");
                  } else {
                    common_vendor.index.__f__("log", "at pages/audioView.vue:162", "录音权限仍未开启");
                  }
                }
              });
            }
          }
        });
      }
      isRecording.value = false;
      isPending.value = false;
      stopVolumeAnimation();
    });
    return (_ctx, _cache) => {
      return {
        a: `scale(${circleScale.value})`,
        b: `${circleBorderWidth.value}rpx`,
        c: isRecording.value ? 1 : "",
        d: isPending.value ? 1 : "",
        e: common_vendor.t(buttonText.value),
        f: isRecording.value ? 1 : "",
        g: isPending.value ? 1 : "",
        h: common_vendor.o(startRecording),
        i: common_vendor.o(stopRecording),
        j: common_vendor.o(cancelRecording)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5e4b948b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/audioView.js.map
