<script>
	const Resitem = resolve => require(['../../components/common/res_item.vue'], resolve);
	const Bottomloading = resolve => require(['../../components/common/bottomloading.vue'], resolve);
	import tool from 'base/tools';
	import { Toast,MessageBox } from 'mint-ui';
	import urlServer from 'base/ajaxurl';
	export default{
		name:'teacher_list',
		data(){
			return{
				teacherlists:[],
				page:1,
				isloading:true,        //loadind开关
				showloading:true,      //是否显示loading
				member_id:'',
				key:'',
				type:'teacherlist'
			}
		},
		components:{
			"resitem": Resitem,
			Bottomloading
		},
		route:{
			data(transition){
				this.page = 1;
				this.isloading = true;
				this.showloading = true;
				this.teacherlists = [];
				if(window.localStorage.memberinfo){
					this.member_id = tool.getStore("memberinfo").member_id;
					this.key = tool.getStore("memberinfo").key;
				}
				this.getlist();
				this.scrollLoad();
				transition.next();
			}
		},
		methods:{
			/**
			 * [getlist description]获取老师列表
			 * @param  {[type]} page [description]
			 * @return {[type]}      [description]
			 */
			getlist(page){
				page = page || 1;
				tool.ajax({
					url:urlServer.ApiUrl + "c=teacher&a=teacher_list",
					data:{
						member_id:this.member_id,
						page:5,
						curpage:page,
						album:2,
					}
				},(result)=>{
					if(result.code == 1){
						if(result.data != null){
							let len = result.data.length;
							if(len < 5){
							    this.isloading = false;
							    this.showloading = false;
							}else{
							    this.isloading = true;
							    this.showloading = true;
							}
							if(page == 1){
								this.teacherlists = result.data;
							}else{
								if(len){
									for(let i = 0; i < len; i++){
										this.teacherlists.push(result.data[i]);
									}
								}
							}
						}else{
							this.isloading = false;
							this.showloading = false;
							if(page == 1){
								this.teacherlists = [];
								this.no_tips = true;
								this.notips = 'no_video';
							}
						}
					}else{     //请求出错
						this.isloading = true;
						this.showloading = true;
						Toast({message: result.message});
					}
				},(err)=>{   //请求失败
					this.isloading = true;
					console.log(err);
				},()=>{    //发送请求之前
					this.isloading = false;
				});
			},
			/**
	 		 * [scrollLoad description]上拉加载更多
	 		 * @return {[type]} [description]
	 		 */
	 		scrollLoad(){
	 			let _self = this;
	 			require.ensure([], function () {
					let scroll = require('base/scroll');
					new scroll({},function(ret){
						if(ret.scrollTop && ret.isToBottom && _self.isloading){
							_self.getlist(++_self.page);
						}
					});
				});
	 		}
		},
	}
</script>
<template>
	<div class="class-transition-content">
		<div class="mui-content">
			<div class="teacher_list">
				<resitem v-for="reslist in teacherlists" :reslist="reslist" :type="type"></resitem>
				<bottomloading :show="showloading"></bottomloading>
			</div>
		</div>
	</div>
</template>