import {
	createRouter,
	createWebHashHistory,
	createWebHistory
} from 'vue-router'
import LoginView from '../components/LoginView.vue'
const modules =
	import.meta.glob('../components/**/*.vue');
import {
	createStore
} from 'vuex'
const routes = [
	{
		path: '/login',
		name: 'login',
		component: LoginView
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})
//全局前置守卫，可用作前端权限验证的简单实现
router.beforeEach(function(to, from, next) {
	//console.log("in main.js to:" + to.path + "  from:" + from.path)
	const state = JSON.parse(sessionStorage.getItem('state'));

	if ((to.name !== 'login' && state == null) || (to.name !== 'login' && !state.userInfo.isValidate)) {
		//console.log("跳至登录")
		//console.log("state=%o", state)
		next({
			name: 'login'
		})
	} else {
		//console.log("modules=%o", modules)
		//console.log("state===%o", state)
		if (sessionStorage.getItem('refresh') == "true" && state.userInfo.menus != null) {
			//console.log("---------------------------------------------------")
			for (var i = 0; i < state.userInfo.menus.length; i++) {
				let comp = '../components/' + state.userInfo.menus[i].componentPath
				const rou = {
					path: state.userInfo.menus[i].url,
					name: state.userInfo.menus[i].componentName,
					component: modules[`${comp}`],
					children: []
				}

				let chm = state.userInfo.menus[i].asideChildren
				for (var k = 0; k < chm.length; k++) {
					let cpath = '../components/' + chm[k].componentPath
					const rouc = {
						path: chm[k].url,
						name: chm[k].componentName,
						component: modules[`${cpath}`]
					}
					//router.addRoute(rouc)
					rou.children.push(rouc)
				}
				router.addRoute(rou)
			}
			sessionStorage.setItem("refresh", "false")
			next({
				path: to.path
			})
			return
		}
		next()
	}
})

export default router
