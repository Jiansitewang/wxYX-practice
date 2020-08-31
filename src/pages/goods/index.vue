<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" interval="3000" duration="1000">
        <blok>
          <swiper-item class="swiper-item">
            <img src="" alt="" class="slide-image">

          </swiper-item>
        </blok>
      </swiper>
    </div>
  </div>
</template>

<script>
import {get} from "../../utils/utils";

export default {
  data(){
    return{
      bannerPic: [],
      id: '',
      openid:''
    }
  },
  mounted () {
    this.openid = wx.getStorageSync('openId')
    this.goodsDetail()
  },
  methods:{
    async goodsDetail(){
      const data = await get('/goods/goodsDetail',{
        id: 1009024,
        openId: this.openid
      })
      console.log(data)
    }
  }
}
</script>

<style>
</style>
