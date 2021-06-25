<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>我的意见</el-breadcrumb-item>
	</el-breadcrumb><br>
	<el-tabs type="border-card">
		<el-tab-pane label="收到意见">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="pageInfo1.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition1" placeholder="请选择">
								<el-option label="意见标题" value="1"></el-option>
								<el-option label="发布人" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="selectIdeasByWhat1" icon="el-icon-search" size="small"></el-button>
						</template>
					</el-input>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasBySuggestAndState1"
						size="small">
						查看已回复意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasBySuggestAndState2"
						size="small">
						查看未回复意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasBySuggestAll" size="small">
						查看所有意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection1.length === 0"
						@click="noLookIdeasMany(multipleSelection1)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="ideasData" border style="width: 1200px" @selection-change="handleSelectionChange1"
						ref="ideasTable">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column prop="suggest.suggestName" label="意见箱" width="213" align="center">
						</el-table-column>
						<el-table-column prop="ideasTitle" label="意见标题" width="213" align="center">
						</el-table-column>
						<!-- <el-table-column prop="name" label="意见内容" width="213" align="center">
							<template v-slot="scope">
								<el-tooltip class="item" effect="light" :content="scope.row.name" placement="top-end" align="center">
									<span class="one-txt-cut"
										style="width:213px;display:block;text-align: center;">{{scope.row.name}}</span>
								</el-tooltip>
							</template>
						</el-table-column> -->
						<el-table-column prop="timeofpublication" label="发表时间" width="213" align="center">
						</el-table-column>
						<el-table-column prop="emp.empName" label="发布意见人" width="213" align="center">
						</el-table-column>
						<el-table-column prop="state" label="状态" width="212" align="center">
							<template v-slot="scope">
								<p v-if="scope.row.state==0">未回复</p>
								<p v-if="scope.row.state==1">已回复</p>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="100" align="center">
							<template #default="scope">
								<el-button @click="replyIdeasOpen(scope.row)" type="text" size="small">回复</el-button>
								<el-button @click="noLookIdeas(scope.row)" type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
						:current-page="pageInfo1.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo1.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="回复意见" v-model="replyIdeasVisible" width="600px" top="2vh">
				<el-form :model="ideasForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="意见标题">
									<el-input v-model="ideasForm.ideasTitle" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="意见箱">
									<el-select v-model="ideasForm.suggestId" placeholder="请选择意见箱" disabled="true">
										<el-option v-for="item in suggestData" :key="item.suggestId"
											:label="item.suggestName" :value="item.suggestId"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="意见内容">
									<el-input type="textarea" v-model="ideasForm.ideasName" :rows="7" disabled="true">
									</el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="回复人" style="margin-top: 125px;">
									<el-input v-model="ideasForm.reply" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="回复内容">
									<el-input type="textarea" v-model="ideasForm.revoveryname" :rows="7"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="replyIdeasVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="replyIdeas" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>
		<el-tab-pane label="发出意见">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="pageInfo2.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition2" placeholder="请选择">
								<el-option label="意见标题" value="1"></el-option>
								<el-option label="回复人" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="selectIdeasByWhat2" icon="el-icon-search" size="small"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addIdeasVisible = true" style="margin-left: 10px;" size="small">
						发表意见<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasByEmpIdAndState1"
						size="small">
						查看已回复意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasByEmpIdAndState2"
						size="small">
						查看未回复意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;" @click="selectIdeasByEmpIdAll" size="small">
						查看所有意见<i class="el-icon-user-solid el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection1.length === 0"
						@click="deleteIdeasMany(multipleSelection1)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="setIdeasData" border style="width: 1200px"
						@selection-change="handleSelectionChange1" ref="setIdeasTable">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column prop="suggest.suggestName" label="意见箱" width="213" align="center">
						</el-table-column>
						<el-table-column prop="ideasTitle" label="意见标题" width="213" align="center">
						</el-table-column>
						<el-table-column prop="timeofpublication" label="发表时间" width="213" align="center">
						</el-table-column>
						<el-table-column prop="reply" label="回复人" width="213" align="center">
						</el-table-column>
						<el-table-column prop="state" label="状态" width="212" align="center">
							<template v-slot="scope">
								<p v-if="scope.row.state==0">未回复</p>
								<p v-if="scope.row.state==1">已回复</p>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="100" align="center">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
								<el-button @click="deleteIdeas(scope.row)" type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
						:current-page="pageInfo2.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo2.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo2.total">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-dialog title="发表意见" v-model="addIdeasVisible" width="600px">
			<el-form :model="ideasForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
				size="mini" label-position="right">
				<div class="addcontent" style="height: 300px;">
					<div class="addcontent1">
						<div class="addcontent_line">
							<el-form-item label="意见标题">
								<el-input v-model="ideasForm.ideasTitle"></el-input>
							</el-form-item>
						</div>
						<div class="addcontent_line">
							<el-form-item label="意见箱">
								<el-select v-model="ideasForm.suggestId" placeholder="请选择意见箱">
									<el-option v-for="item in suggestData" :key="item.suggestId"
										:label="item.suggestName" :value="item.suggestId"></el-option>
								</el-select>
							</el-form-item>
						</div>
						<div class="addcontent_line">
							<el-form-item label="意见内容">
								<el-input type="textarea" v-model="ideasForm.ideasName" :rows="7"></el-input>
							</el-form-item>
						</div>
					</div>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addIdeasVisible = false" size="small">关闭</el-button>
					<el-button type="primary" @click="addIdeas" size="small">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</el-tabs>
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
				selectCondition1: '',
				selectCondition2: '',
				ideasForm: {
					ideasId: '',
					suggest: '',
					suggestId: '',
					emp: '',
					empId: '',
					empName: '',
					ideasTitle: '',
					ideasName: '',
					state: '',
					reply: '',
					revoverytime: '',
					revoveryname: '',
					timeofpublication: '',
					deletename: '',
					deletetime: '',
					timeliness: ''
				},
				input3: ref(''),
				select: ref(''),
				replyIdeasVisible: false,
				addIdeasVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				ideasData: [],
				suggestData: [],
				setIdeasData: [],
				login: {
					loginName: '',
					loginId: '',
					loginDept: ''
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
					type: [{
						required: true,
						message: '请选择意见箱',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				pageInfo1: {
					state: '',
					what: '',
					empId: '',
					suggestId: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				pageInfo2: {
					state: '',
					what: '',
					empId: '',
					suggestId: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				multipleSelection1: [],
				multipleSelection2: []
			}
		},
		methods: {
			handleSelectionChange1(multipleSelection1) {
				this.multipleSelection1 = multipleSelection1;
			},
			noLookIdeasMany() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				var ids = this.multipleSelection1.map(item => item.ideasId).join()
				var names = this.multipleSelection1.map(item => item.ideasTitle).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/noLookIdeasMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.ideasData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除意见操作",
							message: "意见标题：" + names,
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
					this.$refs.ideasTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSelectionChange2(multipleSelection2) {
				this.multipleSelection2 = multipleSelection2;
			},
			deleteIdeasMany() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				var ids = this.multipleSelection2.map(item => item.ideasId).join()
				var names = this.multipleSelection2.map(item => item.ideasTitle).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteIdeasMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
							params: _this.pageInfo2
						}).then(function(response) {
							console.log(response)
							_this.setIdeasData = response.data.list
							_this.pageInfo2.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除意见操作",
							message: "意见标题：" + names,
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
					this.$refs.setIdeasTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			noLookIdeas(row) {
				const _this = this
				this.ideasForm.ideasId = row.ideasId
				this.ideasForm.ideasTitle = row.ideasTitle
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/noLookIdeas", this.ideasForm).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
								params: _this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.ideasData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.ideasForm) {
								delete _this.ideasForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除意见操作",
								message: "意见标题：" + _this.ideasForm.ideasTitle,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.ideasForm) {
							delete _this.ideasForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectIdeasBySuggestAndState1() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.pageInfo1.state = 1
				this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggestAndState", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.ideasData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasBySuggestAndState2() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.pageInfo1.state = 0
				this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggestAndState", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.ideasData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasBySuggestAll() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.ideasData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasByEmpIdAndState1() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.pageInfo2.state = 1
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpIdAndState", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.setIdeasData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasByEmpIdAndState2() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.pageInfo2.state = 0
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpIdAndState", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.setIdeasData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasByEmpIdAll() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.setIdeasData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectIdeasByWhat1() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				if (this.selectCondition1 == 1) {
					this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggestAndTitle", {
						params: this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.ideasData = response.data.list
						_this.pageInfo1.total = response.data.total
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition1 == 2) {
					this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggestAndEmpName", {
						params: this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.ideasData = response.data.list
						_this.pageInfo1.total = response.data.total
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else {
					_this.pageInfo1.what = ""
					ElMessage.warning({
						message: '提醒！请选择条件进行查询！',
						type: 'warning',
						duration: '7000'
					});
				}
			},
			selectIdeasByWhat2() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				if (this.selectCondition2 == 1) {
					this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpIdAndTitle", {
						params: this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.setIdeasData = response.data.list
						_this.pageInfo2.total = response.data.total
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition2 == 2) {
					this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpIdAndReply", {
						params: this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.setIdeasData = response.data.list
						_this.pageInfo2.total = response.data.total
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else {
					_this.pageInfo2.what = ""
					ElMessage.warning({
						message: '提醒！请选择条件进行查询！',
						type: 'warning',
						duration: '7000'
					});
				}
			},
			replyIdeasOpen(row) {
				this.login.loginId = 6
				this.ideasForm.empName = "梁政"
				this.pageInfo1.empId = this.login.loginId
				this.ideasForm.ideasId = row.ideasId
				this.ideasForm.suggestId = row.suggestId
				this.ideasForm.ideasTitle = row.ideasTitle
				this.ideasForm.ideasName = row.ideasName
				this.ideasForm.reply = this.ideasForm.empName
				this.replyIdeasVisible = true
			},
			replyIdeas() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/replyIdeas", this.ideasForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.ideasData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '回复成功'
					})
					_this.$notify({
						title: "您刚刚进行了回复意见箱操作",
						message: "意见标题：" + _this.ideasForm.ideasTitle,
						duration: '7000'
					})
					_this.replyIdeasVisible = false
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
					_this.$message({
						type: 'info',
						message: '回复失败'
					});
				})
			},
			addIdeas() {
				const _this = this
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.pageInfo2.empId = this.login.loginId
				this.ideasForm.empId = this.login.loginId
				this.axios.post("http://localhost:8089/tsm/insertIdeas", this.ideasForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.setIdeasData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.ideasData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了发布意见操作",
						message: "意见标题：" + _this.ideasForm.ideasTitle,
						duration: '7000'
					})
					_this.addIdeasVisible = false
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})
			},
			deleteIdeas(row) {
				const _this = this
				this.login.loginId = 6
				this.login.loginName = "梁政"
				this.pageInfo1.empId = this.login.loginId
				this.pageInfo2.empId = this.login.loginId
				this.ideasForm.ideasId = row.ideasId
				this.ideasForm.deletename = this.login.loginName
				this.$confirm('您将删除此条信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteIdeas", this.ideasForm).then(
						function(
							response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
								params: _this.pageInfo2
							}).then(function(response) {
								console.log(response)
								_this.setIdeasData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
								params: this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.ideasData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.$notify({
								title: "您刚刚进行了删除意见操作",
								message: "意见标题：" + _this.ideasForm.ideasTitle,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
							for (var key in _this.ideasForm) {
								delete _this.ideasForm[key]
							}
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.ideasForm) {
							delete _this.ideasForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.ideasForm) {
						delete _this.ideasForm[key]
					}
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSizeChange1(pagesize) {
				var _this = this
				this.pageInfo1.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo1)
				console.log(ps)
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
						params: this.pageInfo1
					})
					.then(function(response) {
						console.log(response.data)
						_this.ideasData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange1(currentPage) {
				var _this = this
				this.pageInfo1.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
				this.login.loginId = 6
				this.pageInfo1.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
						params: this.pageInfo1
					})
					.then(function(response) {
						_this.ideasData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange2(pagesize) {
				var _this = this
				this.pageInfo2.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo2)
				console.log(ps)
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
						params: this.pageInfo2
					})
					.then(function(response) {
						console.log(response.data)
						_this.setIdeasData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange2(currentPage) {
				var _this = this
				this.pageInfo2.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo2) // eslint-disable-line no-unused-vars
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
						params: this.pageInfo2
					})
					.then(function(response) {
						_this.setIdeasData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectSetIdeas() {
				var _this = this
				this.login.loginId = 6
				this.pageInfo2.empId = this.login.loginId
				this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.setIdeasData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			}
		},
		created() {
			const _this = this
			this.login.loginId = 6
			this.pageInfo1.empId = this.login.loginId
			this.axios.get("http://localhost:8089/tsm/selectIdeasBySuggest", {
				params: this.pageInfo1
			}).then(function(response) {
				console.log(response)
				_this.ideasData = response.data.list
				_this.pageInfo1.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.login.loginId = 6
			this.pageInfo2.empId = this.login.loginId
			this.axios.get("http://localhost:8089/tsm/selectIdeasByEmpId", {
				params: this.pageInfo2
			}).then(function(response) {
				console.log(response)
				_this.setIdeasData = response.data.list
				_this.pageInfo2.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllSuggest").then(function(response) {
				console.log(response)
				_this.suggestData = response.data
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
		width: 550px;
		height: 520px;
		display: flex;
		justify-content: center;
	}

	.addcontent1 {
		width: 100%;
	}

	.addcontent_line {
		width: 100%;
		height: 65px;
	}

	/* .one-txt-cut {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	} */
</style>
