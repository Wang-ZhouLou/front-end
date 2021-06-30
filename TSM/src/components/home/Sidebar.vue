<template>
	<el-aside style="width: 250px; height: 850px" class="aside">
		<div class="sidebar">
			<el-menu class="sidebar-el-menu" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff"
				:default-active="$route.path" :uniqueOpened="true" @open="handleOpen" @close="handleClose" router>
				<el-menu-item index="dashboard" class="sy">
					<span><i class="el-icon-s-shop">首页</i></span>
				</el-menu-item>

				<el-submenu :index="item.id" v-for="item in menus" :key="item.id" class="sys">
					<template #title>
						<i :class="item.icon"></i>
						<span>{{ item.menuName }}</span>
					</template>
					<el-menu-item-group>
						<template #title>
						</template>
						<el-menu-item :index="'/'+subItem.componentName" v-for="subItem in item.asideChildren"
							:key="subItem.id">
							<i :class="subItem.menuIcon"></i>
							{{ subItem.menuName }}
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</div>
	</el-aside>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "HomeView",
		data() {
			return {
				circleUrl: "",
				username: "",
				menus: [],
				imgs: "./src/components/assets/img/shous.jpeg",
				user: "",
				drawer: false,
			};
		},
		methods: {
			handleOpen(key, keyPath) {
				//console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				//console.log(key, keyPath);
			},
			usererror() {
				sessionStorage.clear();
				this.$router.push("/Login");
			},
		},
		created() {
			this.menus = this.rightList;
			// this.menus[0].childMenu[0];
			// this.circleUrl = sessionStorage.getItem("imgs");
			// this.user = sessionStorage.getItem("username");
		},
		computed: {
			...mapState(["rightList"]),
		},
	};
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;

	}

	.sidebar::-webkit-scrollbar {
		width: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;

	}

	.sidebar>ul {
		height: 100%;
	}
	.sy{
		margin-left: -165px;
	}
	.sys{
		margin-left: -120px;
	}
</style>
