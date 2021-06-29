<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>学期管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div style="float: right;bottom: 10px;">
		<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" style="width: 110px;" @click="dialogFormVisible = true">增加</el-button>
	</div>
	<el-table :data="SemData" border style="width: 100%" class="e1">
		<el-table-column prop="semesterId" label="编号" width="60">
		</el-table-column>
		<el-table-column prop="semesterName" label="学期名称">
		</el-table-column>
		<el-table-column label="操作" width="150">
			<template #default="scope">
				<el-button type="text" size="mini" @click="showEidt(scope.row)">修改</el-button>
				<el-button type="text" size="mini" @click="deleteSem(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog title="新增学期信息" v-model="dialogFormVisible" class="di1">
		<el-form :model="form">
			<el-form-item label="学期名称 :" :label-width="formLabelWidth">
				<el-input v-model="form.semesterName" autocomplete="off" style="width: 530px;"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addsem">保 存</el-button>
				<el-button @click="dialogFormVisible = false">关 闭</el-button>

			</span>
		</template>
	</el-dialog>

	<el-dialog title="修改学期信息" v-model="dialogFormVisible2" class="di2">
		<el-form :model="form">
			<el-form-item label="学期名称 :" :label-width="formLabelWidth">
				<el-input v-model="form.semesterName" autocomplete="off" style="width: 530px;"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="updatesem">保 存</el-button>
				<el-button @click="dialogFormVisible2 = false">关 闭</el-button>

			</span>
		</template>

	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				SemData: [],
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					semesterId:'',
					semesterName: ''

				},
				formLabelWidth: '120px',
			}

		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectByPrimaryKey")
				.then(function(response) {
					console.log(response)
					_this.SemData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})

		},
		methods: {
			addsem() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertSelective", this.form,{
					headers: {
											'content-type': 'application/json',
											'jwtAuth': _this.$store.getters.token
										}
				})
					.then(function(response) {
						console.log("111")
						console.log(response)
						var semester = response.data
						_this.SemData.push(semester)
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEidt(row){
				this.form.semesterId=row.semesterId
				this.form.semesterName=row.semesterName
				this.dialogFormVisible2 = true
			},
			deleteSem(row){
				const _this = this
				this.form.semesterId=row.semesterId
				this.form.semesterName=row.semesterName
				this.axios.put("http://localhost:8089/tsm/delectsem", this.form)
					.then(function(response) {
						console.log(response)
						console.log(response.data.semesterId)
						var rows = _this.SemData
							.filter(d => d.semesterId != row.semesterId)
						_this.SemData = rows
						_this.pageInfo.total = _this.pageInfo.total - 1
				
						_this.dialogFormVisible2 = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			updatesem() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updatesemester", this.form)
					.then(function(response) {
						console.log(response)
						console.log(response.data.semesterId)
						var semester = response.data
						var row = _this.SemData.filter(s => s.semesterId == semester.semesterId)[0]
						row.semesterName = semester.semesterName

						_this.dialogFormVisible2 = false
					}).catch(function(error) {
						console.log(error)
					})
			},
		}
	}
</script>

<style>
	.e1 {
		margin: 50px 0 0 0;
	}

	.e2 {
		margin: 50px 0 0 0;
	}
</style>
