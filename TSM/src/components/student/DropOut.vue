<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>退学管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<div>
			<input type="text" placeholder="输入关键字搜索" v-model="search" />
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
			<el-button style="background-color: #5FB878;color: white;" size="mini">审核通过</el-button>
		</div>&nbsp;
		<div>
			<el-table
				:data="dropData"
				border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column label="" prop="dropId" width="80" align="center">
				</el-table-column>
				<el-table-column label="学号" prop="courseRecorddetailVo.studentId" width="120" align="center">
				</el-table-column>
				<el-table-column label="课程名称" prop="courseRecorddetailVo.courseName" width="120" align="center">
				</el-table-column>
				<el-table-column label="班级" prop="courseRecorddetailVo.classesName" width="120" align="center">
				</el-table-column>
				<el-table-column label="退学时间" prop="dropTime" width="150" align="center">
				</el-table-column>
				<el-table-column label="退学理由" prop="dropReason" width="120" align="center">
				</el-table-column>
				<el-table-column label="退学办理人" prop="dropHandler" width="120" align="center">
				</el-table-column>
				<el-table-column label="退费状态" prop="isPay" width="120" align="center">
					<template v-slot="scope">
						<p v-if="scope.row.isPay==0">未缴费</p>
						<p v-if="scope.row.isPay==1">待缴费</p>
						<p v-if="scope.row.isPay==2">已缴费</p>
					</template>
				</el-table-column>
				<el-table-column label="审核状态" prop="jwApproval" width="120" align="center">
					<template v-slot="scope">
						<p v-if="scope.row.jwApproval==0">未审核</p>
						<p v-if="scope.row.jwApproval==1">已审核</p>
					</template>
				</el-table-column>
			</el-table>&nbsp;
			<el-pagination style="text-align: center;" background :page-size="5" layout="prev, pager, next" :total="50">
				<!-- 总条数 -->
			</el-pagination>
		</div>

	</div>

</template>

<script>
	
	export default {
		methods: {
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			}
		

		},
		data() {
			return {
				dropData: [],
				CourseRecorddetailData:[
					// courseRecorddetailVo:{}
				],
				search: '',
				dialogFormVisible3: false,
				formLabelWidth: '120px'
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllDrop", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log(response)
					_this.dropData = response.data
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
						console.log(response)
						_this.CourseRecorddetailData = response.data
					}).catch(function(error) {
						console.log(error)
					})
			
				
			}
			
			
	}
</script>

<style>
</style>
