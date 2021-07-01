<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>转班管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<input type="text" placeholder="输入关键字搜索" v-model="search" />
		<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
	</div>&nbsp;
	<div>
		<el-table :data="shiftData" border style="width: 100%">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column label="复课编号" prop="shiftId" width="80" align="center">
			</el-table-column>
			<el-table-column label="学号" prop="studentNumber" width="130" align="center">
			</el-table-column>
			<el-table-column label="原班级" prop="oldclass" width="140" align="center">
			</el-table-column>
			<el-table-column label="意向班级" prop="newclass" width="140" align="center">
			</el-table-column>
			<el-table-column label="复课时间" prop="shiftTime" width="150" align="center">
			</el-table-column>
			<el-table-column label="复课理由" prop="shiftReason" width="140" align="center">
			</el-table-column>
			<el-table-column label="复课办理人" prop="shiftHandler" width="130" align="center">
			</el-table-column>
			<el-table-column label="审核状态" prop="approval" width="140" align="center">
				<template v-slot="scope">
					<p v-if="scope.row.approval==0">未审核</p>
					<p v-if="scope.row.approval==1">已审核</p>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" align="center" width="140">
				<template #default="scope">
					<el-button @click="updateLearningstate2(scope.row)" type="text" size="small">审核通过</el-button>
					<el-button @click="deleteShift(scope.row)" type="text" size="small">删除</el-button>
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
	
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			
			deleteShift(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteShift", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							if (response.data.code == 200) {
								ElMessage.success({
									message: response.data.data,
									type: 'success'
								});
							} else if (response.data.code == 600) {
								ElMessage.error({
									message: response.data.message,
									type: 'success'
								});
								_this.$router.push({
									path: '/login'
								})
							} else if (response.data.code == '601') {
								ElMessage.error({
									message: response.data.message,
									type: 'success'
								});
							} else {
								ElMessage.error({
									message: response.data.message,
									type: 'success'
								});
							}
							console.log(response)
							var rows = _this.shiftData
								.filter(s => s.shiftId != row.shiftId)
							_this.shiftData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消删除!'
					})
				})
			},
			updateLearningstate2(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将审批学员, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					console.log(row);
					this.axios.put("http://localhost:8089/tsm/updateLearningstate2", row.courserecorddetailsVo, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							
						}).catch(function(error) {
							console.log(error)
						})
						this.axios.put("http://localhost:8089/tsm/appShift_Approval1", row, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							}).then(function(response) {
							console.log(response)
							
						})
						
						this.axios.put("http://localhost:8089/tsm/updatecourserecorddetails", row, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							}).then(function(response) {
								
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
							
						})
						
				
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
			
			
		},
		data() {
			return {
				shiftData: [],

				CourseRecorddetailData: [],

				courseData:[],
				ClassesData:[],

				search: '',
				dialogFormVisible3: false,
				formLabelWidth: '120px',
				pageInfo: {
					currentPage: 1,
					pagesize: 10,
					total: 0

				}

			}
		},
			created() {
				
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllShifts", {

						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo
					})
					.then(function(response) {
						console.log("+++++++++++++++++++++++++++++++++++")
						console.log(response)
						_this.shiftData = response.data.list
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
					// for(c c:as){
						
						
					// 	c.
					// }
					// for
					
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
					}).catch(function(error) {
						console.log(error)
					})
				
	}
	
	}

</script>

<style>
</style>
