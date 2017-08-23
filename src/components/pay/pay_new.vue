<script>
	const agreementmask = resolve => require(['../common/agreementMask'], resolve);
	import { Button,Toast,MessageBox,Indicator } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	import tool from 'base/tools';
	export default{
		name:'pay_new',
		data(){
			return{
				orderinfo:{},
				order_id:null,
				isdisabled:false,
				isflag:true,
				currentSelect:'wxPay',
				selectDate:0,
				// checked:false,
				member_id:'',
				key:'',
				userInfo:{
					vipDate:'',
					userIcon:'',
					userName:'',
				},
				pay_price:'',
				goods_id:'',
				is_login:false,
				layer:{
					poupTitle:'',
					poupContent:'',
					btnTxt:''
				},
				layerBool:false,
				show_wx:true,
				backName:'',
				video_id:'',
				album_id:'',
				selectFlag:false,
				playUrl:'',
			}
		},
		components:{
			Button,
			agreementmask
		},
		route:{
			data(transition){
				this.orderinfo = {};
				this.order_id = null;
				this.isdisabled = false;
				this.isflag = true;
				this.is_login = false;
				this.currentSelect = 'wxPay';
				this.show_wx = true;
				this.selectDate = 0;
				this.selectFlag = false;
				this.layerBool = false;
				this.goods_id = '';
				this.video_id = '';
				this.album_id = '';
				this.backName = '';
				this.playUrl = '';
				if(!this.is_weixn()){
					this.currentSelect = 'aliPay';
					this.show_wx = false;
				}
				if(window.localStorage.memberinfo){
					this.member_id = tool.getStore("memberinfo").member_id;
					this.key = tool.getStore("memberinfo").key;
					this.userInfo.userName = tool.getStore("memberinfo").member_name;
					this.is_login = true;
				}
				if(this.$route.query.playUrl){
					this.playUrl = this.$route.query.playUrl;
				}
				if(this.$route.query.order_id){
					this.order_id = this.$route.query.order_id;
				}
				if(this.$route.query.goods_id){
					this.goods_id = this.$route.query.goods_id;
					this.selectFlag = true;
				}
				if(this.$route.query.backName){
					this.backName = this.$route.query.backName;   //支付的来路页
				}
				if(this.$route.query.video_id){
					this.video_id = this.$route.query.video_id;
				}
				if(this.$route.query.album_id){
					this.album_id = this.$route.query.album_id;
				}
				this.getPayinfo();
				this.getVipInfo();
				transition.next();
			}
		},
		methods:{
			/**
			 * [getPayinfo description]获取商品确认页信息
			 * @return {[type]} [description]
			 */
			getPayinfo(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=member_goods&a=list",
					data:{
						member_id:this.member_id,
						key:this.key,
					}
				},(result)=>{
					if(result.code == 1){	
						this.selectDate = 0;
						if(this.goods_id){
							for(let i=0;i<result.data.length;i++){
								if(result.data[i].id == this.goods_id){
									this.selectDate = i;
								}
							}
						}else{
							this.goods_id = result.data[this.selectDate].id;
						}
						this.pay_price = result.data[this.selectDate].real_price;
						this.orderinfo = result.data;
					}else{
						Toast({message: result.message});
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [getVipInfo description]获取vip信息
			 * @return {[type]} [description]
			 */
			getVipInfo(){
				tool.ajax({url:urlServer.ApiUrl + "c=vip&a=get_vip_info",data:{member_id:this.member_id,key:this.key}},(result)=>{
					if(result.code == 1){	
						this.userInfo.vipDate = result.data;
						this.userInfo.userIcon = result.header_img;
					}else{
						this.userInfo.vipDate = null;
						this.userInfo.userIcon = result.header_img;
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [checkPay description]检查客户端是否支持微信支付
			 * @return {[type]} [description]
			 */
			checkPay(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=wxpay&a=check_payversion",
					data:{
						key :this.key,
						member_id : this.member_id
					}
				},(result)=>{
					if(result.code == 1){
						this.wxPay();
					}else{
						Toast({message:"客户端不支持微信支付，请更新客户端！"});
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [is_weixn description]检查当前是否在微信浏览器内
			 * @return {Boolean} [description]
			 */
			is_weixn(){
				let ua = navigator.userAgent.toLowerCase(); 
				if(ua.match(/MicroMessenger/i)=="micromessenger") { 
					return true; 
				} else { 
					return false; 
				} 
			},
			/**
			 * [pay description]生成订单，获取order_id
			 * @return {[type]} [description]
			 */
			pay(){
				if(!window.localStorage.memberinfo){
					MessageBox.confirm('请先登录财学堂！').then(action => {
					  	this.$route.router.go({name:'login',query:{backUrl:'paynew',order_id:this.order_id,backName:this.backName,video_id:this.video_id,album_id:this.album_id}});
					},(action =>{}));
					return;
				}
				// if(!this.checked){
				// 	MessageBox.alert("请阅读财学堂VIP会员服务协议");
				// 	return;
				// }
				Indicator.open({
				    text: '加载中...',
				    spinnerType: 'fading-circle'
				});
				if(this.order_id != null){
					console.log("未生成新的订单号");
					this.isflag = true;
					this.isdisabled = false;
					if(this.currentSelect === 'wxPay'){  //微信支付
						this.checkPay();
					}else if(this.currentSelect === 'aliPay'){        //支付宝支付
						this.aliPay();
					}
				}else{
					console.log("生成新的订单号");
					if(this.isflag){
						this.isflag = false;
						tool.ajax({
							url:urlServer.ApiUrl + "c=order&a=add_member_order",
							data:{
								member_id : this.member_id,
								key : this.key,
								goods_id:this.goods_id,
							}
						},(result)=>{
							if(result.code == 1){
								this.order_id = result.data.order_id;
								if(this.currentSelect === 'wxPay'){  //微信支付
									this.checkPay();
								}else if(this.currentSelect === 'aliPay'){        //支付宝支付
									this.aliPay();
								}
							}else{ 
								this.isflag = true;
								this.isdisabled = false;
								Toast({message:result.message});
							}
						},(err)=>{
							this.isflag = true;
							this.isdisabled = false;
							console.log(err);
						});
					}
				}
			},
			/**
			 * [wxPay description]调用微信支付接口
			 * @return {[type]} [description]
			 */
			wxPay(){
	            //获取微信签名信息
				let openid = null;
				let	_self = this;
				if(tool.getStore("open_id")){
					openid = tool.getStore("open_id");
				}
	            tool.ajax({
	            	url:urlServer.ApiPay + "c=wxpay&a=gzh",
	            	data:{
	            		order_id : this.order_id,
	            		member_id : this.member_id,
	            		key : this.key,
	            		open_id : openid,
	            	}
	            },(result)=>{
              		if(result.code == 1){
		                let config = tool.deserialize(result.data.js_api_param);
		               //配置微信接口
		                if (config != undefined && config != null) {
	                  		wx.config({
			                    debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			                    appId :  config.appId, // 必填，appID公众号的唯一标识
			                    timestamp : config.timeStamp, // 必填，生成签名的时间戳
			                    nonceStr : config.nonceStr, // 必填，生成签名的随机串
			                    signature : config.paySign,// 必填，签名，见附录1
			                    jsApiList : [ 'chooseWXPay' ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2，如果出现permiss deline错误，就是因为这里没有配置相关接口原因
	                  		});
		                }
		                wx.ready(function(){
		                  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	                  		wx.chooseWXPay({
			                    timestamp:config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			                    nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
			                    package:config.package,
			                    // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			                    paySign: config.paySign, // 支付签名
			                    signType:config.signType,
			                    success: function (res) {
			                      // 支付成功后的回调函数
			                      _self.$route.router.go({name:'tips', query: {tipsTxt:'订单已完成支付',video_id:_self.video_id,album_id:_self.album_id,backName:_self.backName,tipType:'paynew'}});
			                    },
			                    cancel:function(){
		                    		_self.isflag = true;
			                      	_self.isdisabled = false;
			                    }
	                  		});
		                });
              		}else{
	          			_self.isflag = true;
						_self.isdisabled = false;
		                Toast({message: result.message});
              		}
	            },(err)=>{
	            	_self.isflag = true;
					_self.isdisabled = false;
	            	console.log(err);
	            },()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
			},
			/**
			 * [aliPay description]支付宝支付
			 * @return {[type]} [description]
			 */
			aliPay(){
				tool.ajax({
					url:urlServer.ApiPay + "c=alipay&a=pay",
					data:{
						order_id : this.order_id,
						member_id : this.member_id,
						url:this.playUrl,
					}
				},(result)=>{
					if(result.code == 1){
						document.write(result.data);
					}else{
						Toast({message:result.message});
						this.isflag = true;
                      	this.isdisabled = false;
					}
				},(err)=>{
					this.isflag = true;
                  	this.isdisabled = false;
					console.log(err);
				},()=>{  //请求之前

	            },()=>{//请求完成
	            	Indicator.close();
	            });
			},
			/**
			 * [protocol description]用户协议
			 * @return {[type]} [description]
			 */
			protocol(){
				tool.ajax({
					url:urlServer.ApiUrl + "c=article&a=get&code=vip",
				},(result)=>{
					if(result.code == 1){
						this.layerBool = true;
						this.layer.poupTitle = result.data.title;
						this.layer.poupContent = result.data.content;
						this.layer.btnTxt = '我已阅读该协议';
					}else{
						Toast({message:result.message});
					}
				},(err)=>{
					console.log(err);
				});
			},
			/**
			 * [select_date description]切换产品
			 * @param  {[type]} price [description]
			 * @param  {[type]} index [description]
			 * @return {[type]}       [description]
			 */
			select_date(price,index){
				this.pay_price = price;
				this.order_id = null;
				this.selectDate = index;
				this.goods_id = this.orderinfo[index].id;
			},
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
			<div class="pay_new">
			<agreementmask :layer = "layer" transition="fade" v-show="layerBool"></agreementmask>	
				<div class="pay_txt clearfix">
					<div class="login_user" v-if="is_login">
						<img class="user_icon pull-left" :src="userInfo.userIcon">
						<h2 class="pull-left" v-text="userInfo.userName"></h2>
						<p class="pull-left" v-if="userInfo.vipDate">VIP到期时间:<span v-text="userInfo.vipDate"></span></p>
					</div>
					<div class="login_box" v-if="!is_login">
						您还没有登录哦！
						<a class="login_btn" v-link="{name:'login',query:{backUrl:'paynew',order_id:order_id,backName:backName,video_id:video_id,album_id:album_id}}">立即登录</a>
					</div>
				</div>
				<div class="pay_info">
					<div class="pay_vip">
						<p class="pay_title">
							财学堂VIP
							<span class="pull-right">全网所有课程战法免费学</span>
						</p>
						<div class="vip_wrap" v-if="!selectFlag">
							<div class="block" v-for="info in orderinfo">
								<a class="select_item clearfix" :class="selectDate == $index ? 'active' : ''"  @click.prevent="select_date(info.real_price,$index)">
									<div class="select_info pull-left">
										<p class="real_price"><span>&yen;</span>{{info.real_price}}</p>
										<p class="month">{{info.month}}</p>
										<p class="per_price">（仅需{{info.avg_price}}元/月）</p>
									</div>
									<div class="sub_select_title pull-right">
										<span :class="info.name.length >2 ? 'text_two' : ''">{{info.name}}</span>
									</div>
								</a>
							</div>
						</div>
						<div class="select_wrap" v-else>
							<div class="block" v-for="info in orderinfo">
								<a class="select_item clearfix" :class="selectDate == $index ? 'active' : ''"  v-if="goods_id == info.id  ? true : false">
									<div class="select_info pull-left">
										<p class="real_price"><span>&yen;</span>{{info.real_price}}</p>
										<p class="month">{{info.month}}</p>
										<p class="per_price">（仅需{{info.avg_price}}元/月）</p>
									</div>
									<div class="sub_select_title pull-right">
										<span :class="info.name.length >2 ? 'text_two' : ''">{{info.name}}</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div class="type_wrap">
					<div class="type_item">
						<span class="pay_price pull-right">{{pay_price | currency '&yen;' 2}}</span>
						支付金额
					</div>
					<!-- <div class="type_item">
						请选择支付方式：
					</div> -->
					<div class="list_wrap">
						<a href="javascript:;" class="type_item pay_type" :class="currentSelect == 'wxPay' ? 'selected' :'' " @click.prevent="currentSelect = 'wxPay'" v-if="show_wx">
							<img class="pay_icon pull-left" src="../../images/wx.png" alt="微信">
							<div class="info_txt pull-left">
								<p class="type_name">微信支付</p>
								<p class="type_des">推荐安装微信5.0及以上版本的用户使用</p>
							</div>
						</a>
						<a href="javascript:;" class="type_item pay_type" :class="currentSelect == 'aliPay' ? 'selected' :'' " @click.prevent="currentSelect = 'aliPay'" v-if="!show_wx">
							<img class="pay_icon pull-left" src="../../images/ali.png" alt="支付宝">
							<div class="info_txt pull-left">
								<p class="type_name">支付宝支付</p>
								<p class="type_des">推荐有支付宝账号的用户使用</p>
							</div>
						</a>
					</div>
				</div>
				<div class="agreement">
					<div class="agreement_txt">
						<!-- <label><input type="checkbox" class="checkbox" v-model="checked">我已经阅读并同意<a @click.prevent="protocol">《财学堂VIP会员服务协议》</a></label> -->
						<a @click.prevent="protocol">我已阅读并同意《财学堂VIP会员服务协议》</a>
					</div>
					<!-- <div class="vip_note">
						<h2>会员须知</h2>
						<p>1，尊敬的财学堂用户，您缴费成功后，5分钟之内就会享受财学堂              VIP用户的待遇，任意畅享财学之旅；</br>
2，尊敬的财学堂用户，您缴费成功即时起，会员日期就会进行倒计时，请您充分享用您的会员日期，到期就会关闭您的VIP权限；</p>
					</div> -->
				</div>
				<button :disabled="isdisabled" type="danger" size="large" @click="pay">确认支付</button>
			</div>
		</div>
	</div>
</template>
<style scoped>
	@import "../../css/user_center.css";
</style>