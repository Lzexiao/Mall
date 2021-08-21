<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name:"Scroll",
  props:{
    probeType:{
      type:Number,
      default:0
    },
    pullUpLoad:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      scroll:null
    }
  },
  mounted() {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper,{
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad,
    })
    //2.监听滚动的位置
     this.scroll.on('scroll',(position) =>{
      // console.log(position);
      this.$emit('srcoll',position)
    //3.监听上拉事件
    this.scroll.on('pullingUp',() =>{
      // console.log('上啦加载更多');
      this.$emit('pullingUp')
    })
  })
  },
  methods: {
    //回到顶部封装
    scrollTo(x,y,time=300){
      this.scroll.scrollTo(x,y,time);
    },
    //再一次上拉加载更多封装
    finishPullUp(){
      this.scroll.finishPullUp();
    }
  },
}
</script>

<style scoped>

</style>