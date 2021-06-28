<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>初始化密码</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div style="margin-left: -730px;">
		<p class="ksjs" style="font-size: 13px;margin: 0 0 8px -450px;">用户编码:</p>&nbsp;
		<el-input v-model="input" size="mini" placeholder="用户编码" style="width: 520px;margin-bottom: 10px;">
		</el-input><br>
		<p class="ksjs" style="font-size: 13px;margin: 0 0 8px -450px;">用户姓名:</p>&nbsp;
		<el-input v-model="input1" size="mini" placeholder="用户姓名" style="width: 520px;margin-bottom: 10px;">
		</el-input><br>
		<p class="ksjs" style="font-size: 13px;margin: 0 0 8px -450px;">新密码:</p>&nbsp;
		<el-input v-model="input2" size="mini" placeholder="新密码" style="width: 520px;margin-bottom: 10px;">
		</el-input><br>
		<p class="ksjs" style="font-size: 13px;margin: 0 0 8px -430px;">确认新密码:</p>&nbsp;
		<el-input v-model="input3" size="mini" placeholder="确认新密码" style="width: 520px;margin-bottom: 10px;">
		</el-input><br>
		<el-button style="background-color: #009688;color: white;width: 80px;margin-left: 8px;" type="text" size="mini"
			@click="dialogFormVisible = true">确认初始化
		</el-button>
	</div>

</template>

<script>
	import {
		ref
	} from 'vue'
	export default {
		methods: {

		},
		data() {
			return {
				input: ref(''),
				input1: ref(''),
				input2: ref(''),
				input3: ref('')
			}
		}
	}
</script>

<style>
</style>
