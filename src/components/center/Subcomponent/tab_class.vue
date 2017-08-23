<script>
	export default{
		name:'tab-album',
		props:{
			playlist:{
				type:Array
			},
			myres:{
				type:Array
			},
			orderinfos:{
				type:Array
			},
		},
	}
</script>

<template>
	<div class="tab_class">
		<div class="class_wrap">
			<div class="block_item" v-for="playinfo in playlist">
				<div class="class_item" v-if="playinfo.play_time">
					<a class="img_box" v-link="{name:'classinfo',query:{album_id:playinfo.album_id,video_id:playinfo.id,playTime:playinfo.play_time}}">
						<img :src="playinfo.img_url" alt="">
						<i class="vip_tag" v-if="playinfo.membership_id > 1"></i>
					</a>
					<div class="class_info">
						<a v-link="{name:'classinfo',query:{album_id:playinfo.album_id,video_id:playinfo.id,playTime:playinfo.play_time}}">
							<h2 class="video_title" v-text="playinfo.title"></h2>
							<p class="video_intro word-break" v-text="playinfo.intro"></p>
							<div class="bottom">
								<span class="play_again pull-right">继续观看</span>
								<p class="play_time">观看至：{{playinfo.play_time}}</p>
							</div>
						</a>
					</div>	
				</div>
			</div>
		</div>
	</div>
</template>