<script>
	import { Navbar, TabItem, TabContainer, Popup, MessageBox, Toast,Indicator } from 'mint-ui';
	import {videoPlayer} from 'vue-video-player';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	const tabIntroduce = resolve => require(['./Subcomponent/tab-introduce'], resolve);
	const tabCatalog = resolve => require(['./Subcomponent/tab-catalog'], resolve);
	const tabComment = resolve => require(['./Subcomponent/tab-comment'], resolve);
	const Bottomloading = resolve => require(['../../components/common/bottomloading.vue'], resolve);
	const $ = require('jquery');
	export default{
		name:'class_info',
		data(){
			return{
				commentBtn:false,      //购买和评论按钮开关
				selected:'tab-introduce',
				currentView: 'tab-introduce',     //tab切换
				popupVisible:false,   //输入框弹起开关
				commentTxt:'',        //输入框内容
				fontNum:'0',	      //输入框字数
				goodsid:'',     //商品ID
				isloading:false,        //loadind开关
				showloading:false,        //是否显示loading
				goodsDetail:{},         //老师详情
				album_info:{},          //专辑信息	
				video_info:{},          //视频信息
				classcatalog:{},        //课程表
				commentlist:[],         //评论列表
				member_vip:false,     //悬浮购买按钮开关
				member_id:'',
				key:'',
				video_id:'',
				album_id:'',
				page:1,
				noComment:false,
				isplay:null,
				videoOptions: {
		          	source: [
		          		{
				            type: "video/mp4",
				            src: "",
				            label: "原画",
				            res: 1
			          	},{
				            type: "video/mp4",
				            src: "",
				            label: "高清",
				            res: 2
			          	},{
				            type: "video/mp4",
				            src: "",
				            label: "流畅",
				            res: 3
			          	}
		          	],
		          	poster: "../../images/videojs-logo.jpg",
		          	defaultSrcReId: 2,
		          	height: '100%',
		          	autoplay: false,
		          	preload:true,
		          	start:0
		        },
		        playNum:true,          //播放次数
		        recommendInfo:{},    //推荐视频
		        tag_id_arr:'',       //推荐视频需要的id
		        item_id:'',          //专辑或视频id
		        item_type:'',        //专辑1，视频2
		        playTime:0,          //继续播放时间
		        total_page:'',
		        show_popup:false,
		        is_login:false,
		        playUrl:'',
		        player_mask:true,
		        album_tag_list:false,
		        album_new_list:false,
			}
		},
		route:{
			data(transition){
				Indicator.open({
  				    text: '加载中...',
  				    spinnerType: 'fading-circle'
  				});
				this.video_id = '';
				this.album_id = '';
				this.member_id = '';
				this.key = '';
				this.album_tag_list = false;
		        this.album_new_list = false;
				this.show_popup = false;
				this.is_login = false;
				this.player_mask = true;
				this.selected = 'tab-introduce';
				this.currentView = 'tab-introduce';
				this.playTime = 0;
				this.playNum = true;
				this.playUrl = window.location.href;
				if(this.$route.query.playTime){
					this.playTime = this.$route.query.playTime;  //播放时间
				}
				if(this.$route.query.video_id){
					this.video_id = this.$route.query.video_id;
				}else if(this.$route.query.backData){
					this.video_id = this.$route.query.backData;
				}
				if(this.$route.query.album_id){
					this.album_id = this.$route.query.album_id;
				}else if(this.$route.query.toData){
					this.album_id = this.$route.query.toData;
				}
				if(window.localStorage.memberinfo){
					this.member_id = tool.getStore("memberinfo").member_id;
					this.key = tool.getStore("memberinfo").key;
					this.is_login = true;
				}
				this.page = 1;
				this.noComment = false;
				this.goodsDetail = {};
				this.classcatalog = {};
				this.commentlist = [];
				this.popupVisible = false;
				this.commentBtn = false;
				this.commentTxt = '';
				this.fontNum = '0';
				this.member_vip = false;
				if(this.$route.query.tabselect === "tab-catalog"){
					this.selected = 'tab-catalog';
					this.currentView = 'tab-catalog';
					this.getClassinfo();
				}
				// if(this.$route.query.tabselect === "tab-catalog"){
				// 	this.selected = 'tab-catalog';
				// 	this.currentView = 'tab-catalog';
				// 	this.getClassinfo();
				// }else if(this.$route.query.tabselect === "tab-comment"){
				// 	this.selected = 'tab-comment';
				// 	this.currentView = 'tab-comment';
				// }else if(this.$route.query.tabselect === "tab-introduce"){
				// 	this.selected = 'tab-introduce';
				// 	this.currentView = 'tab-introduce';
				// }
				this.getIntro(function(){
					this.getVideoSource();                         //获取视频播放源
					this.getRecommend();                          //获取相关推荐
				});
				this.getVipInfo();
				transition.next();
			},
		},
		components:{
			Navbar,
			TabItem,
			TabContainer,
			Popup,
			Bottomloading,
			'tab-introduce' : tabIntroduce,
			'tab-catalog' : tabCatalog,
			'tab-comment' : tabComment,
			'video-player':videoPlayer,
		},
		watch:{
			/**
			 * [selected description]监听tab切换
			 * @type {Object}
			 */
			selected:{
				handler(curVal){
					window.scrollTo(0, 0);
					this.currentView = curVal;
					if(curVal === 'tab-introduce'){
						this.selected = 'tab-introduce';
						this.currentView = 'tab-introduce';
						this.commentBtn = false;
						this.isloading = false;        
						this.showloading = false;   
						this.noComment = false;
						this.getIntro();
					}else if(curVal === 'tab-catalog'){
						this.selected = 'tab-catalog';
						this.currentView = 'tab-catalog';
						this.commentBtn = false;
						this.isloading = false;        
						this.showloading = false;
						this.noComment = false;
						this.getClassinfo();
					}else if(curVal === 'tab-comment'){
						this.selected = 'tab-comment';
						this.currentView = 'tab-comment';
						this.commentBtn = true;
						this.page = 1;
						this.isloading = true;        
						this.showloading = true;
						this.getComment();    
						this.scrollLoad();    
					}
				},
　　　　　　　　deep:true
			},
			/**
			 * [popupVisible description]监听弹出层
			 * @type {Object}
			 */
			popupVisible:{
				handler(curVal){
					if(curVal == false){
						this.commentTxt = '';
						this.fontNum = '0';
					}
				},
　　　　　　　　deep:true
			},
		},
		methods:{
			/**
			 * [getVideoInfo description]获取视频源
			 * @return {[type]} [description]
			 */
			getVideoSource(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=video&a=check_single_video",
					data:{
						video_id:this.video_id,
						member_id:this.member_id,
						key:this.key,
					}
				},(result)=>{
					if(result.code == 1){
						if(window.localStorage.memberinfo){
							this.player_mask = false;
							this.videoOptions.source = result.data.source;
							// this.videoOptions.poster = result.data.poster;
							if(this.playTime){
								// this.videoOptions.autoplay = true;
								let second = String(this.playTime).split(":");
								if(second.length == 3){
									this.videoOptions.start = parseInt(second[0]*60*60) + parseInt(second[1]*60) + parseInt(second[2]);
								}else if(second.length == 2){
									this.videoOptions.start = parseInt(second[0]*60) + parseInt(second[1]);
								}else{
									this.videoOptions.start = parseInt(second[0]);
								}
								// console.log(this.videoOptions.autoplay);
							}else{
								this.videoOptions.start = 0;
								// this.videoOptions.autoplay = false;
								// console.log(this.videoOptions.autoplay);
							}
						}else{
							MessageBox.confirm('您还没有登录财学堂账号，需要登录后才能学习！').then(action => {
							  	this.$route.router.go({name:'login',query:{backUrl:'classinfo',backData:this.video_id,toData:this.album_id}});
							},(action =>{}));
						}
					}else if(result.code == -1){
						if(this.video_info.membership_id > 1){   //当前播放的是vip视频
							this.show_popup = true;
						}else{
							//未登录
							MessageBox.confirm('您还没有登录财学堂账号，需要登录后才能学习！').then(action => {
							  	this.$route.router.go({name:'login',query:{backUrl:'classinfo',backData:this.video_id,toData:this.album_id}});
							},(action =>{}));
						}
					}else if(result.code == -2){
						this.show_popup = true;
						// MessageBox.confirm('您没有开通财学堂VIP会员，是否立即开通？').then(action => {
						//   	this.$route.router.go({name:'paynew'});
						// },(action =>{}));
					}else{
						Toast({message: result.message});
					}
				},(err)=>{   //请求失败
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
			},
			/**
			 * [getIntro description]获取视频简介
			 * @return {[type]} [description]
			 */
			getIntro(callback){
				tool.ajax({
					url:urlServer.ApiUrl + "c=course_album&a=info",
					data:{
						member_id:this.member_id,
						key:this.key,
						video_id:this.video_id,
						album_id:this.album_id,
					}
				},(result)=>{
					if(result.code == 1){
						if(this.video_id == ''){
							this.video_id = result.data.video_id;  //获取到专辑中正在播放的视频id
						}
						if(this.album_id){
							this.album_info = result.data.album_info;  //获取专辑信息
						}
						this.tag_id_arr = result.data.tag_id_arr;   //专辑推荐所需要的参数
						this.video_info = result.data.video_info;
						this.goodsDetail = result.data.teacher_info;   //老师信息
						typeof callback === "function" && callback.call(this);
					}else if(result.code == -1){ 
						MessageBox.alert("抱歉视频已下架！").then(action => {
							window.history.go(-1);
						});
					}else{
						Toast({message: result.message});
					}
				},(err)=>{   //请求失败
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
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
							member_id:this.member_id,
							key:this.key
						}
					},(result)=>{
						if(result.code == 1){	
							this.member_vip = true;
						}else if(result.code == -1){
							this.member_vip = false;
							$(".price_wrap").text("亲~开通VIP即可任意学财呦！");
							$(".purchase_btn").text("立即开通");
							$(".pop_txt").html("尊敬的财主</br>开通VIP财学会员全网战法免费看");
							$(".vip_txt").text("开通VIP财学会员");
						}else if(result.code == -2){
							this.member_vip = false;
							$(".price_wrap").text("亲~续费VIP即可任意学财呦！");
							$(".purchase_btn").text("立即续费");
							$(".pop_txt").html("尊敬的财主</br>续费VIP财学会员全网战法免费看");
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
			 * [getRecommend description]获取相关推荐
			 * @return {[type]} [description]
			 */
			getRecommend(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=course_album&a=album_list",
					data:{
						album_id:this.album_id,
						tag_id_arr:this.tag_id_arr
					}
				},(result)=>{
					if(result.code == 1){	
						if(result.data.album_tag_list.length != 0){
							this.album_tag_list = true;
						}
						if(result.data.album_new_list.length != 0){
							this.album_new_list = true;
						}
						this.recommendInfo = result.data;
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
			 * [commentUp description]点击我要论股
			 * @return {[type]} [description]
			 */
			commentUp(){
				this.commentTxt = '';
				this.fontNum = 0;
				if(window.localStorage.memberinfo){
					if(this.album_info.is_vip > 0 || this.video_info.membership_id > 1){   //当前播放的是vip专辑或者视频
						if(this.member_vip){    //已登录并且开通vip
							this.popupVisible = true;
							this.wordCount();
						}else{   //已登录但未开通vip
							this.show_popup = true;
							// MessageBox.confirm('请先开通财学堂VIP会员，是否立即开通？').then(action => {
							//   	this.$route.router.go({name:'paynew',query:{video_id:video_id,album_id:album_id,backName:'classinfo'}});
							// });
						}
					}else{   //免费视频
						this.popupVisible = true;
						this.wordCount();
					}
				}else{
					//未登录
					MessageBox.confirm('您还没有登录财学堂账号，需要登录后才能评论！').then(action => {
					  	this.$route.router.go({name:'login',query:{backUrl:'classinfo',backData:this.video_id,toData:this.album_id}});
					});
				}
			},
			/**
			 * [subComment description]发表评论
			 * @return {[type]} [description]
			 */
			subComment(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=album_comments&a=submit_comments",
					data:{
						item_id:this.item_id,
						member_id:this.member_id,
						key:this.key,
						item_type:this.item_type,
						content:this.commentTxt,
					}
				},(result)=>{
					if(result.code == 1){	
						this.popupVisible = false;
						Toast({message: "提交成功，财学堂将在随后发布您的评论!"});
					}else{
						this.popupVisible = false;
						Toast({message: result.message});
					}
				},(err)=>{
					this.popupVisible = false;
					console.log(err);
				});
			},
			/**
			 * [wordCount description]统计剩余字符
			 * @return {[type]} [description]
			 */
			wordCount(){
				require.ensure([],()=> {
					let maxLength = require('base/maxlength');
					$('#counterBox').maxLength(160,function(num){
					    $('#counter').text(160-num);
					});	
				});
			},
			/**
			 * [word description]输入框粘贴事件
			 * @return {[type]} [description]
			 */
			word(){
				setTimeout(function(){
				    $('#counterBox').trigger('change');
				},100)
			},
			/**
			 * [getClassinfo description]获取课程目录
			 * @return {[type]} [description]
			 */
			getClassinfo(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=course_album&a=video_list",
					data:{
						member_id : this.member_id,
						key : this.key,
						album_id:this.album_id,
					}
				},(result)=>{
					if(result.code == 1){	
						// this.classcatalog = result.data;
						let data = result.data;
						if(this.video_id){
							data.play_id = this.video_id;
						}
						if(this.album_id){
							data.album_id = this.album_id;
						}
						this.classcatalog = data;
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [getComment description]获取评论列表
			 * @return {[type]} [description]
			 */
			getComment(page){
				if(this.album_id){
					this.item_id = this.album_id;
					this.item_type = 1;
				}else{
					this.item_id = this.video_id;
					this.item_type = 2;
				}
				page = page || 1;
				if(this.total_page && page > this.total_page){
					return;
				}
				tool.ajax({
					url:urlServer.ApiUrl + "c=album_comments&a=list",
					data:{
						item_id:this.item_id,
						item_type:this.item_type,
					}
				},(result)=>{
					if(result.code == 1){	
						this.total_page = result.data.total_page;
						if(result.data != 0){
							let len = result.data.albumComments.length;
					        if(len <= 5){
					            this.isloading = false;
					            this.showloading = false;
					        }else{
					            this.isloading = true;
					            this.showloading = true;
					        }
					        if(page == 1){
					        	this.commentlist = result.data.albumComments;
					        }else{
					        	if(len){
					        		for(let i = 0; i < len; i++){
					        			this.commentlist.push(result.data.albumComments[i]);
					        		}
					        	}
					        }
						}else{
							this.isloading = false;
							this.showloading = false;
							if(page == 1){
								this.commentlist = [];
								this.noComment = true;
							}else{
								this.noComment = false;
							}
						}
					}else{
						this.isloading = true;
						this.showloading = true;
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
					this.isloading = true;
				},()=>{    //发送请求之前
					this.isloading = false;
				});
			},
			/**
			 * [playerStateChanged description]监听播放器状态
			 * @param  {[type]} playerCurrentState [description]
			 * @return {[type]}                    [description]
			 */
			playerStateChanged(playerCurrentState) {
				if(playerCurrentState.currentTime > 0){
					let playRecord = '';
					if(this.album_id){
						playRecord = 4 + '@' + this.member_id + '@' + this.album_id + '@' + this.video_id + '@' + playerCurrentState.currentTime ;
						tool.setStore("playRecord",playRecord);
					}else{
						playRecord = 3 + '@' + this.member_id + '@' + this.album_id + '@' + this.video_id + '@' + playerCurrentState.currentTime;
						tool.setStore("playRecord",playRecord);
					}
					if(this.playNum){
						this.playNum = false;
						this.setPlayNum();
					}
				}
			},
			/**
			 * [setPlayNum description]保存播放次数
			 */
			setPlayNum(){
				if(this.video_id){
					tool.ajax({
						url:urlServer.ApiUrl + "c=globals&a=add_video_times",
						data:{
							video_id:this.video_id,
							album_id:this.album_id,
						}
					},(result)=>{
						if(result.code == 1){	
							console.log('保存播放次数成功');
						}else{
							Toast({message: result.message});
						}
					},(err)=>{
						console.log(err);
					});
				}
			},
			/**
			 * [concernBtn description]关注按钮
			 * @param  {Boolean} is_concern [description]
			 * @param  {[type]}  id         [description]
			 * @return {[type]}             [description]
			 */
			concernBtn(is_concern,id){
				if(window.localStorage.memberinfo){
					if(is_concern == 0){
						tool.ajax({
							url:urlServer.ApiUrl + "c=member&a=concern_teacher",
							data:{
								member_id:this.member_id,
								key:this.key,
								teacher_id:id,
							}
						},(result)=>{
							if(result.code == 1){	
								Toast({message: result.data});
								this.goodsDetail.is_concern = 1;
							}else{
								Toast({message: result.message});
							}
						},(err)=>{
							console.log(err);
						});
					}
				}else{
					MessageBox.confirm('您还没有登录财学堂账号，是否立即登录？').then(action => {
					  	this.$route.router.go({name:'login',query:{backUrl:'classinfo',backData:this.video_id,toData:this.album_id}});
					});
				}
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
							_self.getComment(++_self.page);
						}
					});
				});
	 		}
		},
		events:{
			/**
			 * 点击具体某一集
			 */
			"toplay"(data){
				if(data[0] > 1){     //是否是vip视频
					if(this.member_vip){
						this.video_id = data[1];
						this.getClassinfo();
						this.getVideoSource();
						this.$route.router.replace({name:'classinfo',query:{tabselect:'tab-catalog',video_id:data[1],album_id:this.album_id}});
					}else{
						this.show_popup = true;
						// MessageBox.confirm('您没有开通财学堂VIP会员，是否立即开通？').then(action => {
						//   	this.$route.router.go({name:'paynew',query:{video_id:video_id,album_id:album_id,backName:'classinfo',playUrl:this.playUrl}});
						// },(action =>{}));
					}	
				}else{        //免费视频
					this.$route.router.replace({name:'classinfo',query:{tabselect:'tab-catalog',video_id:data[1],album_id:this.album_id}});
					this.video_id = data[1];
					this.getClassinfo();
					this.getVideoSource();	
				}
			},
		}
	}
</script>
<template>
	<div class="class-transition-content">
		<div class="mui-content">
			<div class="agreementMask" v-show="show_popup">
			    <div class="mask"></div>
			    <div class="word">
			       <p class="pop_txt">尊敬的财主</br>开通VIP财学会员全网战法免费看</p>
			       <a class="vip_btn" v-link="{name:'paynew',query:{video_id:video_id,album_id:album_id,backName:'classinfo',playUrl:playUrl}}"><span class="vip_txt">开通VIP财学会员</span></a>
			       <a class="login_txt" v-link="{name:'login',query:{backUrl:'classinfo',backData:video_id,toData:album_id}}" v-if="!is_login">已是VIP，请登录</a>
			       <a class="popup_btn" @click="show_popup = false">关闭</a>
			    </div>
			</div>
			<div class="class_info">
				<div class="player_mask" v-if="player_mask"></div>
				<!-- 视频播放区域 start -->
				<div class="player-video-box">
					<video-player :options="videoOptions" @player-state-changed="playerStateChanged"></video-player>
				</div>
				<!-- // 视频播放区域 end -->
				<div class="class_box">
					<div class="teacher_info">
						<a v-link="{name:'teacherinfo',query:{teacher_id:goodsDetail.id}}">
							<img class="teacher_img" :src="goodsDetail.img" alt="">
							<div class="txt_box">
								<h2 v-text="goodsDetail.name"></h2>
								<p v-text="goodsDetail.Intro"></p>
							</div>
						</a>
						<a class="item_btn" :class="goodsDetail.is_concern == 1 ? 'active_btn' : ''" v-text="goodsDetail.is_concern == 1 ? '已关注' : '关注' " @click.prevent="concernBtn(goodsDetail.is_concern,goodsDetail.id)"></a>
					</div>
					<p class="class_title" v-text="album_id == '' ? video_info.title : album_info.name"></p>
				</div>
				<div class="class_detail">
					<navbar class="nav_bar" :selected.sync="selected">
						<tab-item id="tab-introduce">简介</tab-item>
						<tab-item id="tab-catalog" v-if="album_id">课程表</tab-item>
						<tab-item id="tab-comment">坐而论股</tab-item>
					</navbar>
					<tab-container class="tab_container">
						<component :is="currentView" :intro="album_id == '' ? video_info.intro : album_info.description" :classcatalogs="classcatalog" :albuminfo="album_info" :commentlists="commentlist" keep-alive></component>
						
						<!-- 相关推荐 start -->
						<div class="class_list" v-show="selected != 'tab-comment' && album_tag_list">
							<div class="common_title clearfix">
								<a class="more_btn pull-right" v-link="{name:'generalList'}">更多</a>
								<div class="title_box pull-left">
									<h2>相关财学</h2>
									<!-- <span v-text="recommendInfo.refresh_text1"></span> -->
								</div>
							</div>
							<div class="class_video">
								<div class="class_item" v-for="item in recommendInfo.album_tag_list">
									<a v-link="{name:'classinfo',query:{album_id:item.id}}">
										<div class="video_box">
											<img :src="item.img" class="connect">
											<div class="class_info clearfix">
												<p class="video_icon pull-right" v-text="item.play_count"></p>
												<p class="video_title pull-left" v-text="item.name"></p>
											</div>
											<span class="vip_video" v-if="item.is_vip == 1"></span>
										</div>
										<p class="class_title" v-text="item.description"></p>
									</a>
								</div>
							</div>
						</div>
						<div class="class_list" v-show="selected != 'tab-comment' && album_new_list">
							<div class="common_title clearfix">
								<a class="more_btn pull-right" v-link="{name:'generalList'}">更多</a>
								<div class="title_box pull-left">
									<h2>金融财学随时看</h2>
									<!-- <span v-text="recommendInfo.refresh_text2"></span> -->
								</div>
							</div>
							<div class="class_video">
								<div class="class_item" v-for="item in recommendInfo.album_new_list">
									<a v-link="{name:'classinfo',query:{album_id:item.id}}">
										<div class="video_box">
											<img :src="item.img" class="connect">
											<div class="class_info clearfix">
												<p class="video_icon pull-right" v-text="item.play_count"></p>
												<p class="video_title pull-left" v-text="item.name"></p>
											</div>
											<span class="vip_video" v-if="item.is_vip == 1"></span>
										</div>
										<p class="class_title" v-text="item.description"></p>
									</a>
								</div>
							</div>
						</div>
						<!-- 相关推荐 end -->

						<!-- 无评论提示 start-->
						<p v-if="noComment" class="no-comment">暂无评论，赶紧发表评论抢沙发吧！</p>
						<!-- 无评论提示 end-->

						<bottomloading :show="showloading"></bottomloading>
						
						<!-- 购买按钮 start-->
						<div class="purchase_box" v-if="!member_vip && selected != 'tab-comment'">
							<div class="btn_box">
								<div class="price_wrap">亲~开通VIP即可任意学财哟！</div>
								<button class="purchase_btn" v-link="{name:'paynew',query:{video_id:video_id,album_id:album_id,backName:'classinfo',playUrl:playUrl}}">立即开通</button>
							</div>
						</div>
						<!-- 购买按钮 end-->

						<!-- 输入框 start -->
						<popup :visible.sync="popupVisible" position="bottom">
							<div class="inputBox">
								<!-- <Field placeholder="大神请论股..." type="textarea"></Field> -->
								<textarea name="" id="counterBox" placeholder="大神请论股..." maxlength="160" @onpaste="word()" autocomplete="off" v-model="commentTxt"></textarea>
								<p class="clearfix"><span class="count_txt pull-right"><strong id="counter" v-text="fontNum"></strong>/160</span></p>
								<button class="report_btn" @click="subComment">发表</button>
							</div>
						</popup>
						<!-- 输入框 start -->

						<!-- 评论按钮 start -->
						<button class="comment_btn" v-show="commentBtn" @click="commentUp">我要论股</button>
						<!-- 评论按钮 end -->
					</tab-container>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	@import "../../css/class_info.css";
</style>