<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>复课管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<input type="text" placeholder="输入关键字搜索" v-model="search" />
		<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
	</div>&nbsp;
	<div>
		<el-dialog title="编辑停课信息" v-model="dialogFormVisible2">
			<el-form :model="form">
				<el-form-item label="停课理由" :label-width="formLabelWidth">
					<el-input v-model="form.backReason" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogFormVisible2 = false">取 消</el-button>
					<el-button type="primary" @click="updateBack()">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<el-table :data="backData" border style="width: 100%">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="复课编号" prop="backId" width="80" align="center">
			</el-table-column>
			<el-table-column label="学号" prop="studentNumber" width="130" align="center">
			</el-table-column>
			<el-table-column label="课程名称" prop="courseName" width="140" align="center">
			</el-table-column>
			<el-table-column label="班级" prop="classesName" width="140" align="center">
			</el-table-column>
			<el-table-column label="复课时间" prop="backTime" width="150" align="center">
			</el-table-column>
			<el-table-column label="复课意向" prop="intention" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.intention==0">跟班</p>
					<p v-if="scope.row.intention==1">转班</p>
				</template>
			</el-table-column>
			<el-table-column label="停课办理人" prop="backHandler" width="140" align="center">
			</el-table-column>
			<el-table-column label="审核状态" prop="backApproval" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.backApproval==0">未审核</p>
					<p v-if="scope.row.backApproval==1">已审核</p>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center" width="200">
				<template #default="scope">
					<el-button @click="updateLearningstate2(scope.row)" type="text" size="small">审核通过</el-button>
					<!-- <el-button @click="showEdit(scope.row)" type="text" size="small">修改</el-button> -->
					<el-button @click="deleteSuspend(scope.row)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>

		</el-table>&nbsp;
	</div>

	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllBack", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.backData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllBack", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						_this.backData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) {
				this.form.backReason = row.backReason
				this.dialogFormVisible2 = true
			},
			updateBack() { // eslint-disable-line no-unused-vars
				const _this = this
				this.form.updatename=this.$store.state.userInfo.userName;
				this.axios.put("http://localhost:8089/tsm/updateBack", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllBack", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
			
								params: this.pageInfo
							})
							.then(function(response) {
								_this.backData = response.data.list
								_this.pageInfo.total = response.data.total
								//console.log(_this.EnterpriseData[0])
								_this.dialogFormVisible2 = false
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			
			deleteBack(row) {
				const _this = this
				this.row.deletename=this.$store.state.userInfo.userName;
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteBack", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							var rows = _this.backData
								.filter(b => b.backId != row.backId)
							_this.backData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消删除!'
					});
				});
			},
			updateLearningstate2(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将审批学员, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					console.log(row.courserecorddetailsVo.courserecorddetailsId);
					this.axios.put("http://localhost:8089/tsm/updateLearningstate2", row.courserecorddetailsVo, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							// console.log("+++++++++++++++++++++")
							// console.log(row)

							//_this.dropData = rows
						}).catch(function(error) {
							console.log(error)
						})
						this.axios.put("http://localhost:8089/tsm/updateBack_Approval", row, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							}).then(function(response) {
							console.log(response)
							
						}).catch(function(error) {
									console.log(error)
								})
								
					this.axios.post("http://localhost:8089/tsm/addRefund", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								
								if(response.data.code==200){
									ElMessage.success({
										message: response.data.data,
										type: 'success'
									});
								}else if(response.data.code==600){
									ElMessage.error({
										message: response.data.message,
										type: 'success'
									});
									_this.$router.push({path: '/login'})
								}else if(response.data.code=='601'){
									ElMessage.error({
										message: response.data.message,
										type: 'success'
									});
								}else {
									ElMessage.error({
										message: response.data.message,
										type: 'success'
									});
								}
							}).catch(function(error) {
								console.log(error)
							})
					// this.updateSuspend_Approval1(row);

				}).catch(() => {
					// this.$message({
					// 	type: 'error',
					// 	message: '取消审批!'
					// });
				});
			},
			
		},
		data() {
			return {
				backData: [],

				CourseRecorddetailData: [],

				courseData:[],
				ClassesData:[],
				form:{
					updatename:"",
					backReason:""
				},
				search: '',
				dialogFormVisible3: false,
				dialogFormVisible2: false,
				formLabelWidth: '120px',
				pageInfo: {
					currentPage: 1,
					pagesize: 8,
					total: 0

				}

			}
		},
			created() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllBack", {

						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo
					})
					.then(function(response) {
						console.log("+++++++++++++++++++++++++++++++++++")
						console.log(response)
						_this.backData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
				// this.axios.get("http://localhost:8089/tsm/selectAllCourseRecorddetail", {
				// 	headers: {
				// 		'content-type': 'application/json',
				// 		'jwtAuth': _this.$store.getters.token
				// 	}
				// })
				// .then(function(response) {
				// 	console.log("+++++++++++++++++++++++++++++++++++")
				// 	console.log(response)

				// 	_this.CourseRecorddetailData = response.data
				// }).catch(function(error) {
				// 	console.log(error)
				// })
				// this.axios.get("http://localhost:8089/tsm/WJselAllcourse", {
				// 		headers: {
				// 			'content-type': 'application/json',
				// 			'jwtAuth': _this.$store.getters.token
				// 		}
				// 	})
				// 	.then(function(response) {
				// 		_this.courseData = response.data
				// 		console.log(response)
				// 	}).catch(function(error) {
				// 		console.log(error)
				// 	})
				// this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
				// 		headers: {
				// 			'content-type': 'application/json',
				// 			'jwtAuth': _this.$store.getters.token
				// 		}
				// 	})
				// 	.then(function(response) {
				// 		_this.ClassesData = response.data
				// 	}).catch(function(error) {
				// 		console.log(error)
				// 	})
				
	}
	
	}

</script>

<style>
</style>
