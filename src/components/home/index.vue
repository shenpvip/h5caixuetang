<script>
	import { Swipe, SwipeItem, Toast, MessageBox, Indicator } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	const agreementmask = resolve => require(['../common/agreementMask'], resolve);
	const videoitem = resolve => require(['../common/video_item'], resolve);
	export default{
		name:'index',
		data(){
			return{
				banners:[],
				partners:[],
				StockDatas:[],
				memberinfo:{},
				goodsLists:[],
				layerBool:false,
				layer:{
					poupTitle:'',
					poupContent:'',
					btnTxt:''
				},
				isFollow:true,
				type:'',   //预览用
				timer:null,
				member_vip:true,
				loginout:0,
			}
		},
  	    route:{
  			data(transition){
  				clearInterval(this.timer);
  				this.loginout = 0;
  				this.layerBool = false;
  				this.isFollow = true;
  				this.member_vip = true;
  				this.type = this.$route.query.type;   //预览用
  				if(this.$route.query.loginout){
  					this.loginout = this.$route.query.loginout;
  				}
  				Indicator.open({
  				    text: '加载中...',
  				    spinnerType: 'fading-circle'
  				});
  				if(this.is_weixn()){
  					if(this.$route.query.open_id){
						tool.setStore("open_id",this.$route.query.open_id);
						console.log("获取openid成功！");
					}
					if(window.localStorage.open_id){
						if(!this.loginout){
							this.getMemberinfo();
							this.checkBind();
						}
						this.getStockData();
						this.getBanner();
						this.getGoods();
						this.getVipInfo();
					}else{
			 			window.location.href = urlServer.ApiUrl + 'c=wxauth&a=index';
					}
  				}else{
  					this.isFollow = false;
  					this.getStockData();
					this.getBanner();
					this.getGoods();
					this.getVipInfo();
  				}
  				transition.next();
  			},
  			deactivate(transition){
				clearInterval(this.timer);
				transition.next();
			}
  	    },
		components:{
			Swipe,
			SwipeItem,
			videoitem,
			agreementmask
		},
		methods: {
			/**
			 * [is_weixn description]检查当前是否在微信浏览器内
			 * @return {Boolean} [description]
			 */
			is_weixn(){
				let ua = navigator.userAgent.toLowerCase(); 
				if(ua.match(/MicroMessenger/i)=="micromessenger") { 
					return true; 
				} else { 
					return false; 
				} 
			},
			/**
			 * [getVipInfo description]获取vip信息
			 * @return {[type]} [description]
			 */
			getVipInfo(){
				if(window.localStorage.memberinfo){
					tool.ajax({
						url:urlServer.ApiUrl + "c=vip&a=get_vip_info",
						data:{
							member_id:tool.getStore("memberinfo").member_id,
							key:tool.getStore("memberinfo").key
						}
					},(result)=>{
						if(result.code == 1){	
							this.member_vip = false;
						}else if(result.code == -1){
							this.member_vip = true;
							$(".vip_txt").text("开通VIP财学会员");
						}else if(result.code == -2){
							this.member_vip = true;
							$(".vip_txt").text("续费VIP财学会员");
						}
					},(err)=>{
						console.log(err);
					},()=>{  //请求之前

		            },()=>{//请求完成
		            	Indicator.close();
		            });
				}
			},
			/**
			 * [getBanner description]获取banner图
			 * @return {[type]} [description]
			 */
			getBanner(){
	 			tool.ajax({url:urlServer.ApiUrl + "c=index&a=carousel"},(result)=>{
					if(result.code == 1){	
						this.banners = [];
						for(let i =0;i<5;i++){
							this.banners.push(result.data.advdata[i]);
						}
						// this.banners = result.data.advdata;
						this.partners = result.data.cooperation;
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
			},
			/**
			 * [getData description]获取大盘数据
			 * @return {[type]} [description]
			 */
			getData(){
				tool.ajax({url:urlServer.ApiUrl + "c=index&a=getStockMessages"},(result)=>{
					if(result.code == 1){
						this.StockDatas = [];
						for(let i =0;i<3;i++){
							this.StockDatas.push(result.data.data[i]);
						}
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
			},
			/**
			 * [getStockData description]获取大盘数据
			 * @return {[type]} [description]
			 */
			getStockData(){
				clearInterval(this.timer);
				this.getData();
				this.timer = setInterval(()=>{
					this.getData();
				},4500);
			},
	 		/**
	 		 * [getGoods description]获取商品列表
	 		 * @return {[type]} [description]
	 		 */
	 		getGoods(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=column&a=column",
					data:{
						type:this.type
					}
				},(result)=>{
					if(result.code == 1){	
						this.goodsLists = result.data;
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
	 		},
	 		/**
	 		 * [toClass description]进入我的财学之前判断是否登录
	 		 * @return {[type]} [description]
	 		 */
	 		toCenter(){
				if(window.localStorage.memberinfo){
					this.$route.router.go({name:'usercenter'});
				}else{
					MessageBox.confirm('您还没有登录财学堂账号，是否立即登录？').then(action => {
					  	this.$route.router.go({name:'login',query:{backUrl:'usercenter'}});
					},(action =>{}));
				}
	 		},
	 		/**
	 		 * [checkBind description]检查绑定
	 		 * @return {[type]} [description]
	 		 */
	 		checkBind(){
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=index&a=get_tip_info",
	 				data:{
	 					open_id:tool.getStore('open_id'),
	 				}
	 			},(result)=>{
	 				if(result.code == 1){	
	 					if(result.data.is_bind == 0 && result.data.bind_toast){
	 						Toast(result.data.bind_toast);
	 					}
	 				}else{
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				console.log(err);
	 			});
	 		},
	 		/**
	 		 * [getOpenid description]绑定微信
	 		 * @return {[type]} [description]
	 		 */
	 		getMemberinfo(){
	 			console.log()
	 			tool.ajax({
 					url:urlServer.ApiUrl + "c=index&a=get_toast_info",
 					data:{
 						open_id:tool.getStore("open_id"),
 					}
 				},(result)=>{
 					if(result.code == 1){	
 						if(result.data.is_bind == 1 || result.data.update_localstorage == 1){
 							if(result.data.member_id && result.data.key){
 								this.memberinfo = {
 									member_id : result.data.member_id,
 									key : result.data.key,
 									member_mobile : result.data.member_mobile,
 									member_name : result.data.member_name,
 								};
 								tool.setStore("memberinfo",this.memberinfo);
 							}
 						}
 					}else{
 						Toast({message: result.message});
 					}
 				},(err)=>{
 					console.log(err);
 				});
	 		},
	 		/**
	 		 * [showCode description]显示关注二维码
	 		 * @return {[type]} [description]
	 		 */
	 		showCode(){
	 			this.layerBool = true;
	 			this.layer.poupTitle = false;
	 			this.layer.poupContent = '<img src="../../images/gzh_code.jpg"/><p>长按上面的二维码图案，关注我们</p>';
	 			this.layer.btnTxt = false;
	 		},
	 		/**
	 		 * [checkFollow description]检测用户是否已经关注公众号
	 		 * @return {[type]} [description]
	 		 */
	 		checkFollow(){
	 			if(window.localStorage.memberinfo){
	 				tool.ajax({
	 					url:urlServer.ApiUrl + "c=member_wechat&a=checkIsFollow",
	 					data:{
	 						member_id:tool.getStore("memberinfo").member_id,
	 						key:tool.getStore("memberinfo").key,
	 						open_id:tool.getStore('open_id'),
	 					}
	 				},(result)=>{
	 					if(result.code == 1){	
	 						if(result.data.status == 1){
	 							this.isFollow = false;
	 						}else{
	 							this.isFollow = true;
	 						}
	 					}else{
	 						Toast({message: result.message});
	 					}
	 				},(err)=>{
	 					console.log(err);
	 				});
	 			}else{
	 				return;
	 			}
	 		}
		},
		events:{
			/**
			 * 点击遮罩关闭弹窗
			 */
			"hideLayer"(data){
				this.layerBool = data;
			}
		}
	}
</script>

<template>
<div class="class-transition-content">
	<div class="mui-content">
		<div class="home_page">
			<agreementmask :layer = "layer" transition="fade" v-show="layerBool"></agreementmask>
			<div class="top_banner">
				<Swipe :auto="4000" :continuous='true'>
					<swipe-item v-for="banner in banners">
						<a class="banner_img" :href="banner.is_jump == 1 ? banner.url : 'javascript:;'" :style="{backgroundImage: 'url(' + banner.img + ')'}"></a>
					</swipe-item>
				</Swipe>
			</div>
			<div class="home_title"></div>
			<div class="nav_box">
				<a class="all_class" v-link="{name:'generalList'}">
					<i class="class_icon"></i>
					<p>全部财学</p>
				</a>
				<a class="all_teacher" v-link="{name:'teacherList'}">
					<i class="teacher_icon"></i>
					<p>全部名师</p>
				</a>
				<a class="my_class" @click.prevent="toCenter()">
					<i class="my_class_icon"></i>
					<p>我的财学</p>
				</a>
			</div>
			<div class="index_num">
				<div class="index_item" v-for="StockData in StockDatas">
					<p class="title" v-text="StockData.SNAM"></p>
					<p class="data" :class="{'data_down':StockData.CRAT > 0 ? false : true}" v-text="StockData.NPRI"></p>
					<p class="txt" :class="{'green':StockData.CRAT > 0 ? false : true}"><span v-text="StockData.CVAL"></span>（<span v-text="StockData.CRAT"></span>%）</p>
				</div>
			</div>
			<a class="vip_btn" v-link="{name:'paynew',query:{backName:'index'}}" v-if="member_vip"><span class="vip_txt">开通VIP财学会员</span></a>
			<div class="class_list" v-for="goods in goodsLists">
				<div class="common_title clearfix">
					<a class="more_btn pull-right" v-link="{name:'generalList'}">更多</a>
					<div class="title_box pull-left">
						<h2 v-text="goods.name"></h2>
						<!-- <span v-text="goods.adv_text"></span> -->
					</div>
				</div>
				<div class="class_video">
					<videoitem v-for="videoinfo in goods.column_item" :videoinfo="videoinfo"></videoitem>
				</div>
			</div>
			<div class="partner_wrap">
				<h2 class="center_title">战略合作伙伴</h2>
				<div class="partner_list clearfix">
					<div class="item_list pull-left" v-for="item in partners">
						<img :src="item.img" :alt="item.name">
					</div>
				</div>
			</div>
			<div class="footer">
				版权所有  财学堂教育文化传媒成都有限公司</br>
				蜀ICP备17007606号-1</br>
				Copyright 2004-2017 财学堂（caixuetang.cn）</br>
				ALL rights reserved</br>
				广播电视节目制作经营许可证编号：（川）字第00491号</br>
			</div>
			<div class="follow" @click="showCode" v-if="isFollow"></div>
		</div>
	</div>
</div>
</template>
<style scoped>
	@import "../../css/index.css";
</style>