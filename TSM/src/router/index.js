// import {
// 	createRouter,
// 	createWebHashHistory,
// 	createWebHistory
// } from 'vue-router'
// import LoginView from '../components/LoginView.vue'
// const modules =
// 	import.meta.glob('../components/**/*.vue');
// import {
// 	createStore
// } from 'vuex'
// const routes = [
// 	{
// 		path: '/',
// 		name: 'login',
// 		component: LoginView
// 	}
// ]

// const router = createRouter({
// 	history: createWebHistory(),
// 	routes
// })
// //全局前置守卫，可用作前端权限验证的简单实现
// router.beforeEach(function(to, from, next) {
// 	//console.log("in main.js to:" + to.path + "  from:" + from.path)
// 	const state = JSON.parse(sessionStorage.getItem('state'));

// 	if ((to.name !== 'login' && state == null) || (to.name !== 'login' && !state.userInfo.isValidate)) {
// 		//console.log("跳至登录")
// 		//console.log("state=%o", state)
// 		next({
// 			name: 'login'
// 		})
// 	} else {
// 		//console.log("modules=%o", modules)
// 		//console.log("state===%o", state)
// 		if (sessionStorage.getItem('refresh') == "true" && state.userInfo.menus != null) {
// 			//console.log("---------------------------------------------------")
// 			for (var i = 0; i < state.userInfo.menus.length; i++) {
// 				let comp = '../components/' + state.userInfo.menus[i].componentPath
// 				const rou = {
// 					path: state.userInfo.menus[i].url,
// 					name: state.userInfo.menus[i].componentName,
// 					component: modules[`${comp}`],
// 					children: []
// 				}

// 				let chm = state.userInfo.menus[i].asideChildren
// 				for (var k = 0; k < chm.length; k++) {
// 					let cpath = '../components/' + chm[k].componentPath
// 					const rouc = {
// 						path: chm[k].url,
// 						name: chm[k].componentName,
// 						component: modules[`${cpath}`]
// 					}
// 					//router.addRoute(rouc)
// 					rou.children.push(rouc)
// 				}
// 				router.addRoute(rou)
// 				//console.log(rou)
// 			}
// 			sessionStorage.setItem("refresh", "false")
// 			next({
// 				path: to.path
// 			})
// 			return
// 		}
// 		next()
// 	}
// })

// export default router



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
				path: "/dashboard",
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
	const rightList = JSON.parse(sessionStorage.getItem('state'))
	// const currentRouter = router.options.routes
	for (var i = 0; i < rightList.rightList.length; i++) {
		let chm = rightList.rightList[i].asideChildren
		
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
			initFind();
			next({path:to.path})
		}else{
			next()
		}
	}
})
//输出router
export default router




