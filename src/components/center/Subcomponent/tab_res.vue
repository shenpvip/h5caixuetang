<script>
	const Resitem = resolve => require(['../../../components/common/res_item.vue'], resolve);
	export default{
		name:'tab_res',
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
			"resitem": Resitem
		}
	}
</script>
<template>
 	<div class="tab_res">
 		<resitem v-for="reslist in myres" :reslist="reslist"></resitem>
 	</div>
</template>