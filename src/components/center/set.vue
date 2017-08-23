<script>
	import { Button,Cell,Toast,MessageBox } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
	 	name:'set',
	 	data(){
	 		return{
	 			member_id:'',
	 			key:'',
	 		}
	 	},
	 	components:{
	 		'mt-button':Button,
	 		'mt-cell':Cell,
	 	},
	 	route:{
	 		data(transition){
	 			this.member_id = tool.getStore("memberinfo").member_id;
	 			this.key = tool.getStore("memberinfo").key;
	 			transition.next();	
	 		}
	 	},
	 	methods:{
	 		/**
	 		 * [checkBind description]检测用户是否绑定过微信
	 		 * @return {[type]} [description]
	 		 */
	 		checkBind(){
	 			tool.ajax({
	 				url:urlServer.ApiUrl + "c=user_center&a=user_is_bind",
	 				data: {
	 					member_id:this.member_id,
	 					key:this.key
	 				}
	 			},(result)=>{
	 				if(result.code == 1){
	 					if(result.data == 0){
	 						Toast("您还没有绑定微信！")
	 					}else{
	 						this.unbind();
	 					}
	 				}else{
	 					Toast({message: result.message});
	 				}
	 			},(err)=>{
	 				console.log(err);
	 			});
	 		},
	 		/**
	 		 * [unbind description]解除绑定
	 		 * @param  {[type]} event [description]
	 		 * @return {[type]}       [description]
	 		 */
	 		unbind(event){
	 			MessageBox.confirm('尊敬的财主您确定与电脑端财学堂账号解绑吗？').then(action => {
		   			tool.ajax({
		   				url:urlServer.ApiUrl + "c=member&a=unbind_wx",
		   				data: {
		   					member_id:this.member_id,
		   					key:this.key
		   				}
		   			},(result)=>{
						if(result.code == 1){
							tool.delStore("memberinfo");
							this.$route.router.go({name:'tips', query: {tipsTxt:'成功解除绑定',loginout:1}}); 
						}else{
							Toast({message: result.message});
						}
					},(err)=>{
						console.log(err);
					});
	 			},(action =>{}));
	 		},
	 		/**
	 		 * [quit description]退出登录
	 		 * @param  {[type]} event [description]
	 		 * @return {[type]}       [description]
	 		 */
	 		quit(event){	
	 			tool.delStore("memberinfo");
	 			this.$route.router.go({name:'tips', query: {tipsTxt:'退出成功',loginout:1}}); 
	 		// 	if(!event.target.disabled){
				// 	event.target.disabled = true;
				// 	tool.ajax({url:urlServer.ApiUrl + "c=user_center&a=loginout",data: {member_id:this.member_id,key:this.key}},(result)=>{
				// 		if(result.code == 1){
				// 			tool.delStore("memberinfo");
				// 			this.$route.router.go({name:'tips', query: {tipsTxt:'退出成功'}}); 
				// 			event.target.disabled = false;
				// 		}else{
				// 			Toast({message: result.message});
				// 			event.target.disabled = false;
				// 		}
				// 	},(err)=>{
				// 		event.target.disabled = false;
				// 		console.log(err);
				// 	});
				// }
	 		}
	 	}
	 }
</script>

<template>
<div class="class-transition-content">
	<div class="mui-content">
		<div class="set-content">
			<!-- <mt-cell v-link="{name:'updatepwd'}" title="修改密码" is-link></mt-cell> -->
			<mt-cell title="解除绑定" is-link @click.prevent="checkBind()"></mt-cell>
			<mt-button type="danger" size="large" @click="quit($event)">退出登录</mt-button>		
		</div>
	</div>
</div>
</template>
<style scoped>
	@import "../../css/user_center.css";
</style>