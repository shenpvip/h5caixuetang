<script>
	const Notips = resolve => require(['../../components/common/no-tips.vue'], resolve);
	const Bottomloading = resolve => require(['../../components/common/bottomloading.vue'], resolve);
	import { Navbar, TabItem, TabContainer,Toast,MessageBox } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
		name:'teacher_info',
		data(){
			return{
				no_tips:false,
				teacherinfos:[],
				notips:'',
				teacher_id:'',
				page:1,
				isloading:true,        //loadind开关
				showloading:true,      //是否显示loading
				selected:'album',
				member_id:'',
				teacher_detail:{},
			}
		},
	    route:{
			data(transition){
				this.teacherinfos = [];
				this.page = 1;
				this.isloading = true;
				this.showloading = true;
				this.no_tips = false;
				this.selected = 'album';
				if(window.localStorage.memberinfo){
					this.member_id = tool.getStore("memberinfo").member_id;
				}
				if(this.$route.query.backData){
					this.teacher_id = this.$route.query.backData;
				}else{
					this.teacher_id = this.$route.query.teacher_id;
				}
				this.getTeacheralbum();
				this.scrollLoad();
				transition.next();
			}
	    },
		components:{
			Navbar,
			TabItem,
			Bottomloading,
			'no-tips':Notips 
		},
	 	watch:{
			selected:{
				handler(curVal){
					window.scrollTo(0, 0);
					this.page = 1;
					this.isloading = true;
					this.showloading = true;
					this.no_tips = false;
					this.teacherinfos = [];
					if(curVal === 'album'){
						this.getTeacheralbum();
					}else if(curVal === 'video'){
						this.getTeacherVideo();
					}
				},
　　　　　　　　deep:true
			},
	 	},
		methods:{
			/**
			 * [getTeacherinfo description]获取老师专辑
			 * @param  {[type]} page [description]
			 * @return {[type]}      [description]
			 */
			getTeacheralbum(page){
	 			page = page || 1;
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=teacher&a=teacher_info",
	 				data:{
	 					member_id:this.member_id,
	 					teacher_id:this.teacher_id,
	 					page:5,
	 					curpage:page,
	 					type:this.selected,
	 				}
	 			},(result)=>{
	 				if(result.code == 1){
	 					this.teacher_detail = result.data.tearInfo;
	 					if(result.data.teacherAlbum != null){
	 						let len = result.data.teacherAlbum.length;
	 						if(len < 5){
	 						    this.isloading = false;
	 						    this.showloading = false;
	 						}else{
	 						    this.isloading = true;
	 						    this.showloading = true;
	 						}
	 						if(page == 1){
	 							this.teacherinfos = result.data.teacherAlbum;
	 						}else{
	 							if(len){
	 								for(let i = 0; i < len; i++){
	 									this.teacherinfos.push(result.data.teacherAlbum[i]);
	 								}
	 							}
	 						}
	 					}else{
	 						this.isloading = false;
	 						this.showloading = false;
	 						if(page == 1){
	 							this.teacherinfos = [];
	 							this.no_tips = true;
	 							this.notips = 'no_video';
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
			 * [getTeacherVideo description]获取免费视频
			 * @param  {[type]} page [description]
			 * @return {[type]}      [description]
			 */
			getTeacherVideo(page){
				page = page || 1;
				tool.ajax({
					url:urlServer.ApiUrl + "c=teacher&a=teacher_info",
					data:{
						member_id:this.member_id,
						teacher_id:this.teacher_id,
						page:5,
						curpage:page,
						type:this.selected,
					}
				},(result)=>{
					if(result.code == 1){
						this.teacher_detail = result.data.tearInfo;
						if(result.data.teacherVideo != null){
							let len = result.data.teacherVideo.length;
							if(len <= 5){
							    this.isloading = false;
							    this.showloading = false;
							}else{
							    this.isloading = true;
							    this.showloading = true;
							}
							if(page == 1){
								this.teacherinfos = result.data.teacherVideo;
							}else{
								if(len){
									for(let i = 0; i < len; i++){
										this.teacherinfos.push(result.data.teacherVideo[i]);
									}
								}
							}
						}else{
							this.isloading = false;
							this.showloading = false;
							if(page == 1){
								this.teacherinfos = [];
								this.no_tips = true;
								this.notips = 'no_video';
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
			 * [concernBtn description]关注老师
			 * @param  {Boolean} is_concern [description]
			 * @return {[type]}             [description]
			 */
			concernBtn(is_concern){
				if(is_concern == 0){
					if(window.localStorage.memberinfo){
						if(is_concern == 0){
							tool.ajax({
								url:urlServer.ApiUrl + "c=member&a=concern_teacher",
								data:{
									member_id:tool.getStore("memberinfo").member_id,
									key:tool.getStore("memberinfo").key,
									teacher_id:this.teacher_id,
								}
							},(result)=>{
								if(result.code == 1){	
									Toast({message: result.data});
									this.teacher_detail.is_concern = 1;
								}else{
									Toast({message: result.message});
								}
							},(err)=>{
								console.log(err);
							});
						}
					}else{
						MessageBox.confirm('您还没有登录财学堂账号，是否立即登录？').then(action => {
						  	this.$route.router.go({name:'login',query:{backUrl:'teacherinfo',backData:this.teacher_id}});
						},(action =>{}));
					}
				}
			},
			/**
			 * [toPlay description]去播放页
			 * @param  {[type]} album_id [description]
			 * @param  {[type]} video_id [description]
			 * @return {[type]}          [description]
			 */
			toPlay(album_id,video_id){
				if(this.selected === 'album'){
					this.$route.router.go({name:'classinfo',query:{album_id:album_id}});
				}else if(this.selected === 'video'){
					this.$route.router.go({name:'classinfo',query:{video_id:video_id}});
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
							if(_self.selected === 'album'){
								_self.getTeacheralbum(++_self.page);
							}else if(_self.selected === 'video'){
								_self.getTeacherVideo(++_self.page);
							}
						}
					});
				});
	 		}
		},
	}
</script>
<template>
	<div class="class-transition-content">
		<div class="mui-content">
			<div class="teacher_content">
				<div class="top_banner">
					<img :src="teacher_detail.mobil_img">
					<a class="item_btn" @click.prevent="concernBtn(teacher_detail.is_concern)" :class="teacher_detail.is_concern == 1 ? 'active_btn' : '' " v-text="teacher_detail.is_concern == 1 ? '已关注' : '关注' "></a>
				</div>
				<div class="container">
					<div class="nav_box">
						<navbar class="teacher_nav" :selected.sync="selected">
						    <tab-item id="album">TA的精品专辑</tab-item>
						    <tab-item id="video">TA的精彩视频</tab-item>
						</navbar>
					</div>
					<div class="class_wrap" v-if="!no_tips">
						<div class="class_item" v-for="teacherinfo in teacherinfos">
							<a class="img_box" @click.prevent="toPlay(teacherinfo.course_album_id,teacherinfo.id)">
								<img :src="teacherinfo.img_url || teacherinfo.img" alt="">
								<i class="vip_tag" v-if="teacherinfo.membership_id == 2 || teacherinfo.is_vip == 1"></i>
							</a>
							<div class="class_info">
								<a @click.prevent="toPlay(teacherinfo.course_album_id,teacherinfo.id)">
									<h2 class="video_title" v-text="teacherinfo.title || teacherinfo.name"></h2>
								</a>
								<p class="video_intro word-break" v-text="selected === 'album' ? teacherinfo.description : teacherinfo.intro"></p>
								<div class="bottom">
									<span class="play_num" v-if="teacherinfo.play_count" v-text="teacherinfo.play_count"></span>
								</div>
							</div>	
						</div>
					</div>
					<!-- 无内容提示 -->
					<no-tips :notips = "notips" v-if="no_tips"></no-tips>
					<bottomloading :show="showloading"></bottomloading>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	@import "../../css/class_info.css";
</style>