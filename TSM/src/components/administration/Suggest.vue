<template>
	<div class="all" style="width: 100%;height: 100%;">
		<div class="time" style="display: flex;justify-content: center;">
			<el-input placeholder="请输入内容" v-model="pageInfo.what" class="input-with-select" style="width: 500px;">
				<template #prepend>
					<el-select v-model="selectCondition" placeholder="请选择">
						<el-option label="意见箱名称" value="1"></el-option>
						<el-option label="所属部门" value="2"></el-option>
					</el-select>
				</template>
				<template #append>
					<el-button @click="selectSuggestByWhat" icon="el-icon-search"></el-button>
				</template>
			</el-input>
			<el-button type="primary" @click="addSuggestVisible = true" style="margin-left: 10px;" size="small">
				添加<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" @click="selectAllSuggest" style="margin-left: 10px;" size="small">
				查看所有意见箱<i class="el-icon-search el-icon--right"></i>
			</el-button>
			<el-button :disabled="this.multipleSelection.length === 0" @click="deleteSuggestMany(multipleSelection)"
				type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
		</div>
		<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
			<el-table :data="suggestData" border style="width: 1200px" @selection-change="handleSelectionChange"
				ref="suggestTable">
				<el-table-column type="selection" width="35" align="center">
				</el-table-column>
				<el-table-column prop="suggestId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="suggestName" label="意见箱名称" width="241.25" align="center">
				</el-table-column>
				<el-table-column prop="dept.deptName" label="所属部门" width="241.25" align="center">
				</el-table-column>
				<el-table-column prop="suggestState" label="状态" width="241.25" align="center">
					<template v-slot="scope">
						<p v-if="scope.row.suggestState==0">可用</p>
						<p v-if="scope.row.suggestState==1">停用</p>
					</template>
				</el-table-column>
				<el-table-column prop="suggestRemarks" label="备注" width="241.25">
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150">
					<template #default="scope">
						<el-button v-if="scope.row.suggestState==0" @click="stopSuggestState(scope.row)" type="text"
							size="small" style="color: red;">停用</el-button>
						<el-button v-if="scope.row.suggestState==1" @click="goSuggestState(scope.row)" type="text"
							size="small" style="color: green;">启用</el-button>
						<el-button @click="updateSuggestOpen(scope.row)" type="text" size="small">修改</el-button>
						<el-button @click="deleteSuggest(scope.row)" type="text" size="small">删除</el-button>
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

	<el-dialog title="添加意见箱" v-model="addSuggestVisible" width="500px" top="24vh">
		<el-form :model="suggestForm" :rules="rules" ref="suggestForm" label-width="100px" class="demo-ruleForm"
			size="mini" label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="意见箱名称" prop="title">
							<el-input v-model="suggestForm.suggestName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="部门" prop="type">
							<el-select v-model="suggestForm.deptId" placeholder="请选择部门">
								<el-option v-for="item in deptData" :key="item.deptId" :label="item.deptName"
									:value="item.deptId"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="备注" prop="title">
							<el-input type="textarea" v-model="suggestForm.suggestRemarks" :rows="5"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addSuggestVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="addSuggest" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="编辑意见箱" v-model="updateSuggestVisible" width="500px" top="24vh">
		<el-form :model="suggestForm" :rules="rules" ref="suggestForm" label-width="100px" class="demo-ruleForm"
			size="mini" label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="意见箱名称" prop="title">
							<el-input v-model="suggestForm.suggestName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="部门" prop="type">
							<el-select v-model="suggestForm.deptId" placeholder="请选择部门">
								<el-option v-for="item in deptData" :key="item.deptId" :label="item.deptName"
									:value="item.deptId"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="备注" prop="title">
							<el-input type="textarea" v-model="suggestForm.suggestRemarks" :rows="5"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updateSuggestVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="updateSuggest" size="small">保存</el-button>
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
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				input3: ref(''),
				select: ref(''),
				updateSuggestVisible: false,
				addSuggestVisible: false,
				formLabelWidth: '120px',
				value2: "",
				pageInfo: {
					what: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				deptData: [],
				suggestData: [],
				suggestForm: {
					suggestId: '',
					suggestName: '',
					suggestRemarks: '',
					dept: '',
					deptId: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					deletename: '',
					deletetime: ''
				},
				multipleSelection: []
			}
		},
		methods: {
			stopSuggestState(row) {
				const _this = this
				this.suggestForm.suggestId = row.suggestId
				this.suggestForm.suggestName = row.suggestName
				this.$confirm('您将停用此意见箱, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSuggestState1", this.suggestForm).then(
						function(
							response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
								params: _this.pageInfo
							}).then(function(response) {
								console.log(response)
								_this.suggestData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.suggestForm) {
								delete _this.suggestForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了停用意见箱操作",
								message: "意见箱名称：" + _this.suggestForm.suggestName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '停用成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.suggestForm) {
							delete _this.suggestForm[key]
						}
						_this.$message({
							type: 'info',
							message: '停用失败'
						});
					})
				}).catch(() => {
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消停用'
					});
				});
			},
			goSuggestState(row) {
				const _this = this
				this.suggestForm.suggestId = row.suggestId
				this.suggestForm.suggestName = row.suggestName
				this.$confirm('您将启用此意见箱, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSuggestState2", this.suggestForm).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
								params: _this.pageInfo
							}).then(function(response) {
								console.log(response)
								_this.suggestData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.suggestForm) {
								delete _this.suggestForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了启用意见箱操作",
								message: "意见箱名称：" + _this.suggestForm.suggestName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '启用成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.suggestForm) {
							delete _this.suggestForm[key]
						}
						_this.$message({
							type: 'info',
							message: '启用失败'
						});
					})
				}).catch(() => {
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消启用'
					});
				});
			},
			handleSelectionChange(multipleSelection) {
				this.multipleSelection = multipleSelection;
			},
			deleteSuggestMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.suggestId).join()
				var names = this.multipleSelection.map(item => item.suggestName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSuggestMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
							params: _this.pageInfo
						}).then(function(response) {
							console.log(response)
							_this.suggestData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除意见箱操作",
							message: "意见箱名称：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '删除成功'
						});
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
					
				}).catch(() => {
					this.$refs.suggestTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectAllSuggest() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
					params: this.pageInfo
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.suggestData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectSuggestByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectSuggestByName", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.pageInfo.what = ""
						_this.suggestData = response.data.list
						_this.pageInfo.total = response.data.total
						_this.$message({
							type: 'success',
							message: '查询成功'
						});
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						});
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectSuggestByDept", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						});
						_this.pageInfo.what = ""
						_this.suggestData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						});
					})
				} else {
					_this.pageInfo.what = ""
					ElMessage.warning({
						message: '提醒！请选择条件进行查询！',
						type: 'warning',
						duration: '7000'
					});
				}
			},
			updateSuggestOpen(row) {
				this.suggestForm.suggestId = row.suggestId
				this.suggestForm.suggestName = row.suggestName
				this.suggestForm.deptId = row.deptId
				this.suggestForm.suggestRemarks = row.suggestRemarks
				this.updateSuggestVisible = true
			},
			deleteSuggest(row) {
				const _this = this
				this.suggestForm.suggestId = row.suggestId
				this.suggestForm.suggestName = row.suggestName
				this.$confirm('您将删除此条信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSuggest", this.suggestForm).then(
						function(
							response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
								params: _this.pageInfo
							}).then(function(response) {
								console.log(response)
								_this.suggestData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.suggestForm) {
								delete _this.suggestForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除意见箱操作",
								message: "意见箱名称：" + _this.suggestForm.suggestName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.suggestForm) {
							delete _this.suggestForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
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
				this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.suggestData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
						params: this.pageInfo
					})
					.then(function(response) {
						_this.suggestData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			addSuggest() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertSuggest", this.suggestForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
						params: _this.pageInfo
					}).then(function(response) {
						console.log(response)
						_this.suggestData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加意见箱操作",
						message: "意见箱名称：" + _this.suggestForm.suggestName,
						duration: '7000'
					})
					_this.addSuggestVisible = false
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})
			},
			updateSuggest() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateSuggest", this.suggestForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
						params: _this.pageInfo
					}).then(function(response) {
						console.log(response)
						_this.suggestData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '修改成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑意见箱操作",
						message: "意见箱名称：" + _this.suggestForm.suggestName,
						duration: '7000'
					})
					_this.updateSuggestVisible = false
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.suggestForm) {
						delete _this.suggestForm[key]
					}
					_this.$message({
						type: 'info',
						message: '修改失败'
					});
				})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllSuggestPageInfo", {
				params: this.pageInfo
			}).then(function(response) {
				console.log(response)
				_this.suggestData = response.data.list
				_this.pageInfo.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllDept").then(function(response) {
				console.log(response)
				_this.deptData = response.data
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
		height: 250px;
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
