<template>
	<div style="float: right;bottom: 10px;">
		<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" style="width: 110px;" @click="dialogFormVisible = true">新增</el-button>
	</div>
	<el-table :data="SessionData" border style="width: 100%" class="e1">
		<el-table-column prop="sessionId" label="编号" width="60">
		</el-table-column>
		<el-table-column prop="sessionName" label="学期名称">
		</el-table-column>
		<el-table-column label="操作" width="150">
			<template #default="scope">
				<el-button type="text" size="mini" @click="showEidt1(scope.row)">修改</el-button>
				<el-button type="text" size="mini" @click="deleteSession(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>


	<el-dialog title="新增年届信息" v-model="dialogFormVisible" class="di1">
		<el-form :model="form">
			<el-form-item label="年届名称 :" :label-width="formLabelWidth">
				<el-input v-model="form.sessionName" autocomplete="off" style="width: 530px;"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addsession">保 存</el-button>
				<el-button @click="dialogFormVisible = false">关 闭</el-button>

			</span>
		</template>
	</el-dialog>

	<el-dialog title="修改学期信息" v-model="dialogFormVisible2" class="di2">
		<el-form :model="form">
			<el-form-item label="学期名称 :" :label-width="formLabelWidth">
				<el-input v-model="form.sessionName" autocomplete="off" style="width: 530px;"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="updatesession">保 存</el-button>
				<el-button @click="dialogFormVisible2 = false">关 闭</el-button>

			</span>
		</template>

	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				SessionData: [],
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					sessionId: '',
					sessionName: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				formLabelWidth: '120px'
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectSession")
				.then(function(response) {
					console.log(response)
					_this.SessionData = response.data
				}).catch(function(error) {
					console.log(error)
				})

		},
		methods: {
			addsession() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertsession", this.form)
					.then(function(response) {
						console.log("111")
						console.log(response)
						var session = response.data
						_this.SessionData.push(session)
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEidt1(row) {
				this.form.sessionId = row.sessionId
				this.form.sessionName = row.sessionName
				this.dialogFormVisible2 = true
			},
			deleteSession(row) {
				const _this = this
				this.form.sessionId = row.sessionId
				this.form.sessionName = row.sessionName
				this.axios.put("http://localhost:8089/tsm/delectsession", this.form)
					.then(function(response) {
						console.log(response)
						console.log(response.data.sessionId)
						var rows = _this.SessionData
							.filter(d => d.sessionId != row.sessionId)
						_this.SessionData = rows
						_this.pageInfo.total = _this.pageInfo.total - 1

						_this.dialogFormVisible2 = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			updatesession() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updatesession", this.form)
					.then(function(response) {
						console.log(response)
						console.log(response.data.sessionId)
						var session = response.data
						var row = _this.SessionData.filter(s => s.sessionId == session.sessionId)[0]
						row.sessionName = session.sessionName

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
</style>
