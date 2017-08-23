<script>
	const Tabclass = resolve => require(['./Subcomponent/tab_class.vue'], resolve);
	const Taborder = resolve => require(['./Subcomponent/tab-order.vue'], resolve);
	const Tabcollect = resolve => require(['./Subcomponent/tab_collect.vue'], resolve);
	const Tabres = resolve => require(['./Subcomponent/tab_res.vue'], resolve);
	const Notips = resolve => require(['../../components/common/no-tips.vue'], resolve);
	const Bottomloading = resolve => require(['../../components/common/bottomloading.vue'], resolve);

	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	import { Toast } from 'mint-ui';
	
	export default{
	 	name:'user_center',
	 	data(){
	 		return{
	 			no_tips:false,                                              //无内容提示开关
	 			currentView:'my_class',                                     //当前显示组件
	 			page:1,                                                     //分页页数
	 			userIcon:'../../images/default.png',                        //用户头像
	 			notips:'',                                                  //无内容提示
	 			isloading:true,                                             //loadind开关
	 			showloading: true,                                          //是否显示loading
	 			member_id:'',
	 			key:'',
	 			vipDate:null,                                               //会员到期时间
	 			playList:[],                                                //我的观看
	 			myRes:[],                                                   //我的关注
	 			orderinfo:[],                                               //我的订单
	 			orderNum:null,                                              //待支付订单数
	 		} 
	 	},
  	    route:{
  			data(transition){
  				this.vipDate = null;
  				this.member_id = tool.getStore("memberinfo").member_id;
  				this.key = tool.getStore("memberinfo").key;
  				this.page = 1;
  				this.no_tips = false;
  				if(this.$route.query.tabselect){
  					this.currentView = this.$route.query.tabselect;
  				}else{
  					this.currentView = 'my_class';
  				}
  				if(this.currentView === 'my_order'){
  					this.getOrder();
  				}else if(this.currentView === 'my_class'){
  					this.getPlayList();
  				}else if(this.currentView === 'my_res'){
  					this.getMyRes();
  				}else if(this.currentView === 'my_collect'){
  					this.getMySubscribe();
  				}
  				this.getVipInfo();
  				this.getOrderNum();
  				this.scrollLoad();
  				transition.next();
  			}
  	    },
	 	components:{
	 		'my_class':Tabclass,
	 		'my_order':Taborder,
	 		'my_res':Tabres,
	 		'my_collect':Tabcollect,
	 		'no-tips':Notips,
	 		Bottomloading
	 	},
	 	watch:{
			currentView:{
				handler(curVal){
					window.scrollTo(0, 0);
					this.page = 1;
					this.isloading = true;
					this.showloading = true;
					this.no_tips = false;
					this.playList = [];
					if(curVal === 'my_order'){
						this.$route.router.replace({name:'usercenter',query:{tabselect:'my_order'}});
						// this.getOrder();
					}else if(curVal === 'my_class'){
						this.$route.router.replace({name:'usercenter',query:{tabselect:'my_class'}});
						// this.getPlayList();
					}else if(curVal === 'my_res'){
						this.$route.router.replace({name:'usercenter',query:{tabselect:'my_res'}});
						// this.getMyRes();
					}else if(curVal === 'my_collect'){
						this.$route.router.replace({name:'usercenter',query:{tabselect:'my_collect'}});
						// this.getMySubscribe();
					}
				},
　　　　　　　　deep:true
			},
	 	},
	 	methods:{
	 		/**
	 		 * [getVipInfo description]获取vip信息
	 		 * @return {[type]} [description]
	 		 */
	 		getVipInfo(){
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=vip&a=get_vip_info",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	   //vip
	 					this.vipDate = result.data;
	 				}else if(result.code == -1){   //不是vip
	 					this.vipDate = null;
	 				}else if(result.code == -2){     //会员过期
	 					this.vipDate = -2;
	 				}
	 				this.userIcon = result.header_img;
	 			},(err)=>{
	 				console.log(err);
	 			});
	 		},
	 		/**
	 		 * [getOrderNum description]获取用户未支付订单数量
	 		 * @return {[type]} [description]
	 		 */
	 		getOrderNum(){
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=order&a=getunpay",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	
	 					this.orderNum = result.data;
	 				}else{
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				console.log(err);
	 			});
	 		},
	 		/**
	 		 * [getPlayList description]获取我的观看列表
	 		 * @param  {[type]} page [description]
	 		 * @return {[type]}      [description]
	 		 */
	 		getPlayList(page){
	 			page = page || 1;
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=play_recording&a=get_h5_play_recording",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key,
	 					per:5,
	 					page:page
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	
						let len = result.data.length;
				        if(len < 5){
				            this.isloading = false;
				            this.showloading = false;
				        }else{
				            this.isloading = true;
				            this.showloading = true;
				        }
						if(page == 1){
							this.playList = result.data;
						}else{
							if(len){
								for(let i = 0; i < len; i++){
									this.playList.push(result.data[i]);
								}
							}
						}
	 				}else if(result.code == -1){
	 					if(page == 1){
	 						this.playList = [];
	 						this.isloading = false;
	 						this.showloading = false;
	 						this.no_tips = true;
	 						this.notips = 'no_play';
	 					}else{
	 						this.isloading = false;
	 						this.showloading = false;
	 					}
	 				}else{
	 					this.isloading = true;
	 					this.showloading = true;
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				this.isloading = true;
	 				console.log(err);
	 			},()=>{
	 				this.isloading = false;
	 			});
	 		},
	 		/**
	 		 * [getMySubscribe description]获取我的收藏
	 		 * @return {[type]} [description]
	 		 */
	 		getMySubscribe(page){
	 			page = page || 1;
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=member&a=mySubscribe",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key,
	 					per:5,
	 					page:page
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	
 						let len = result.data.length;
				        if(len < 5){
				            this.isloading = false;
				            this.showloading = false;
				        }else{
				            this.isloading = true;
				            this.showloading = true;
				        }
						if(page == 1){
							this.playList = result.data;
						}else{
							if(len){
								for(let i = 0; i < len; i++){
									this.playList.push(result.data[i]);
								}
							}
						}
	 				}else if(result.code == -1){
	 					if(page == 1){
	 						this.playList = [];
	 						this.isloading = false;
	 						this.showloading = false;
	 						this.no_tips = true;
	 						this.notips = 'no_collect';
	 					}else{
	 						this.isloading = false;
	 						this.showloading = false;
	 					}
	 				}else{
	 					this.isloading = true;
	 					this.showloading = true;
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				this.isloading = true;
	 				console.log(err);
	 			},()=>{
	 				this.isloading = false;
	 			});
	 		},
	 		/**
	 		 * [getPlayList description]获取我的关注
	 		 * @param  {[type]} page [description]
	 		 * @return {[type]}      [description]
	 		 */
	 		getMyRes(page){
	 			page = page || 1;
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=member&a=myConcern",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key,
	 					per:5,
	 					page:page
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	
						let len = result.data.length;
				        if(len < 5){
				            this.isloading = false;
				            this.showloading = false;
				        }else{
				            this.isloading = true;
				            this.showloading = true;
				        }
						if(page == 1){
							this.myRes = result.data;
						}else{
							if(len){
								for(let i = 0; i < len; i++){
									this.myRes.push(result.data[i]);
								}
							}
						}
	 				}else if(result.code == -1){    //无数据的时候
	 					if(page == 1){
	 						this.myRes = [];
	 						this.isloading = false;
	 						this.showloading = false;
	 						this.no_tips = true;
	 						this.notips = 'no_res';
	 					}else{
	 						this.isloading = false;
	 						this.showloading = false;
	 					}
	 				}else{
	 					this.isloading = true;
	 					this.showloading = true;
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				this.isloading = true;
	 				console.log(err);
	 			},()=>{
	 				this.isloading = false;
	 			});
	 		},
	 		/**
	 		 * [tabEvent description]获取全部订单
	 		 * @param  {[type]} event [description]
	 		 * @return {[type]}       [description]
	 		 */
	 		getOrder(page){
	 			page = page || 1;
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=order&a=get_order_list",
	 				data:{
	 					member_id:this.member_id,
	 					key:this.key,
	 					per:5,
	 					page:page
	 				}
	 			},(result)=>{
	 				if(result.code == 1){
	 					if(result.data.data != null){
	 						let len = result.data.data.length;
					        if(len < 5){
					            this.isloading = false;
					            this.showloading = false;
					        }else{
					            this.isloading = true;
					            this.showloading = true;
					        }
							if(page == 1){
								this.orderinfo = result.data.data;
							}else{
								if(len){
									for(let i = 0; i < len; i++){
										this.orderinfo.push(result.data.data[i]);
									}
								}
							}
	 					}else{
	 						if(page == 1){
	 							this.orderinfo = [];
	 							this.isloading = false;
	 							this.showloading = false;
	 							this.no_tips = true;
	 							this.notips = 'no_order';
	 						}else{
	 							this.isloading = false;
	 							this.showloading = false;
	 						}
	 					}
	 				}else{
	 					this.isloading = true;
	 					this.showloading = true;
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				this.isloading = true;
	 				console.log(err);
	 			},()=>{
	 				this.isloading = false;
	 			});
	 		},
	 		/**
	 		 * [scrollLoad description]上拉加载更多
	 		 * @return {[type]} [description]
	 		 */
	 		scrollLoad(){
	 			let _self = this;
	 			require.ensure([], function () {
					let scroll = require('base/scroll');
					new scroll({},function(ret){
						if(ret.scrollTop && ret.isToBottom && _self.isloading){
							if(_self.currentView === 'my_class'){
								_self.getPlayList(++_self.page);
							}else if(_self.currentView === 'my_order'){
								_self.getOrder(++_self.page);
							}else if(_self.currentView === 'my_collect'){
								_self.getMySubscribe(++_self.page);
							}else if(_self.currentView === 'my_res'){
								_self.getMyRes(++_self.page);
							}
						}
					});
				});
	 		}
	 	}
	 }
