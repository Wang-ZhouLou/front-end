// import {
// 	createStore
// } from 'vuex'
// const store = createStore({
// 	state: {
// 		tagsList: [],
// 		collapse: false,
// 		userInfo: {
// 			username: "",
// 			isValidate: false,
// 			token: "",
// 			menus: []
// 		}
// 	},
// 	getters: {
// 		token: (state) => {
// 			return state.userInfo.token
// 		},
// 		menus: (state) => {
// 			return state.userInfo.menus
// 		},
// 		isValidate: (state) => {
// 			return state.userInfo.isValidate
// 		},
// 		asideMenus: (state) => (path) => {
// 			if (state.userInfo.menus == null) return
// 			//console.log("过滤菜单,%o", state.userInfo.menus)
// 			var m = state.userInfo.menus.filter(aside => aside.url == path)
// 			console.log(m.length+"-+++++++++++++++++++++++++-------------------------------------------")
// 			if (m.length > 0) {
// 				//console.log("m=",m[0].asideChildren)
// 				return m[0].asideChildren
// 			}
// 			return null
// 		}
// 	},
// 	mutations: {
// 		updateUserInfo(state, user) {
// 			if (user == null) {
// 				sessionStorage.removeItem('state')
// 				console.log("清空用户信息")
// 				state.userInfo.username = null
// 				state.userInfo.isValidate = false
// 				state.userInfo.token = null
// 				state.userInfo.menus = null
// 				state.tagsList = []

// 			} else {
// 				//console.log("更新用户状态.......用户名:%s", user.username)
// 				state.userInfo.username = user.username
// 				state.userInfo.isValidate = true
// 				state.userInfo.token = user.token
// 				state.userInfo.menus = user.menus
// 				//console.log("更新用户状态.......用户信息:%o", state.userInfo.menus[0].menuName)
// 				sessionStorage.setItem('state', JSON.stringify(state))
// 			}
// 		},
// 		delTagsItem(state, data) {
// 			state
// 				.tagsList
// 				.splice(data.index, 1);
// 		},
// 		setTagsItem(state, data) {
// 			state
// 				.tagsList
// 				.push(data)
// 				console.log("aaaa")
// 			console.log(state
// 				.tagsList)
// 		},
// 		clearTags(state) {
// 			state.tagsList = []
// 		},
// 		closeTagsOther(state, data) {
// 			state.tagsList = data;
// 		},
// 		// 侧边栏折叠
// 		hadndleCollapse(state, data) {
// 			state.collapse = data;
// 		}
// 	},
// 	actions: {},
// 	modules: {}

// })
// export default store




import {createStore} from 'vuex'
const store = createStore({
  state: {
	userInfo:{
		userName:sessionStorage.getItem('username'),
		userPass:"",
		isValidate:false,
		token:""
	},
	rightList:sessionStorage.getItem('getrightList') || '[]',
  },
  getters:{
  	  token:(state)=>{
  		  return state.userInfo.token
  	  }
  },
  mutations: {
	updateUserInfo(state,user){
		const users = JSON.stringify(user);
		const use = JSON.parse(users);
		state.userInfo.userName=use.userName
		state.userInfo.userPass=use.userPwd
		state.userInfo.isValidate=true
		state.userInfo.token=use.token
		sessionStorage.setItem('state',JSON.stringify(state))
		sessionStorage.setItem("username",state.userInfo.userName)
	},
	setrightList(state,data){
		  state.rightList = data
		  sessionStorage.setItem('menulist',JSON.stringify(state.rightList))
	},
	setuserName(state,data){
		sessionStorage.setItem('username',data);
	}
  },
})
export default store
