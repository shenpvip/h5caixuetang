<script>
	import { Spinner } from 'mint-ui';
	export default{
		name: 'bottomloading',
		components:{
			Spinner
		},
		props:{
			show: {
				type: Boolean,
				default: true
			}
		}
	}
</script>

<template>
	<div class="page-infinite-loading" v-show="show">
		<spinner type="fading-circle"></spinner>
		加载中...
	</div>
</template>