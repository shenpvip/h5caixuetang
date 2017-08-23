<script>
	export default{
		name:'order-item',
		props:{
			orderinfo:{
				type:Object
			}
		},
		methods:{
			/**
			 * [topay description]未支付订单去支付页
			 * @param  {[type]} status [description]
			 * @return {[type]}        [description]
			 */
			topay(status,goods_id,order_id){
				if(status == 0){
					this.$route.router.go({name:'paynew',query:{backName:'index',goods_id:goods_id,order_id:order_id}});
				}
			}
		}
	}
</script>
<template>
	<div class="order_item">
		<div class="list_item clearfix">
			<a class="pay_btn pull-right" :class="{'pay_success':orderinfo.status == 1 ? true : false,'pay_miss':orderinfo.status == 3 || orderinfo.status == 2 ? true : false}" v-text="orderinfo.order_status" @click.prevent="topay(orderinfo.status,orderinfo.goods_id,orderinfo.order_id)"></a>
			<h2 class="pull-left" v-text="orderinfo.goods_name"></h2>
		</div>
		<div class="list_item">
			<span class="pull-right" v-text="orderinfo.order_sn">684237253</span>
			<p>订单号</p>
		</div>
		<div class="list_item">
			<span class="pull-right" v-text="orderinfo.created_at"></span>
			<p>下单时间</p>
		</div>
		<div class="list_item">
			<span class="order_price pull-right" v-text="orderinfo.amount | currency '&yen;' 2"></span>
			<p>支付金额</p>
		</div>
	</div>
</template>