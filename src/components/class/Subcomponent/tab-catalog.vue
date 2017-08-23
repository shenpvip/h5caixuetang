<script>
	import {TabContainerItem,Cell,MessageBox,Toast} from 'mint-ui'; 
	import tool from 'js/tools';
	import urlServer from 'js/ajaxurl';
	export default{
	 	name:'tab-catalog',
		data(){
			return {
				class_icon:'../../images/vip_icon.png',
				album_id:'',
				activeColor:'#2883e0'
  			}
		},
	 	props:{
	 		intro:{
	 			type:String
	 		},
	 		classcatalogs:{
	 			type:Object
	 		},
	 		commentlists:{
	 			type:Array
	 		},
	 		albuminfo:{
	 			type:Object
	 		}
	 	},
	 	components:{
	 		TabContainerItem,
	 		Cell
	 	},
	 	methods:{
	 		/**
	 		 * [subscribe description]收藏
	 		 * @param  {[type]} data [description]
	 		 * @return {[type]}      [description]
	 		 */
	 		subscribeBtn(is_subscribe,album_id,video_id){
	 			if(window.localStorage.memberinfo){
	 				if(this.$route.query.album_id){
	 					this.album_id = this.$route.query.album_id;
	 				}else if(this.$route.query.toData){
	 					this.album_id = this.$route.query.toData;
	 				}
	 				if(is_subscribe == 0){
	 					tool.ajax({
	 						url:urlServer.ApiUrl + "c=member&a=subscribe_album",
	 						data:{
	 							member_id:tool.getStore("memberinfo").member_id,
	 							key:tool.getStore("memberinfo").key,
	 							album_id:this.album_id,
	 						}
	 					},(result)=>{
	 						if(result.code == 1){	
	 							Toast({message: result.data});
	 							this.classcatalogs.is_subscribe = 1;
	 						}else{
	 							Toast({message: result.message});
	 						}
	 					},(err)=>{
	 						console.log(err);
	 					});
	 				}
	 			}else{
	 				//未登录
	 				MessageBox.confirm('您还没有登录财学堂账号，需要登录后才能学习！').then(action => {
	 				  	this.$route.router.go({name:'login',query:{backUrl:'classinfo',backData:video_id,toData:album_id}});
	 				},(action =>{}));
	 			}
	 		},
	 		toplay(membership_id,video_id){
	 			this.$dispatch('toplay',[membership_id,video_id]);
	 		}
	 	}
	 }
</script>

<template>
<tab-container-item>
	<div class="play_list">
		<div class="play_item">
			<div class="class_detail">
				<div class="class_txt clearfix">
					<a class="item_btn pull-right" :class="{'active_btn':classcatalogs.is_subscribe == 1}" v-text="classcatalogs.is_subscribe == 0 ? '收藏' : '已收藏' " @click.prevent="subscribeBtn(classcatalogs.is_subscribe,classcatalogs.album_id,classcatalogs.play_id)"></a>
					<div class="detail_info">共{{albuminfo.count}}课时</div>
				</div>
				<div class="video_list">
					<div class="list_item" v-for="classcatalog in classcatalogs.chapter">
						<p class="title_bar" v-if="classcatalog.name">	
							<span v-text="classcatalog.name_order"></span>
							<span v-text="classcatalog.name"></span>
						</p>
						<cell href="javascript:;" v-for="item in classcatalog.video" :class="{'free_video':item.membership_id < 2,'playon':item.id == classcatalogs.play_id}" @click.prevent="toplay(item.membership_id,item.id)" :title="item.title_order" :value= "item.title">
							<img class="vip_icon" slot="icon" :src="class_icon" v-if="item.membership_id > 1">
						</cell>
					</div>
				</div>
			</div>
		</div>
	</div>
</tab-container-item>
</template>