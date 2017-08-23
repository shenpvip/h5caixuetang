<script>
	import { TabContainerItem } from 'mint-ui'; //TabContainerItem
	const ListItem = resolve => require(['../../../components/common/list-item.vue'], resolve);
	export default{
	 	name:'tab-comment',
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
	 		'list-item':ListItem
	 	}
	 }
</script>

<template>
<tab-container-item class="message_list">
	<ul>
		<li v-for="commentlist in commentlists">
			<list-item :commentlist="commentlist"></list-item>
		</li>
	</ul>
</tab-container-item>
</template>