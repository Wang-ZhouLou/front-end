<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>部门管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div class="all" style="width: 100%;height: 100%;">
		<div class="time" style="display: flex;justify-content: center;">
			<el-input placeholder="请输入内容" v-model="pageInfo.what" class="input-with-select" style="width: 500px;">
				<template #prepend>
					<el-select v-model="selectCondition" placeholder="请选择">
						<el-option label="名称" value="1"></el-option>
						<el-option label="序列号" value="2"></el-option>
					</el-select>
				</template>
				<template #append>
					<el-button icon="el-icon-search" @click="selectDeptByWhat"></el-button>
				</template>
			</el-input>
			<el-button type="primary" @click="addDeptOpen" style="margin-left: 10px;" size="small">
				添加<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" @click="selectAllDept" style="margin-left: 10px;" size="small">
				查询所有部门<i class="el-icon-search el-icon--right"></i>
			</el-button>
			
			
			<el-button :disabled="this.multipleSelection.length === 0" @click="deleteDeptMany(multipleSelection)"
				type="primary" icon="el-icon-delete" style="margin-left: 10px;" size="small"></el-button>
		</div>
		<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
			
			<el-table :data="deptData" border style="width: 1200px;" ref="deptTable"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection"  width="55" align="center">
				</el-table-column>

				<el-table-column prop="deptId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="deptName" label="部门名称" width="321" align="center">
				</el-table-column>
				<el-table-column prop="deptSortnumber" label="序列号" width="321" align="center">
				</el-table-column>
				<el-table-column prop="superiorsDeptId" label="上级部门编号" width="321" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template #default="scope">
						<el-button @click="updateDeptOpen(scope.row)" type="text" size="small">编辑
						</el-button>
						<el-button @click="deleteDept(scope.row)" type="text" size="small">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageInfo.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>
	</div>
	
	
	
	
	

	<el-dialog title="添加部门信息" v-model="addDeptVisible" width="450px" top="27vh">
		<el-form :model="deptForm" :rules="rules" ref="deptForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="部门名称">
							<el-input v-model="deptForm.deptName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="上级部门">
							<el-select v-model="deptForm.superiorsDeptId" placeholder="请选择上级部门">
								<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
									v-for="item in deptData1">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDeptVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="addDept" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>





	<el-dialog title="修改部门信息" v-model="updateDeptVisible" width="450px" top="27vh">
		<el-form :model="deptForm" :rules="rules" ref="deptForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="部门名称">
							<el-input v-model="deptForm.deptName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="上级部门">
							<el-select v-model="deptForm.superiorsDeptId" placeholder="请选择上级部门">
								<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
									v-for="item in deptData1">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updateDeptVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="updateDept" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import {
		defineComponent,
		ref
	} from 'vue'
	import qs from 'qs'
	import {
		ElMessage
	} from 'element-plus'
	export default defineComponent({
		data() {
			return {
				oldDept: {
					oldDeptName: '',
					oldDeptSortnumber: '',
					oldSuperiorsDeptId: ''
				},
				selectCondition: '',
				updateDeptVisible: false,
				deleteDeptVisible: false,
				addDeptVisible: false,
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				input3: ref(''),
				select: ref(''),
				formLabelWidth: '120px',
				deptForm: {
					deptId: '',
					deptName: '',
					deptSortnumber: '',
					superiorsDeptId: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					deletename: '',
					deletetime: ''
				},
				rules: {
					title: [{
							required: true,
							message: '请填写标题',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 11,
							message: '长度在 1 到 11 个字符',
							trigger: 'blur'
						}
					],
					starttime: [{
						type: 'date',
						required: true,
						message: '请选择开始日期',
						trigger: 'change'
					}],
					endtime: [{
						type: 'date',
						required: true,
						message: '请选择结束日期',
						trigger: 'change'
					}],
					type: [{
						required: true,
						message: '请选择意见箱',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				deptData: [],
				deptData1: [],
				pageInfo: {
					what: '',
					currentPage: 1,
					pagesize: 3,
					total: 0
				},
				multipleSelection: []
			}
		},
		methods: {
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.deptData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.deptData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			addDeptOpen() {
				this.deptForm.deptSortnumber = "10" + ((this.deptData.length + 1).toString())
				this.addDeptVisible = true
			},
			updateDeptOpen(row) {
				this.deptForm.deptId = row.deptId
				this.deptForm.deptName = row.deptName
				this.deptForm.deptSortnumber = row.deptSortnumber
				this.deptForm.superiorsDeptId = row.superiorsDeptId
				this.updateDeptVisible = true
			},
			handleSelectionChange(multipleSelection) {
				this.multipleSelection = multipleSelection;
			},
			deleteDeptMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.deptId).join()
				var names = this.multipleSelection.map(item => item.deptName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteDeptMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
							params: _this.pageInfo
						}).then(function(response) {
							console.log(response)
							_this.deptData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除部门操作",
							message: "单位名称：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '删除成功'
						})
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'success',
							message: '删除失败'
						})
					})
				}).catch(() => {
					this.$refs.deptTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectAllDept() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
					params: this.pageInfo
				}).then(function(
					response) {
					console.log(response)
					_this.deptData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectDeptByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectDeptByName", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.deptData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectDeptBySortnumber", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.deptData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else {
					_this.pageInfo.what = ""
					ElMessage.warning({
						message: '提醒！请选择条件进行查询！',
						type: 'warning',
						duration: '5000'
					});
				}
			},
			deleteDept(row) {
				const _this = this
				this.deptForm.deptId = row.deptId
				this.deptForm.deptName = row.deptName
				this.deptForm.deptSortnumber = row.deptSortnumber
				this.deleteDeptVisible = true
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteDept", this.deptForm).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
							params: _this.pageInfo
						}).then(function(
							response) {
							console.log(response)
							_this.deptData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$message({
							type: 'success',
							message: '删除成功'
						})
						_this.$notify({
							title: "您刚刚进行了删除部门操作",
							message: "部门名称：" + _this.deptForm.deptName + " " +
								'序列号：' +
								_this.deptForm
								.deptSortnumber,
							duration: '7000'
						})
						for (var key in _this.deptForm) {
							delete _this.deptForm[key]
						}
					}).catch(function(error) {
						console.log(error)
						for (var key in _this.deptForm) {
							delete _this.deptForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.deptForm) {
						delete _this.deptForm[key]
					}
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			updateDept() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateDept", this.deptForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.deptData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '修改成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑部门操作",
						message: "部门名称：" + _this.deptForm.deptName + " " + '序列号：' + _this.deptForm
							.deptSortnumber,
						duration: '7000'
					})
					_this.updateDeptVisible = false
					for (var key in _this.deptForm) {
						delete _this.deptForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.deptForm) {
						delete _this.deptForm[key]
					}
					_this.$message({
						type: 'info',
						message: '修改失败'
					})
				})
			},
			addDept() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertDept", this.deptForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.deptData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					console.log(response)
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: '您刚刚执行了添加部门操作',
						message: '部门名称:' + _this.deptForm.deptName,
						duration: '7000'
					})
					_this.addDeptVisible = false
					for (var key in _this.deptForm) {
						delete _this.deptForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.deptForm) {
						delete _this.deptForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})	
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllDeptPageInfo", {
				params: this.pageInfo,
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(
				response) {
				console.log(response)
				_this.deptData = response.data.list
				_this.pageInfo.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllDept").then(function(
				response) {
				console.log(response)
				_this.deptData1 = response.data
			}).catch(function(error) {
				console.log(error)
			})

		}
	})
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
		height: 150px;
		display: flex;
		justify-content: center;
	}

	.addcontent1 {
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
