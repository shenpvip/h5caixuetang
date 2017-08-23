<script>
	import tool from 'base/tools';
	import { Toast } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	export default{
		name:'viewItem',
		props:{
			playinfo:{
				type:Object
			}
		},
		methods:{
			/**
			 * [subscribe description]取消收藏
			 * @param  {Boolean} is_subscribe [description]
			 * @param  {[type]}  album_id     [description]
			 * @return {[type]}               [description]
			 */
			subscribe(album_id,event){
				let member_id = tool.getStore("memberinfo").member_id,
					key = tool.getStore("memberinfo").key,
					target = event.target;
				tool.ajax({
					url:urlServer.ApiUrl + "c=member&a=cancelMySubscribe",
					data:{
						member_id:member_id,
						key:key,
						album:album_id,
					}
				},(result)=>{
					if(result.code == 1){	
						$(target).closest('.class_item').remove();
						// location.reload(); 
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [toVideo description]判断专辑是否下架
			 * @param  {[type]} status [description]
			 * @param  {[type]} id     [description]
			 * @return {[type]}        [description]
			 */
			toVideo(status,id){
				if(status == 0){
					Toast({message: "抱歉专辑已下架！"});
				}else{
					this.$route.router.go({name:'classinfo',query:{album_id:id}});
				}
			}
		}
	}
</script>
<template>
	<div class="class_item">
		<a class="img_box" @click="toVideo(playinfo.status,playinfo.id)">
			<img :src="playinfo.img" alt="">
			<i class="vip_tag" v-if="playinfo.is_vip == 1"></i>
		</a>
		<div class="class_info">
			<a @click="toVideo(playinfo.status,playinfo.id)"><h2 class="video_title" v-text="playinfo.name"></h2></a>
			<p class="video_intro word-break" v-text="playinfo.description"></p>
			<div class="bottom">
				<a class="item_btn center_btn" @click.prevent="subscribe(playinfo.id,$event)">取消收藏</a>
			</div>
		</div>	
	</div>
</template>