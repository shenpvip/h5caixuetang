<script>
	import { Field,Toast,Button } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
		name: 'login',
		data(){
			return {
				datas:{
					username:'',
					password :''
				},
				isdisabled: false,
				isflag: true,
				btnText: '登&nbsp;&nbsp;录',
				backUrl: this.$route.query.backUrl,
				backData: this.$route.query.backData,
				toData: this.$route.query.toData,
				backName:'',
				album_id:'',
				video_id:'',
			}
		},
	    route:{
			data(transition){
				this.datas = {
					username : '',
					password : ''
				};
				this.backUrl = this.$route.query.backUrl;
				this.backData = this.$route.query.backData;
				this.toData = this.$route.query.toData;
				this.isdisabled = false;
				this.isflag = true;
				if(this.$route.query.backName){
					this.backName = this.$route.query.backName;
				}
				if(this.$route.query.album_id){
					this.album_id = this.$route.query.album_id;
				}
				if(this.$route.query.video_id){
					this.video_id = this.$route.query.video_id;
				}
				transition.next();
			}
	    },
		components:{
			'mt-field' : Field,
			'mt-button' : Button
		},
		methods:{
			loginInfo(event){
				// if(window.localStorage.memberinfo){
				// 	Toast({
				// 	  message: "您已登录，请勿重复登录！",
				// 	  duration: 3000
				// 	});
				// 	return;
				// }
				if(!tool.isPhone(this.datas.username)){
					Toast({message: '请输入正确的手机号！'});
					return;
				}
				if(this.datas.password === ''){
					Toast({message: '密码不能为空！'});
					return;
				}
				//ajax请求
				if(this.isflag){
					this.isflag = false;
					tool.ajax({url:urlServer.ApiUrl + "c=user&a=login",data: this.datas},(result)=>{
						if(result.code == 1){
							tool.setStore("memberinfo",result.data);
							this.$route.router.replace({name:this.backUrl,query:{backData:this.backData,toData:this.toData,backName:this.backName,video_id:this.video_id,album_id:this.album_id}}); 
						}else{
							this.isflag = true;
							this.isdisabled = false;
							Toast({message: result.message});
						}
					},(err)=>{
						this.isflag = true;
						this.isdisabled = false;
						console.log(err);
					});
				}
			}
		}
	}
</script>

<template>
	<div class="class-transition-content">
		<div class="mui-content">
			<div class="user-handle-form login-box">
				<div class="page-part">
					<mt-field placeholder="请输入您的手机号"  label="手机号" type="tel" :value.sync="datas.username" :attr="{maxlength:11,name:'phone',autocomplete:'off'}"  :disable-clear="true">
					</mt-field>
					<p class="form-tips">尊贵的股先生用户可通过手机号直接登录</p>
					<mt-field placeholder="请输入您的密码" label="密码" type="password" :value.sync="datas.password" :attr="{maxlength:12,name:'newpwd',autocomplete:'off'}"  :disable-clear="true"></mt-field>
				</div>
				<div class="handle-bottom">
					<div class="form-btn">
						<mt-button @click.prevent="loginInfo($event)" :disabled="isdisabled" type="primary" size="large">{{{btnText}}}</mt-button>
					</div>
					<div class="form-btn">
						<a v-link="{name:'reg'}" class="link" title="注册"><mt-button type="default" size="large">还没有账号，快速注册</mt-button></a>
					</div>
				</div>
				<div class="handle-bottom-a">
					<a v-link="{name:'passport'}" title="忘记密码？" class="findPwd">忘记密码？</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	@import "../../css/user_handle.css";
</style>