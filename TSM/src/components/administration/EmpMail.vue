<template>
	<div class="all" style="width: 100%;height: 100%;">
		<div class="time" style="display: flex;justify-content: center;">
			<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
				<template #prepend>
					<el-select v-model="select" placeholder="请选择">
						<el-option label="姓名" value="1"></el-option>
						<el-option label="部门" value="2"></el-option>
						<el-option label="职位" value="3"></el-option>
						<el-option label="工号" value="4"></el-option>
						<el-option label="性别" value="5"></el-option>
					</el-select>
				</template>
				<template #append>
					<el-button icon="el-icon-search"></el-button>
				</template>
			</el-input>
		</div>
		<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
			<el-table :data="empData" border style="width: 1200px">
				<el-table-column prop="jobnumber" label="工号" width="240">
				</el-table-column>
				<el-table-column fixed="left" prop="empName" label="姓名" width="240">
				</el-table-column>
				<el-table-column prop="empPhone" label="电话" width="240">
				</el-table-column>
				<el-table-column prop="eMail" label="电子邮件" width="240">
				</el-table-column>
				<el-table-column prop="address" label="居住地址" width="240">
				</el-table-column>
				<el-table-column prop="dept.deptName" label="所在部门" width="240">
				</el-table-column>
				<el-table-column prop="position.positionName" label="职位" width="240">
				</el-table-column>
				<el-table-column prop="empSex" label="性别" width="240">
				</el-table-column>
				<el-table-column prop="birthday" label="生日" width="240">
				</el-table-column>
				<el-table-column prop="remarks" label="备注" width="240">
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageInfo.currentPage" :page-sizes="[3, 6, 9]" :page-size="pageInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {
		defineComponent
	} from 'vue'
	import qs from 'qs'
	export default defineComponent({
		data() {
			return {
				empData: [],
				deptData: [],
				positionData: [],
				pageInfo: {
					currentPage: 1,
					pagesize: 3,
					total: 0
				}
			}
		},
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.empData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: this.pageInfo
					})
					.then(function(response) {
						_this.empData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
				params: this.pageInfo
			}).then(function(
				response) {
				console.log(response)
				_this.empData = response.data.list
				_this.pageInfo.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			}), this.axios.get("http://localhost:8089/tsm/selectAllDept").then(function(response) {
				console.log(response)
				_this.deptData = response.data
			}).catch(function(error) {
				console.log(error)
			}), this.axios.get("http://localhost:8089/tsm/selectAllPosition").then(function(response) {
				console.log(response)
				_this.positionData = response.data
			}).catch(function(error) {
				console.log(error)
			})
		}
	});
</script>

<style>
	.el-select .el-input {
		width: 130px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.addcontent {
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
	}

	.addcontent1 {
		width: 400px;
	}

	.addcontent2 {
		width: 400px;
	}

	.addcontent_line {
		width: 100%;
		height: 65px;
	}

	.textarea {
		height: 155px;
	}

	.upload {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>
