"use strict";
const common_vendor = require("../common/vendor.js");
const setStorageData = (key, data) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.setStorage({
      key,
      data,
      success: () => {
        resolve();
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
const getStorageData = (key) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.getStorage({
      key,
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};
exports.getStorageData = getStorageData;
exports.setStorageData = setStorageData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/storage.js.map
