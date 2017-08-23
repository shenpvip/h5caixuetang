<script>
	const Orderitem = resolve => require(['./order-item.vue'], resolve);
	export default{
		name:'tab-order',
		components:{
			'order-item':Orderitem
		},
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
	<div class="order_wrap">
		<order-item v-for="orderinfo in orderinfos" :orderinfo="orderinfo"></order-item>	
	</div>
</template>
