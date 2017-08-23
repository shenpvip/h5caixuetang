<script>
	const Bottomloading = resolve => require(['../../components/common/bottomloading.vue'], resolve);
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	import { Toast } from 'mint-ui';
	export default{
		name:'general_list',
		data(){
			return{
				page:1,
				isloading:true,         //loadind开关
				showloading:true,       //是否显示loading
				videoList:[],			//视频列表
				tureTagSort:[],			//标签
				teacherOrder:[],        //教师
				stockAgeOrder:[],       //股龄
				mark_info:'',           //标语
				tag_id:'',              //标签id
				stock_age:'',           //股龄id
				teacher_id:'',          //老师id
				currentSelected:'1',
				no_tips:false,
			}
		},
		components:{
			Bottomloading
		},
		route:{
			data(transition){
				this.page = 1;
				this.isloading = true;
				this.showloading = true;
				this.no_tips = false;
				this.tag_id = '';
				this.stock_age = '';
				this.teacher_id = '';
				this.currentSelected = '1',
				this.getListinfo();
				this.scrollLoad();
				transition.next();
			}
		},
	 	watch:{
			currentSelected:{
				handler(curVal){
					window.scrollTo(0, 0);
					this.page = 1;
					this.isloading = true;
					this.showloading = true;
					this.no_tips = false;
					this.videoList = [];
					this.getListinfo();
				},
　　　　　　　　deep:true
			},
	 	},
		methods:{
			/**
			 * [getListinfo description]获取通用列表
			 * @param  {[type]} page [description]
			 * @return {[type]}      [description]
			 */
			getListinfo(page){
				page = page || 1;
				tool.ajax({
					url:urlServer.ApiUrl + "c=generic_list&a=index",
					data:{
						tag:this.tag_id,
						stock_age:this.stock_age,
						teacher:this.teacher_id,
						page:page,
						order:this.currentSelected,
					}
				},(result)=>{
					if(result.code == 1){
						this.no_tips = false;
						this.tureTagSort = result.data.tureTagSort;
						this.teacherOrder = result.data.teacherOrder;
						this.stockAgeOrder = result.data.stockAgeOrder;
						this.mark_info = result.data.mark_info;
						let len = result.data.albums.length;
						if(len != 0){
							if(len < 5){
							    this.isloading = false;
							    this.showloading = false;
							}else{
							    this.isloading = true;
							    this.showloading = true;
							}
							if(page == 1){
								this.videoList = result.data.albums;
							}else{
								if(len){
									for(let i = 0; i < len; i++){
										this.videoList.push(result.data.albums[i]);
									}
								}
							}
						}else{
							this.isloading = false;
							this.showloading = false;
							if(page == 1){
								this.videoList = [];
								this.no_tips = true;
							}
						}
					}else{     //请求出错
						this.isloading = true;
						this.showloading = true;
						Toast({message: result.message});
					}
				},(err)=>{   //请求失败
					this.isloading = true;
					console.log(err);
				},()=>{    //发送请求之前
					this.isloading = false;
				});
			},
			/**
			 * [tagSelect description]标签
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			tagSelect(id){
				this.tag_id = id;
				tool.ajax({
					url:urlServer.ApiUrl + "c=generic_list&a=index",
					data:{
						tag:this.tag_id,
						stock_age:this.stock_age,
						teacher:this.teacher_id,
						page:1,
						order:this.currentSelected,
					}
				},(result)=>{
					if(result.code == 1){
						this.tureTagSort = result.data.tureTagSort;
					}else{
						Toast({message: result.message});
					}
				},(err)=>{   //请求失败
					console.log(err);
				});
			},
			/**
			 * [teacherSelect description]老师
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			teacherSelect(id){
				this.teacher_id = id;
			},
			/**
			 * [ageSelect description]股龄
			 * @param  {[type]} id [description]
			 * @return {[type]}    [description]
			 */
			ageSelect(id){
				this.stock_age = id;
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
							_self.getListinfo(++_self.page);
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
			<div class="general_list">
				<div class="search_wrap">
					<dl v-for="item in tureTagSort" class="clearfix">
						<dt class="pull-left">{{item.name}}：</dt>
						<div class="tag_select item_box pull-left">
							<dd v-for="info in item.data">
								<a @click="tagSelect(info.id)" :class="info.is_current == 1 ? 'active' : ''" v-text="info.name"></a>
							</dd>
						</div>
					</dl>
					<dl class="clearfix">
						<dt class="pull-left">名 师：</dt>
						<div class="item_box pull-left">
							<dd><a :class="teacher_id == '' ? 'active' : ''" @click="teacherSelect('')">全部</a></dd>
							<dd v-for="item in teacherOrder">
								<a @click="teacherSelect(item.id)" :class="teacher_id == item.id ? 'active' : ''" v-text="item.name"></a>
							</dd>
						</div>
					</dl>
					<dl class="clearfix">
						<dt class="pull-left">股 龄：</dt>
						<div class="item_box pull-left">
							<dd><a :class="stock_age == '' ? 'active' : ''" @click="ageSelect('')">全部</a></dd>
							<dd v-for="item in stockAgeOrder">
								<a @click="ageSelect(item.id)" :class="stock_age == item.id ? 'active' : ''" v-text="item.name"></a>
							</dd>
						</div>
					</dl>
					<dl class="confirm">
						<a class="searche_btn" @click.prevent="getListinfo()">确定</a>
					</dl>
				</div>
				<div class="class_list">
					<div class="common_title clearfix">
						<div class="tab_nav pull-left">
							<a :class="currentSelected == '1' ? 'active' : ''" @click.prevent="currentSelected = '1'">看最新</a>
							<a :class="currentSelected == '2' ? 'active' : ''" @click.prevent="currentSelected = '2'">看最热</a>
						</div>
						<div class="title_box pull-left">
							<span v-text="mark_info"></span>
						</div>
					</div>
					<div class="class_video" v-if="!no_tips">
						<a class="class_item" v-for="videoinfo in videoList" v-link="{name:'classinfo',query:{album_id:videoinfo.id}}">
							<div class="video_box">
								<img :src="videoinfo.img" class="connect">
								<div class="class_info clearfix">
									<p class="video_icon pull-right" v-text="videoinfo.play_count"></p>
									<p class="video_title pull-left" v-text="videoinfo.name"></p>
								</div>
								<span class="vip_video" v-if="videoinfo.is_vip == 1"></span>
							</div>
							<p class="class_title" v-text="videoinfo.intro"></p>
						</a>
					</div>
				</div>
				<p v-if="no_tips" class="tips">抱歉，没有找到相关的内容</br>财学堂建议您：更换筛选条件</p>
				<bottomloading :show="showloading"></bottomloading>
			</div>
		</div>
	</div>
</template>
<style scoped>
	@import "../../css/general_list.css";
</style>