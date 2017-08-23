<template>
    <div class="agreementMask">
        <div class="mask" @click="popHiden"></div>
        <div class="word">
           <h2 v-if="layer.poupTitle" v-text="layer.poupTitle"></h2>
           <div class="wordContent" v-html="layer.poupContent">
           </div>
           <a v-if="layer.btnTxt" class="wordbtn" href="javascript:void(0);"  @click="mask" v-text="layer.btnTxt"></a>
        </div>
    </div>
</template>

<script>
    export default {
      methods:{
          mask(){    //点击遮罩层
              this.$dispatch('protocolLayer',false);
          },
          popHiden(){     //点击遮罩层或者取消按钮
              this.$dispatch('hideLayer',false);
          }
      },
      props:{
        layer:{
          type:Object
        }
      }
    }
</script>