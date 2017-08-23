<script>
	import tool from 'base/tools';
	import { Toast,MessageBox } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	export default{
		name:'res_item',
		data(){
			return{
				show:false,
				member_id:'',
				key:'',
			}
		},
		ready(){
			this.init();
		},
		props:{
			reslist:{
				type:Object
			},
			type:{
				type:String
			}
		},
		methods:{
			toggle(event){
				let target = this.$els.panel;
				let box = this.$els.box;
				let btn = this.$els.btn;
				this.show = !this.show;
				if(this.show){
					target.style.maxHeight = box.offsetHeight + 'px';
				}else{
					target.style.maxHeight = 3.15 + 'rem';
				}
			},
			init(){
				let target = this.$els.panel;
				let box = this.$els.box;
				let btn = this.$els.btn;
				if(box.offsetHeight > target.offsetHeight){
					btn.style.display = 'block';
				}
			},
			/**
			 * [concernBtn description]关注按钮
			 * @param  {Boolean} is_concern [description]
			 * @param  {[type]}  id         [description]
			 * @return {[type]}             [description]
			 */
			concernBtn(is_concern,id,event){
				if(window.localStorage.memberinfo){
					this.member_id = tool.getStore("memberinfo").member_id;
					this.key = tool.getStore("memberinfo").key;
				}
				if(this.type === 'teacherlist'){      //关注
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
									this.reslist.is_concern = 1;
								}else{
									Toast({message: result.message});
								}
							},(err)=>{
								console.log(err);
							});
						}
					}else{
						MessageBox.confirm('您还没有登录财学堂账号，是否立即登录？').then(action => {
						  	this.$route.router.go({name:'login',query:{backUrl:'teacherList'}});
						},(action =>{}));
					}
				}else{   //取消关注
					let target = event.target;
					tool.ajax({
						url:urlServer.ApiUrl + "c=member&a=cancelMyConcern",
						data:{
							member_id:this.member_id,
							key:this.key,
							teacher_id:id,
						}
					},(result)=>{
						if(result.code == 1){	
							$(target).closest('.res_wrap').remove();
							// location.reload(); 
						}else{
							Toast({message: result.message});
						}
					},(err)=>{
						console.log(err);
					});
				}
			},
			/**
			 * [toTeacherInfo description]判断老师是否下线
			 * @param  {[type]} id     [description]
			 * @param  {[type]} status [description]
			 * @return {[type]}        [description]
			 */
			toTeacherInfo(id,status){
				if(status == 0){
					Toast({message: "抱歉名师已下线！"});
				}else{
					this.$route.router.go({name:'teacherinfo',query:{teacher_id:id}});
				}
			}
		}
	}
</script>
<template>
	<div class="res_wrap">
		<div class="res_item">
			<div class="teacher_info">
				<a @click.prevent="toTeacherInfo(reslist.id,reslist.status)"><img class="teacher_img" :src="reslist.img"></a>
				<div class="info_box">
					<a @click.prevent="toTeacherInfo(reslist.id,reslist.status)"><h2 v-text="reslist.name"></h2></a>
					<p v-text="reslist.Intro"></p>
				</div>
				<a class="item_btn" v-if="type == 'teacherlist' " :class="reslist.is_concern == 1 ? 'active_btn' : '' " v-text="reslist.is_concern == 1 ? '已关注' : '关注' " @click.prevent="concernBtn(reslist.is_concern,reslist.id)"></a>

				<a class="item_btn" v-else :class="reslist.is_concern == 1 ? 'center_btn' : '' " v-text="reslist.is_concern == 1 ? '取消关注' : '关注' " @click.prevent="concernBtn(reslist.is_concern,reslist.id,$event)"></a>
			</div>
			<div class="intro_box" v-el:panel transition="toggle">
				<div v-el:box v-html="reslist.text" class="word-break"></div>
			</div>
			<div class="more_box clearfix">
				<span v-el:btn class="more_btn pull-right" :class="{'up':show}" @click="toggle($event)"></span>
			</div>
		</div>
		<div class="class_list" v-if="reslist.album">
			<div class="res_title clearfix">
				TA的精品专辑 <span v-text="reslist.count">5</span>
			</div>
			<div class="class_video">
				<div class="class_item" v-for="item in reslist.album">
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
	</div>
</template>

<style lang="sass">
.toggle-transition{
	-webkit-transition: height .3s ease;
	transition: height .3s ease;
	overflow: hidden;
}
</style>