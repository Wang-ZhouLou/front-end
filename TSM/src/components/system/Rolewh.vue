<template>
	<div>
		<div>
			<font class="ksjs1" style="font-size: 13px;">所属部门:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<font class="ksjs1" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<el-button style="background-color: #009688;color: white;margin-bottom: 10px;" size="mini">查询</el-button><br>
			
			<el-button style="background-color: #5FB878;color: white;" size="mini">新增</el-button>
			<el-button style="background-color: #009688;color: white;margin-bottom: 10px;" size="mini">启用</el-button>
			<el-button style="background-color: #009688;color: white;margin-bottom: 10px;" size="mini">禁用</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" type="text" @click="open"
				size="mini">删除</el-button>
				<el-button style="background-color: #009688;color: white;" size="mini">导入</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;
		<div class="zxdj">
			<el-table :data="empData" border style="width: 1200px;" ref="empTable"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="35">
				</el-table-column>
				<el-table-column fixed="left" prop="empId" label="编号" width="50">
				</el-table-column>
				<el-table-column fixed="left" prop="empName" label="姓名" width="231">
				</el-table-column>
				<el-table-column prop="dept.deptName" label="部门" width="231">
				</el-table-column>
				<el-table-column prop="position.positionName" label="职位" width="231">
				</el-table-column>
				<el-table-column prop="jobnumber" label="工号" width="231">
				</el-table-column>
				<el-table-column prop="empstate" label="职工状态" width="231">
					<template v-slot="scope">
						<p v-if="scope.row.empstate==0">在职</p>
						<p v-if="scope.row.empstate==1">离职</p>
					</template>
				</el-table-column>
				<el-table-column prop="empSex" label="性别" width="231">
				</el-table-column>
				<el-table-column prop="empPhone" label="电话" width="231">
				</el-table-column>
				<el-table-column prop="eMail" label="电子邮件" width="231">
				</el-table-column>
				<el-table-column prop="birthday" label="生日" width="231">
				</el-table-column>
				<el-table-column prop="address" label="居住地址" width="231">
				</el-table-column>
				<el-table-column prop="education" label="教育水平" width="231">
				</el-table-column>
				<el-table-column prop="graduate" label="毕业学校" width="231">
				</el-table-column>
				<el-table-column prop="remarks" label="备注" width="231">
				</el-table-column>
				<el-table-column prop="loginstate" label="限制登录状态" width="231">
					<template v-slot="scope">
						<p v-if="scope.row.loginstate==0">不限制</p>
						<p v-if="scope.row.loginstate==1">限制</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="240">
					<template #default="scope">
						<el-button v-if="scope.row.empstate==0" @click="stopEmpStateOpen(scope.row)" type="text"
							size="small" style="color: red;">停职</el-button>
						<el-button v-if="scope.row.empstate==1" @click="goEmpStateOpen(scope.row)" type="text"
							size="small" style="color: green;">复职</el-button>
						<el-button @click="selectEmpOpen(scope.row)" type="text" size="small">查看</el-button>
						<el-button @click="updateEmpOpen(scope.row)" type="text" size="small" style="color: gold;">编辑
						</el-button>
						<el-button @click="updateDeptAndPositionOpen(scope.row)" type="text" size="small">转部门/转职位
						</el-button>
					</template>
				</el-table-column>
			
			</el-table>&nbsp;
		</div>
		

	</div>
	
	<!-- 分页 -->
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
		</div>

</template>

<script>
	import {
		ref
	} from 'vue'
	import qs from 'qs'
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleClick(row) {
				console.log(row);
			},
			open() {
				this.$confirm('确定要执行删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		data() {
			return {
				empData: [],
				deptData: [],
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 2, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				}
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
				params: this.pageInfo,
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.empData = response.data.list
				_this.pageInfo.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			//  this.axios.get("http://localhost:8089/tsm/selectAllDept").then(function(response) {
			// 	console.log(response)
			// 	_this.deptData = response.data
			// }).catch(function(error) {
			// 	console.log(error)
			// })
			// this.axios.get("http://localhost:8089/tsm/selectAllPosition").then(function(response) {
			// 	console.log(response)
			// 	_this.positionData = response.data
			// }).catch(function(error) {
			// 	console.log(error)
			// })
		}
	}
</script>

<style>
</style>
