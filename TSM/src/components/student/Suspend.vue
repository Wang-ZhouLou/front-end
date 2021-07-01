<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>停课管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<input type="text" placeholder="输入关键字搜索" v-model="search" />
		<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
	</div>&nbsp;
	<div>
		<el-table :data="suspendData" border style="width: 100%">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="停课编号" prop="suspendId" width="80" align="center">
			</el-table-column>
			<el-table-column label="学号" prop="studentNumber" width="130" align="center">
			</el-table-column>
			<el-table-column label="课程名称" prop="courseName" width="140" align="center">
			</el-table-column>
			<el-table-column label="班级" prop="classesName" width="140" align="center">
			</el-table-column>
			<el-table-column label="停课时间" prop="suspendTime" width="150" align="center">
			</el-table-column>
			<el-table-column label="停课理由" prop="suspendReason" width="140" align="center">
			</el-table-column>
			<el-table-column label="停课办理人" prop="suspendHandler" width="140" align="center">
			</el-table-column>
			<el-table-column label="审核状态" prop="suspendApproval" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.suspendApproval==0">未审核</p>
					<p v-if="scope.row.suspendApproval==1">已审核</p>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template #default="scope">
					<el-button @click="updateLearningstate4(scope.row)" type="text" size="small">审核通过</el-button>
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
	import qs from "qs"
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.suspendData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						_this.suspendData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			deleteSuspend(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteSuspend", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							var rows = _this.suspendData
								.filter(s => s.suspendId != row.suspendId)
							_this.suspendData = rows
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
			updateLearningstate4(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将审批学员, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					console.log(row.courserecorddetailsVo.courserecorddetailsId);
					this.axios.put("http://localhost:8089/tsm/updateLearningstate4", row.courserecorddetailsVo, {
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
						this.axios.put("http://localhost:8089/tsm/updateSuspend_Approval1", row, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {

						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log("+++++++++++++++++++++++++++++++++++")
						console.log(response)
						_this.suspendData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					}).then(function(response) {
							console.log(response)
							
						})
						// .catch(function(error) {
						// 			console.log(error)
						// 		})
						// 		this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {
						// 			headers: {
						// 				'content-type': 'application/json',
						// 				'jwtAuth': _this.$store.getters.token
						// 			},
						// 				params: _this.pageInfo
										
										
						// 			})
						// 			.then(function(response) {
						// 				console.log("+++++++++++++++++++++++++++++++++++")
						// 				console.log(response)
						// 				_this.suspendData = response.data.list
						// 				_this.pageInfo.total = response.data
						//			})
									.catch(function(error) {
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
			// updateSuspend_Approval1(row) {
			// 	const _this = this
			// 	console.log(params)
			// 	this.axios.put("http://localhost:8089/tsm/updateSuspend_Approval1", row, {
			// 			headers: {
			// 				'content-type': 'application/json',
			// 				'jwtAuth': _this.$store.getters.token
			// 			}
			// 		}).catch(function(error) {
			// 				console.log(error)
			// 			})
					
					// _this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {
					// 	headers: {
					// 		'content-type': 'application/json',
					// 		'jwtAuth': _this.$store.getters.token
					// 	},
					// 		params: _this.pageInfo
							
							
					// 	})
					// 	.then(function(response) {
					// 		console.log("+++++++++++++++++++++++++++++++++++")
					// 		console.log(response)
					// 		_this.suspendData = response.data.list
					// 		_this.pageInfo.total = response.data
					// 	}).catch(function(error) {
					// 		console.log(error)
					// 	})
						
			// }
			// selectAllDrop() {
				
			// }
		},
		data() {
			return {
				suspendData: [],

				CourseRecorddetailData: [],

				courseData:[],
				ClassesData:[],

				search: '',
				dialogFormVisible3: false,
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
				this.axios.get("http://localhost:8089/tsm/selectAllSuspends", {

						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log("+++++++++++++++++++++++++++++++++++")
						console.log(response)
						_this.suspendData = response.data.list
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
