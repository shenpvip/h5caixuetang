<script>
	export default{
		name: 'list-item',
		data(){
			return {
				show:false,
				toggleText: '更多',
				height : ''
			}
		},
		ready(){
			this.init();
		},
		props:{
			commentlist:{
				type:Object
			}
		},
		methods:{
			toggle(event){
				let target = this.$els.panel;
				let box = this.$els.box;
				let btn = this.$els.btn;
				this.show = !this.show;
				if(this.show){
					this.toggleText = '收起';
					target.style.height = box.offsetHeight + 'px';
				}else{
					this.toggleText = '更多';
					target.style.height = 42 + 'px';
				}
			},
			init(){
				let target = this.$els.panel;
				let box = this.$els.box;
				let btn = this.$els.btn;
				if(box.offsetHeight > target.offsetHeight){
					btn.style.display = 'block';
				}
			}
		}
	}
</script>

<template>
	<a class="item" href="javascript:void(0);">
		<img :src="commentlist.head" onerror="this.src = '../../images/default.png'">
		<div class="message_box">
			<div class="user_info">
				<span class="time pull-right" v-text="commentlist.created_at"></span>
				<span class="user_name" v-text="commentlist.name"></span>
			</div>
			<div class="message_txt" v-el:panel transition="toggle">
				<p v-el:box class="txtInfo" v-text="commentlist.content"></p>
			</div>
			<span v-el:btn  class="more_btn pull-right" :class="{'up':show}" @click="toggle($event)" v-text="toggleText">更多</span>
		</div>
	</a>
</template>


<style lang="sass">
.toggle-transition{
	-webkit-transition: height .3s ease;
	transition: height .3s ease;
	overflow: hidden;
}
.toggle-enter,
.toggle-leave{
	height : 0!important;
}
</style>