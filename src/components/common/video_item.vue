<script>
	export default{
		name:'video_item',
		props:{
			videoinfo:{
				type:Object
			}
		},
	}
</script>
<template>
	<a class="class_item" v-link="{name:'classinfo',query:{video_id:videoinfo.video_id,album_id:videoinfo.type == 2 ? videoinfo.relation_id : ''}}">
		<div class="video_box">
			<img :src="videoinfo.img_url" class="connect">
			<div class="class_info clearfix">
				<p class="video_icon pull-right" v-text="videoinfo.play_count"></p>
				<p class="video_title pull-left" v-text="videoinfo.title"></p>
			</div>
			<span class="vip_video" v-if="videoinfo.membership_id > 1"></span>
		</div>
		<p class="class_title" v-text="videoinfo.intro"></p>
	</a>
</template>