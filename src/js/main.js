/**
 * [Vue description] 单页面应用spa 组件采用异步加载
 * @type {[type]}
 * @author chencong
 */
import Vue from 'vue';
import Router from 'vue-router';
//默认引入app.vue
import App from 'components/App.vue';
//动态设置微信网页中标题的指令
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

//配置路由
Vue.use(Router);
const router = new Router();

//引入jquery
const $ = require('jquery');
import urlServer from './base/ajaxurl';

/**
 * 以下为异步导入vue页面组件
 * 常量必须用 const 声明  且变量名必须为大写
 */
const Index = resolve => require(['components/home/index'], resolve);//首页
const Classinfo = resolve => require(['components/class/class_info'], resolve);//教程详情页
const GeneralList = resolve => require(['components/class/general_list'], resolve);//通用列表页
const TeacherList = resolve => require(['components/class/teacher_list'], resolve);//老师列表页
const Login = resolve => require(['components/user/login'], resolve);//登录
const Reg = resolve => require(['components/user/reg'], resolve);//注册
const Passport = resolve => require(['components/user/passport'], resolve); //找回密码
const Paynew = resolve => require(['components/pay/pay_new'], resolve); //支付页面
const Tips = resolve => require(['components/common/tips'], resolve); //提示跳转页面
const Teacherinfo = resolve => require(['components/class/teacher_info'], resolve); //教师详情页
const Setting = resolve => require(['components/center/set'], resolve); //设置页
const Usercenter = resolve => require(['components/center/user_center'], resolve); //个人中心页

/**
 * 路由项
 */
router.map({
	'/index':{
		name:'index',
		title:'财学堂首页',
		component:Index
	},
	'/reg':{
		name:'reg',
		title:'注册',
		component:Reg
	},
	'/classinfo':{
		name:'classinfo',
		title:'播放',
		component:Classinfo,
	},
	'/generalList':{
		name: 'generalList',
		title: '财学堂',
		component:GeneralList
	},
	'/teacherList':{
		name: 'teacherList',
		title: '名师列表',
		component:TeacherList
	},
	'/login':{
		name: 'login',
		title: '登录',
		component:Login
	},
	'/passport':{
		name: 'passport',
		title: '找回密码',
		component: Passport
	},
	'/paynew':{
		name:'paynew',
		title:'支付',
		component:Paynew
	},
	'/tips':{
		name:'tips',
		title:'提示',
		component:Tips
	},
	'/teacherinfo':{
		name:'teacherinfo',
		title:'教师详情',
		component:Teacherinfo
	},
	'/set':{
		name:'set',
		title:'设置',
		isLogin: true,
		component:Setting
	},
	'usercenter':{
		name:'usercenter',
		title:'个人中心',
		isLogin: true,
		component:Usercenter
	}
});

/**
 * [globalFn description]全局方法
 * @type {Object}
 */
let globalFn = {
	/**
	 * [StorePlayRecord description]保存播放记录
	 */
	StorePlayRecord:()=>{
		if(window.localStorage.playRecord){
			if(window.localStorage.memberinfo){
				let memberinfo = JSON.parse(window.localStorage.memberinfo); 
				let playRecord = JSON.parse(window.localStorage.playRecord);
				$.ajax({
				    url: urlServer.ApiUrl + "c=play_recording&a=play_record_pc",
				    type: 'get',
				    dataType: 'jsonp',
				    data:{
						member_id:memberinfo.member_id,
						key:memberinfo.key,
						resource:[playRecord],
					},
				})
				.done(function(data) {
				    if(data.code == 1){
				         window.localStorage.removeItem("playRecord");
				    }
				})
				.fail(function() {
				    console.log("error");
				})
			}
		}
	},
}

//设置路由跳转之前的动作 检测用户是否登录
router.beforeEach(function(transition){
	window.scrollTo(0, 0);
    let backUrl = transition.to.name;
	if(transition.to.isLogin){
		if(window.localStorage){
			window.localStorage.memberinfo ? transition.next() : transition.redirect({name:'login',query:{backUrl: backUrl}});
		}else{
			alert('浏览器不支持localStorage');
		}
	}else{
		transition.next();
	}
	globalFn.StorePlayRecord();
});

//设置路由跳转以后更新title  为了解决IOS下微信刷新title  需要使用iframe刷新
// router.afterEach(function (transition) {
//     if (transition.to.title) {
// 		document.title = title
// 		var mobile = navigator.userAgent.toLowerCase()
// 		if (/iphone|ipad|ipod/.test(mobile)) {
// 		  var iframe = document.createElement('iframe')
// 		  iframe.style.display = 'none'
// 		  // 替换成站标favicon路径或者任意存在的较小的图片即可
// 		  iframe.setAttribute('src', '/favicon.ico')
// 		  var iframeCallback = function () {
// 		    setTimeout(function () {
// 		      iframe.removeEventListener('load', iframeCallback)
// 		      document.body.removeChild(iframe)
// 		    }, 0)
// 		  }
// 		  iframe.addEventListener('load', iframeCallback)
// 		  document.body.appendChild(iframe)
// 		}
//     }
// });

// If no route is matched redirect home
router.redirect({
  '*': '/index'
});

// Start up our app
router.start(App, 'app');