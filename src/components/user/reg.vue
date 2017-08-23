<script>
	import { Field,Toast,Button } from 'mint-ui';
	const agreementmask = resolve => require(['../common/agreementMask'], resolve);
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
		name:'reg',
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
				btnText: '注&nbsp;&nbsp;册',
				layer:{
					poupTitle:'',
					poupContent:'',
					btnTxt:''
				},
				layerBool:false
			}
		},
		components:{
			'mt-field' : Field,
			'mt-button' : Button,
			agreementmask
		},
		route:{
			data(transition){
				this.datas.phone = '';
				this.datas.code = '';
				this.datas.newpwd = '';
				this.datas.checknewpwd = '';
				this.mysecond = 0;
				this.sendBtn = '获取验证码';
				this.isflag = true;
				this.isdisabled = false;
        		transition.next();
			}
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
						type: 1
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
			regInfo(event){
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
				if(!this.ischeck){
					Toast({message: '请阅读用户手册和知识产权声明'});
					return;
				}	
				if(this.isflag){
					this.isflag = false;
					let regData = {
						mobile : this.datas.phone,
						password : this.datas.newpwd,
						code : this.datas.code,
						open_id : tool.getStore("open_id")
					}
					tool.ajax({url:urlServer.ApiUrl + "c=user&a=reg",data: regData},(result)=>{
						if(result.code == 1){
							tool.setStore("memberinfo",result.data);
							this.$route.router.go({name:'tips', query: {tipsTxt:'注册成功'}}); 
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
			},
			/**
			 * [userManual description]用户手册
			 * @return {[type]} [description]
			 */
			userManual(){
				this.layerBool = true;
				this.layer.poupTitle = '用户手册';
				this.layer.poupContent = '欢迎您使用财学堂！</br>&nbsp;&nbsp;&nbsp;&nbsp;本协议是您与成都市股先生网络信息技术有限公司订立的（以下简称“股先生”）关于使用财学堂（隶属股先生）进行视频在线观看、网民评论等相关服务的有效合约，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款。当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与股先生达成一致，成为财学堂用户。阅读本协议的过程中，如果您不同意本协议或其中任何条款的约定，您应立即停止注册程序。';
				this.layer.btnTxt = '我已阅读用户手册';
			},
			/**
			 * [statement description]知识产权声明
			 * @return {[type]} [description]
			 */
			statement(){
				this.layerBool = true;
				this.layer.poupTitle = '知识产权声明';
				this.layer.poupContent = '&nbsp;&nbsp;&nbsp;&nbsp;财学堂向您提供包括但不限于即时通讯、网络媒体、互联网增值、互动娱乐、电子商务和广告等产品及服务。财学堂一贯高度重视知识产权保护并遵守中华人民共和国各项知识产权法律、法规和具有约束力的规范性文件。财学堂呼吁您也要同样尊重知识产权和他人合法权益，坚决反对任何违反中华人民共和国和国际条约有关知识产权的法律法规的行为。';
				this.layer.btnTxt = '我已阅读知识产权声明';
			}
		},
		events:{
			"protocolLayer"(data){
				this.layerBool = data;
			}
		}
	}
</script>

<template>
	<div class="class-transition-content">
		<div class="mui-content">
			<!-- 表单展示 -->
			<div class="user-handle-form reg-box">
				<agreementmask :layer = "layer" transition="fade" v-show="layerBool"></agreementmask>
				<div class="page-part">
					<mt-field placeholder="请输入您的手机号"  label="手机号" type="tel" :value.sync="datas.phone" :attr="{maxlength:11,name:'phone',autocomplete:'off'}"  :disable-clear="true">
					</mt-field>
					<p class="form-tips">尊贵的股先生用户可通过手机号直接登录</p>
					<mt-field placeholder="请输入您的验证码" label="验证码" type="tel" :value.sync="datas.code" :attr="{maxlength:6,name:'code',autocomplete:'off'}"  :disable-clear="true">
						<button @click.stop="getCode($event)" v-text="sendBtn"></button>
					</mt-field>
					<mt-field placeholder="请输入您的密码" label="密码" type="password" :value.sync="datas.newpwd" :attr="{maxlength:12,name:'newpwd',autocomplete:'off'}"  :disable-clear="true"></mt-field>
					<mt-field placeholder="请再次输入您的密码" label="确认密码" type="password" :value.sync="datas.checknewpwd" :attr="{maxlength:12,name:'checknewpwd',autocomplete:'off'}"  :disable-clear="true"></mt-field>
				</div>
				<div class="handle-bottom">
					<div class="agr-part">
						<label><input type="checkbox" v-model="ischeck"></label>我已阅读并同意<a href="javascript:void(0);" @click.prevent="userManual">用户手册</a>和<a href="javascript:void(0);" @click.prevent="statement">知识产权声明</a>
					</div>
					<div class="form-btn">
						<mt-button @click.prevent="regInfo($event)" type="primary" :disabled="isdisabled" size="large">{{{btnText}}}</mt-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	@import "../../css/user_handle.css";
</style>