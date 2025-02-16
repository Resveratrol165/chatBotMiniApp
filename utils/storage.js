/**
 * 封装 uni storage 相关操作
 */

/**
 * 异步设置存储数据
 * @param {string} key - 存储键名
 * @param {any} data - 要存储的数据
 * @returns {Promise<void>}
 */
export const setStorageData = (key, data) => {
  return new Promise((resolve, reject) => {
    uni.setStorage({
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

/**
 * 异步获取存储数据
 * @param {string} key - 存储键名
 * @returns {Promise<any>} 返回存储的数据
 */
export const getStorageData = (key) => {
  return new Promise((resolve, reject) => {
    uni.getStorage({
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

/**
 * 异步删除指定键的存储数据
 * @param {string} key - 要删除的存储键名
 * @returns {Promise<void>}
 */
export const removeStorageData = (key) => {
  return new Promise((resolve, reject) => {
    uni.removeStorage({
      key,
      success: () => {
        resolve();
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * 异步清除所有存储数据
 * @returns {Promise<void>}
 */
export const clearStorage = () => {
  return new Promise((resolve, reject) => {
    try {
      uni.clearStorage();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
