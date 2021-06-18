<template>
	<div class="all" style="width: 100%;height: 100%;">
		<div class="time" style="display: flex;justify-content: center;">
			<el-input placeholder="请输入职位名称" v-model="pageInfo.what" class="input-with-select" style="width: 500px;">
				<template #append>
					<el-button icon="el-icon-search" @click="selectPositionByWhat"></el-button>
				</template>
			</el-input>
			<el-button type="primary" @click="addPositionOpen" style="margin-left: 10px;" size="small">
				添加<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" @click="selectAllPosition" style="margin-left: 10px;" size="small">
				查询所有部门<i class="el-icon-search el-icon--right"></i>
			</el-button>
			<el-button :disabled="this.multipleSelection.length === 0" @click="deletePositionMany(multipleSelection)"
				type="primary" icon="el-icon-delete" style="margin-left: 10px;" size="small"></el-button>
		</div>
		<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
			<el-table :data="positionData" border style="width: 1200px;" @selection-change="handleSelectionChange"
				ref="positionTable">
				<el-table-column type="selection" width="35" align="center">
				</el-table-column>
				<el-table-column prop="positionId" label="编号" width="100" align="center">
				</el-table-column>
				<el-table-column prop="positionName" label="部门名称" width="864" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="200" align="center">
					<template #default="scope">
						<el-button @click="updatePositionOpen(scope.row)" type="text" size="small">
							编辑
						</el-button>
						<el-button @click="deletePosition(scope.row)" type="text" size="small">
							删除
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

	<el-dialog title="添加职位信息" v-model="addPositionVisible" width="500px" top="28vh">
		<el-form :model="positionForm" :rules="rules" ref="positionForm" label-width="100px" class="demo-ruleForm"
			size="mini" label-position="right">
			<div class="addcontent" style="height: 70px;">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="职位名称">
							<el-input v-model="positionForm.positionName"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addPositionVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="addPosition" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="修改部门信息" v-model="updatePositionVisible" width="600px" top="20vh">
		<el-form :model="positionForm" :rules="rules" ref="positionForm" label-width="100px" class="demo-ruleForm"
			size="mini" label-position="right">
			<div class="addcontent" style="height: 70px;">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="部门名称">
							<el-input v-model="positionForm.positionName"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updatePositionVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="updatePosition" size="small">保存</el-button>
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
				selectCondition: '',
				updatePositionVisible: false,
				deletePositionVisible: false,
				addPositionVisible: false,
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				input3: ref(''),
				select: ref(''),
				formLabelWidth: '120px',
				positionForm: {
					positionId: '',
					positionName: '',
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
				positionData: [],
				pageInfo: {
					what: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				multipleSelection: []
			}
		},
		methods: {
			handleSelectionChange(multipleSelection) {
				this.multipleSelection = multipleSelection;
			},
			deletePositionMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.positionId).join()
				var names = this.multipleSelection.map(item => item.positionName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deletePositionMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
							params: _this.pageInfo
						}).then(function(response) {
							console.log(response)
							_this.positionData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除职位操作",
							message: "职位名称：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '删除成功'
						});
					}).catch(function(error) {
						console.log(error)
						this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					this.$refs.positionTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.positionData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
						params: this.pageInfo
					})
					.then(function(response) {
						_this.positionData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			addPositionOpen() {
				this.addPositionVisible = true
			},
			updatePositionOpen(row) {
				this.positionForm.positionId = row.positionId
				this.positionForm.positionName = row.positionName
				this.updatePositionVisible = true
			},
			deletePosition(row) {
				const _this = this
				this.positionForm.positionId = row.positionId
				this.positionForm.positionName = row.positionName
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deletePosition", this.positionForm).then(
						function(
							response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
								params: _this.pageInfo
							}).then(function(
								response) {
								console.log(response)
								_this.positionData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.$notify({
								title: "您刚刚进行了删除职位操作",
								message: "职位名称：" + _this.positionForm.positionName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							})
							for (var key in _this.positionForm) {
								delete _this.positionForm[key]
							}
						}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '删除失败'
						})
						for (var key in _this.positionForm) {
							delete _this.positionForm[key]
						}
					})
				}).catch(() => {
					for (var key in _this.positionForm) {
						delete _this.positionForm[key]
					}
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				});
			},
			selectAllPosition() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
					params: this.pageInfo
				}).then(function(
					response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.positionData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectPositionByWhat() {
				const _this = this
				if (this.pageInfo.what == null) {
					ElMessage.warning({
						message: '提醒！请输入内容进行查询！',
						type: 'warning',
						duration: '5000'
					});
				} else {
					this.axios.get("http://localhost:8089/tsm/selectPositionByName", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.positionData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				}
			},
			updatePosition() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updatePosition", this.positionForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
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
						title: "您刚刚进行了编辑职位操作",
						message: "部门名称：" + _this.positionForm.positionName,
						duration: '7000'
					})
					for (var key in _this.positionForm) {
						delete _this.positionForm[key]
					}
					_this.updatePositionVisible = false
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '修改失败'
					})
					_this.updatePositionVisible = false
					for (var key in _this.positionForm) {
						delete _this.positionForm[key]
					}
				})
			},
			addPosition() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/inserPosition", this.positionForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.positionData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: '您刚刚执行了添加职位操作',
						message: '职位名称:' + _this.positionForm.positionName,
						duration: '7000'
					})
					console.log(response)
					_this.addPositionVisible = false
					for (var key in _this.positionForm) {
						delete _this.positionForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.positionForm) {
						delete _this.positionForm[key]
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
			this.axios.get("http://localhost:8089/tsm/selectAllPositionPageInfo", {
				params: this.pageInfo
			}).then(function(
				response) {
				console.log(response)
				_this.positionData = response.data.list
				_this.pageInfo.total = response.data.total
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
		height: 200px;
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
