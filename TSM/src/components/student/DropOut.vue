<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>退学管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<input type="text" placeholder="输入关键字搜索" v-model="search" />
		<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
	</div>&nbsp;
	<div>
		<el-table :data="dropData" border style="width: 100%">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="退学编号" prop="dropId" width="80" align="center">
			</el-table-column>
			<el-table-column label="学号" prop="studentVo.studentId" width="130" align="center">
			</el-table-column>
			<el-table-column label="课程名称" prop="courseVo.courseName" width="140" align="center">
			</el-table-column>
			<el-table-column label="班级" prop="classesVo.classesName" width="140" align="center">
			</el-table-column>
			<el-table-column label="退学时间" prop="dropRime" width="150" align="center">
			</el-table-column>
			<el-table-column label="退学理由" prop="dropReason" width="140" align="center">
			</el-table-column>
			<el-table-column label="退学办理人" prop="dropHandler" width="140" align="center">
			</el-table-column>
			<el-table-column label="退费状态" prop="ispay" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.ispay==0">未退费</p>
					<p v-if="scope.row.ispay==1">待退费</p>
					<p v-if="scope.row.ispay==2">已退费</p>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" prop="jwApproval" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.jwApproval==0">未审核</p>
					<p v-if="scope.row.jwApproval==1">已审核</p>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center" width="140">
				<template #default="scope">
					<el-button @click="updateLearningstate6(scope.row)" type="text" size="small">审核通过</el-button>
					<el-button @click="deleteDrop(scope.row)" type="text" size="small">删除</el-button>
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
	export default {
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllDrop", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.dropData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllDrop", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					})
					.then(function(response) {
						_this.dropData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			deleteDrop(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteDrop", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							var rows = _this.dropData
								.filter(a => a.dropId != row.dropId)
							_this.dropData = rows
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
			updateLearningstate6(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将审批学员, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					console.log(row.courserecorddetailsVo.courserecorddetailsId);
					_this.axios.put("http://localhost:8089/tsm/updateLearningstate6", row.courserecorddetailsVo, {
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
					this.axios.put("http://localhost:8089/tsm/updateDropJW_Approval1", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					//新增退费记录
					this.refund.dropId = row.dropId
					this.refund.courseId = row.courseId
					this.refund.detailcourseId = row.detailcourseId
					this.refund.classesId = row.classesId
					this.refund.addname = this.$store.state.userInfo.userName;
					this.axios.post("http://localhost:8089/tsm/addRefund", this.refund, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) { // eslint-disable-line no-unused-vars
							console.log(response)
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					// this.$message({
					// 	type: 'error',
					// 	message: '取消审批!'
					// });
				});
			},
			/* updateDropJW_Approval1(row) {
				const _this = this
				console.log(params)
				this.axios.put("http://localhost:8089/tsm/updateDropJW_Approval1", row, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).catch(function(error) {
					console.log(error)
				})
				_this.axios.get("http://localhost:8089/tsm/selectAllDrop", {
						params: _this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}

					})
					.then(function(response) {
						console.log("+++++++++++++++++++++++++++++++++++")
						console.log(response)
						_this.dropData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			}
 */
		},
		data() {
			return {
				dropData: [],
				CourseRecorddetailData: [],
				courseData: [],
				ClassesData: [],

				search: '',
				refund: {
					addname: "",
					dropId: "",
					courseId: "",
					classesId: "",
					detailcourseId: ""
				},
				dialogFormVisible3: false,
				formLabelWidth: '120px',
				pageInfo: {
					currentPage: 1,
					pagesize: 3,
					total: 0

				}

			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllDrop", {

					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: _this.pageInfo
				})
				.then(function(response) {
					console.log("+++++++++++++++++++++++++++++++++++")
					console.log(response)
					_this.dropData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/selectAllCourseRecorddetail", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log("+++++++++++++++++++++++++++++++++++")
					console.log(response)

					_this.CourseRecorddetailData = response.data
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/WJselAllcourse", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.courseData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.ClassesData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})

		}
	}
</script>

<style>
</style>
