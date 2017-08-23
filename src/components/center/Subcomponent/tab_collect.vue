<script>
const Viewitem = resolve => require(['../../../components/common/view_item.vue'], resolve);
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
	components:{
		"viewitem": Viewitem
	}
}
</script>

<template>
	<div class="tab_class">
		<div class="class_wrap">
			<viewitem v-for="playinfo in playlist" :playinfo="playinfo"></viewitem>
		</div>
	</div>
</template>