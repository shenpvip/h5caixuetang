<script>
	import {TabContainerItem} from 'mint-ui'; //TabContainerItem
	export default{
	 	name:'tab-introduce',
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
	 		TabContainerItem
	 	}
	 }
</script>

<template>
<!-- 课程简介 -->
<tab-container-item class="tab_item">
	<!-- <h2>课程简介</h2> -->
	<section v-text="intro"></section>
</tab-container-item>
</template>