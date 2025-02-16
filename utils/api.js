import { request, post } from '@/utils/http_utils'

// 基础URL配置
const BASE_URL = 'EXAMPLE_BASE_URL'

// API方法封装 一些示例后续可以调整改动
export default {
  // 首页相关接口
  home: {
    // 获取轮播图数据
    getSwiperData() {
      return request(`${BASE_URL}/home/swiperdata`)
    },
    // 获取导航数据
    getNavData() {
      return request(`${BASE_URL}/home/catitems`)
    },
    // 获取楼层数据
    getFloorData() {
      return request(`${BASE_URL}/home/floordata`)
    }
  },

  // 商品相关接口
  goods: {
    // 获取商品列表
    getGoodsList(params) {
      return request(`${BASE_URL}/goods/search`, params)
    },
    // 获取商品详情
    getGoodsDetail(goods_id) {
      return request(`${BASE_URL}/goods/detail`, { goods_id })
    }
  },

  // 分类相关接口
  categories: {
    // 获取分类数据
    getCategoryList() {
      return request(`${BASE_URL}/categories`)
    }
  }
}