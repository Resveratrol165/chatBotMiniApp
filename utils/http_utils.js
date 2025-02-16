// 封装基础请求方法
const baseRequest = (url, method, data = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        reject(err)
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  })
}

// 封装GET请求
export const request = (url, data = {}, header = {}) => {
  return baseRequest(url, 'GET', data, header)
}

// 封装POST请求
export const post = (url, data = {}, header = {}) => {
  return baseRequest(url, 'POST', data, header)
}
