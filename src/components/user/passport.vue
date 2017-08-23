<script>
	import { Field,Toast,Button } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
		name:'passport',
		data(){
			return {
				datas: {
					phone: '',
					code:'',
					newpwd: '',
					checknewpwd: ''
				},
				mysecond: 60,
				sendBtn: '获取验证码',
				ischeck: true,
				isdisabled: false,
				isflag: true,
				btnText: '确定'
			}
		},
		route:{
			data(transition){
				this.datas.phone = '';
				this.datas.code = '';
				this.datas.newpwd = '';
				this.datas.checknewpwd = '';
				this.mysecond = 60;
				this.sendBtn = '获取验证码';
				this.isflag = true;
				this.isdisabled = false;
        		transition.next();
			}
		},
		components:{
			'mt-field' : Field,
			'mt-button' : Button
		},
		methods: {
			/**
			 * [getCode description] 获取验证码
			 * @param  {[type]} event [description]
			 * @return {[type]}       [description]
			 */
			getCode(event){
				if(!tool.isPhone(this.datas.phone)){
					Toast({message: '请输入正确的手机号！'});
					return;
				}
				if(event.target.disabled) return;
				let timer = setInterval(()=>{
		          if(this.mysecond > 0){
		            this.mysecond--;
		            this.sendBtn = '已发送'+ this.mysecond + 's';
		          }else {
		            this.sendBtn = '获取验证码';
		            this.mysecond = 60;
		            clearInterval(timer);
		            event.target.disabled = false;
		          }
		        },1000);

				if(!event.target.disabled){
					event.target.disabled = true;
					let yzm = {
						mobile : this.datas.phone,
						type: 2
					}
					tool.ajax({url:urlServer.ApiUrl + "c=verification&a=send",data: yzm},(result)=>{
						if(result.code == 1){
							Toast({message: '验证码发送成功'});
						}else{
							clearInterval(timer);
							event.target.disabled = false;
							Toast({message: result.message});
						}
					},(err)=>{
						clearInterval(timer);
						event.target.disabled = false;
						console.log(err);
					});
				}	
				event.preventDefault();
			},
			/**
			 * [regInfo description] 提交注册表单
			 * @param  {[type]} event [description]
			 * @return {[type]}       [description]
			 */
			passInfo(event){
				if(!tool.isPhone(this.datas.phone)){
					Toast({message: '请输入正确的手机号！'});
					return;
				}
				if(this.datas.code == ''){
					Toast({message: '请输入验证码！'});
					return;
				}
				if(this.datas.newpwd.length < 6 || this.datas.newpwd.length > 20){
					Toast({message: '密码长度为6-20位！'});
					return;
				}
				if(this.datas.newpwd != this.datas.checknewpwd){
					Toast({message: '您输入的两次密码不一致！'});
					return;
				}
				if(this.isflag){
					this.isflag = false;
					let getPasswrd = {
						mobile : this.datas.phone,
						code : this.datas.code,
						password : this.datas.newpwd
					}
					tool.ajax({url:urlServer.ApiUrl + "c=user&a=find_pwd",data: getPasswrd},(result)=>{
						if(result.code == 1){
							tool.delStore("memberinfo");
							this.$route.router.go({name:'tips', query: {goLink:'login',tipsTxt:'成功找回密码',backTxt:'登录页面',btnTxt:'立即重新登录'}});
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
			<div class="user-handle-form reg-box">
				<div class="page-part">
					<mt-field placeholder="请输入您的手机号"  label="手机号" type="tel" :value.sync="datas.phone" :attr="{maxlength:11,name:'phone',autocomplete:'off'}"  :disable-clear="true">
					</mt-field>
					<p class="form-tips">尊贵的股先生用户可通过手机号直接登录</p>
					<mt-field placeholder="请输入您的验证码" label="验证码" type="tel" :value.sync="datas.code" :attr="{maxlength:6,name:'code',autocomplete:'off'}"  :disable-clear="true">
						<button @click.prevent="getCode($event)" v-text="sendBtn"></button>
					</mt-field>
					<mt-field placeholder="请输入您的密码" label="密码" type="password" :value.sync="datas.newpwd" :attr="{maxlength:12,name:'newpwd',autocomplete:'off'}"  :disable-clear="true"></mt-field>
					<mt-field placeholder="请再次输入您的密码" label="确认密码" type="password" :value.sync="datas.checknewpwd" :attr="{maxlength:12,name:'checknewpwd',autocomplete:'off'}"  :disable-clear="true"></mt-field>
				</div>
				<div class="handle-bottom">
					<div class="form-btn">
						<mt-button @click.prevent="passInfo($event)" :disabled="isdisabled" type="primary" size="large">{{{btnText}}}</mt-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	@import "../../css/user_handle.css";
</style>