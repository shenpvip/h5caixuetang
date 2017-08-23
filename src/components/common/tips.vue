<script>
	import { Button } from 'mint-ui';
	 export default{
	 	name:'tips',
	 	data(){
	 		return{
	 			num:3,   						//倒计时时间
	 			showIcon:true,	  				//显示图标
	 			showTime:true,    				//倒计时提示开关
	 			tipsTxt:'登录成功',             //提示文字
	 			backTxt:'财学堂',               //倒计时文字
	 			btnTxt:'立即返回财学堂',	    //按钮文字
	 			goLink:'index',                 //跳转地址
	 			paySuccess:false,
	 			isflag:true,
	 			video_id:'',
	 			album_id:'',
	 			timer:null,
	 			loginout:0,
	 		}
	 	},
 	    route:{
			data(transition){
				//初始化信息
				this.num = 3;
				this.showIcon = true;
				this.showTime = true;
				this.paySuccess = false;
				this.isflag = true;
				this.goLink = 'index';
				this.tipsTxt = '登录成功';
				this.backTxt = '财学堂';
				this.btnTxt  = '立即返回财学堂';
				this.tipsTxt = this.$route.query.tipsTxt;
				this.loginout = 0;
				//当来路页为修改密码页时
				// if(transition.from.name === "passport"){
				// 	this.backTxt = this.$route.query.backTxt;
				// 	this.btnTxt = this.$route.query.btnTxt;
				// 	this.goLink = this.$route.query.goLink;
				// }
				// if(transition.from.name === "usercenter"){
				// 	this.showIcon = false;
				// }
				if(this.$route.query.tipType){
					if(this.$route.query.backName){
						this.goLink = this.$route.query.backName;
					}
					this.paySuccess = true;
					this.backTxt = '财学堂';
					this.video_id = this.$route.query.video_id;
					this.album_id = this.$route.query.album_id;
				}
				if(this.$route.query.loginout){
					this.loginout = this.$route.query.loginout;
				}
				clearInterval(this.timer);
				this.goback();
				transition.next();
			},
	 	    deactivate(transition){
				clearInterval(this.timer);
				transition.next();
			}
 	    },
	 	components:{
	 		Button
	 	},
	 	methods:{
	 		/**
	 		 * [goback description]自动返回
	 		 * @return {[type]} [description]
	 		 */
	 		goback(){
	 			if(this.showTime){
		 	        this.timer = setInterval(()=> {
			 	        this.num = this.num-1;
			 	        if(this.num == 0){
			 	        	if(this.isflag){   //执行按钮跳转后就关闭默认倒计时的跳转
			 	        		this.$route.router.replace({name:'index',query:{loginout:this.loginout}}); 
			 	        		clearInterval(this.timer);
			 	        	}else{
			 	        		clearInterval(this.timer);
			 	        	}
			 	        }
			 	    },1000);
	 			}
	 		},
	 		/**
	 		 * [btnback description]按钮返回
	 		 * @return {[type]} [description]
	 		 */
	 		btnback(){
	 			this.isflag = false;
	 			this.$route.router.replace({name:this.goLink,query:{loginout:this.loginout}});
	 		},
	 		/**
	 		 * [toIndex description]返回首页
	 		 * @return {[type]} [description]
	 		 */
	 		// toIndex(){
	 		// 	this.isflag = false;
	 		// 	this.$route.router.go({name:'index'});
	 		// },
	 		/**
	 		 * [toOrder description]查看订单
	 		 * @return {[type]} [description]
	 		 */
	 		toOrder(){
	 			this.isflag = false;
	 			this.$route.router.replace({name:'usercenter',query:{tabselect:'my_order'}});
	 		},
	 		/**
	 		 * [toStudy description]立即学习
	 		 * @return {[type]} [description]
	 		 */
	 		toStudy(){
	 			this.isflag = false;
	 			if(this.goLink === 'index'){
	 				this.$route.router.replace({name:this.goLink});
	 			}else{
	 				this.$route.router.replace({name:this.goLink,query:{video_id:this.video_id,album_id:this.album_id}});
	 			}
	 		}
	 	}
	 }
</script>

<template>
<div class="class-transition-content">
	<div class="mui-content tips-wrap">
		<div class="tips-content">
			<i class="tips_icon" v-show="showIcon"></i>
			<div class="count_info">
				<p class="tips_txt" v-text="tipsTxt"></p>
				<p v-show="showTime"><span class="count" v-text="num"></span>秒钟自动返回<span v-text="backTxt"></span></p>
			</div>
			<button type="primary" v-if="!paySuccess" size="large" @click="btnback">{{btnTxt}}</button>
		</div>
		<div class="btnBox" v-if="paySuccess">
			<!-- <a class="goindex" href="javascript:void(0);" @click.prevent="toIndex">返回首页</a> -->
			<a class="goOrder" href="javascript:void(0);" @click.prevent="toOrder">查看订单</a>
			<a class="goStudy" href="javascript:void(0);" @click.prevent="toStudy">立即学习</a>
		</div>
	</div>
</div>
</template>