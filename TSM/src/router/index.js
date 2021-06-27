
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import LoginView from '../components/LoginView.vue'
import HomeView from '../components/Home.vue'
import store from "../store/index.js"
import Sy from "../components/dashboard/Sy.vue"
import { storeKey } from 'vuex'
import { t } from 'element-plus/lib/locale'

// const ruleMapping={
// 	"users":userRule,
// }

const routes = [
	// 登录
	{
	 		path: '/Login',
	 		name: 'Login',
	 		component: LoginView
	},
	// 首页导航
	{
		path: '/HomeView',
		name: 'HomeView',
		component: HomeView,
		children: [
			{
				path: "/",
				name: "dashboard",
				meta: {
					title: '系统首页'
				},
				component: Sy
			}
		]
	}
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, // `routes: routes` 的缩写
})

const modules = import.meta.glob('../components/**/*.vue');

export function initFind(){
	const rightList = JSON.parse(sessionStorage.getItem('menulist'))
	// const currentRouter = router.options.routes
	for (var i = 0; i < rightList.length; i++) {
		let chm = rightList[i].asideChildren
			for (var k = 0; k < chm.length; k++) {
				if (chm[k].url != null)  {
					let cpath = '../components/' + chm[k].componentPath
					const rouc = {
						path: chm[k].url,
						name: chm[k].componentName,
						component: modules[`${cpath}`]
					}
					router.addRoute("HomeView", rouc)
				}
		}
	}
	//_this.$store.commit("setrightList", response.data.data.menus);
	console.log(rightList)
	//router.addRoute("Errors", Errors)
}

//全局前置守卫，可用作前端权限验证的简单实现
router.beforeEach(function (to, from, next) {
	const state =JSON.parse(sessionStorage.getItem('state'))
	if((to.name != 'Login' && state==null) || (to.name != 'Login' &&  !state.userInfo.isValidate)){
		next('Login')
	}else{
		if(to.matched.length == 0){
			next({path:to.path})
			const rightList = JSON.parse(sessionStorage.getItem('menulist'))
			store.commit("setrightList",rightList)
			store.commit("updateUserInfo", state.userInfo);
			initFind();
		}else{
			next()
		}
	}
})
//输出router
export default router




