import {createStore} from 'vuex'
const store = createStore({
  state: {
	userInfo:{
		id:0,
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
		if(user == null){
			state.userInfo.id=null
			state.userInfo.userName=null
			state.userInfo.isValidate=false
			state.userInfo.token=null
			sessionStorage.setItem('state',JSON.stringify(null))
			sessionStorage.setItem("username",null)
			return;
		}
		const users = JSON.stringify(user);
		const use = JSON.parse(users);
		state.userInfo.userName=use.userName
		//state.userInfo.userPass=use.userPwd
		state.userInfo.isValidate=true
		state.userInfo.token=use.token
		state.userInfo.id=use.id
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