</script>

<template>
<div class="class-transition-content">
	<div class="mui-content">
		<div class="user_center">
			<div class="center_top">
				<div class="center_box">
					<a class="set_btn" v-link="{name:'set'}">设置</a>
					<div class="user_info">
						<div class="user_icon">
							<span class="vip_icon" v-if="vipDate && vipDate != -2"></span>
							<img :src="userIcon" onerror="this.src = '../../images/default.png'">
						</div>
						<div class="vip_info">
							<a class="purchase_tips" v-link="{name:'paynew',query:{backName:'index'}}" v-if="vipDate == null || vipDate == -2">点击查看VIP详情</a>
							<p v-if="vipDate && vipDate != -2">VIP到期时间：<span v-text="vipDate"></span></p>
						</div>
					</div>
					<a class="vip_btn" v-link="{name:'paynew',query:{backName:'index'}}" v-if="!vipDate"></a>
					<a class="res_vip" v-link="{name:'paynew',query:{backName:'index'}}" v-if="vipDate">续费</a>
				</div>
				<div class="menu_nav">
					<a :class="currentView=='my_class'?'active':'' " @click.prevent="currentView = 'my_class'">我的观看</a>
					<a :class="currentView=='my_collect'?'active':'' " @click.prevent="currentView = 'my_collect'">我的收藏</a>
					<a :class="currentView=='my_res'?'active':'' " @click.prevent="currentView = 'my_res'">我的关注</a>
					<a :class="currentView=='my_order'?'active':'' " class="my_order" @click.prevent="currentView = 'my_order'">我的订单<span class="count_order" v-if="orderNum" v-text="orderNum"></span></a>
				</div>
			</div>
			<div class="content_wrap">
				<component :is="currentView" :playlist="playList" :myres="myRes" :orderinfos="orderinfo" keep-alive></component>
				<!-- 无内容提示 -->
				<no-tips :notips = "notips" v-if="no_tips"></no-tips>
				<bottomloading :show="showloading"></bottomloading>
			</div>
		</div>
	</div>
</div>
</template>
<style scoped>
	@import "../../css/user_center.css";	
</style>