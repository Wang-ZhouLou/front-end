<template>
	<div class="about">
		<v-header />
		
		<!-- <div class="content-box" :class="{ 'content-collapse': collapse }">
			<v-tags></v-tags>
			<div class="content">
				<router-view v-slot="{ Component }">
					<transition name="move" mode="out-in">
						<keep-alive :include="tagsList">
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
				<el-backtop target=".content"></el-backtop>
			</div>
		</div> -->
		<el-container >
		  <!-- 侧边栏导航菜单 -->
		  <v-sidebar />
		  <!-- 内容  -->
		  <el-main style="width: 80%; height: 830px; padding: 20px">
		    <router-view></router-view>
		  </el-main>
		</el-container>
		
	</div>
</template>
<script>
	import vHeader from "../components/home/Header.vue";
	import vSidebar from "../components/home/Sidebar.vue";
	import vTags from "../components/home/Tags.vue";
	export default {
		components: {
			vHeader,
			vSidebar,
			vTags
		}
	};
</script>



