<template>
  <div>
    <h2>分类</h2>
    <!-- <back-top @click.native="backClick" v-show="isShowBackTop"/> -->
  </div>
</template>

<script>
import BackTop from 'components/content/backTop/BackTop'
import {backTopMixin} from '@/common/mixin.js'
  export default{
  components: { BackTop },
    name:"Category",
    data() {
      return {
        scroll:null
      }
    },
    // mixins:[backTopMixin],

  }
</script>

<style scoped>

</style>
