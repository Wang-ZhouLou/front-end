<template>
	<el-tabs type="border-card">
		<el-tab-pane label="规章制度管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 100%">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="pageInfo1.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition" filterable placeholder="请选择">
								<el-option label="制度主题" value="1"></el-option>
								<el-option label="制度类型" value="2"></el-option>
								<el-option label="发文单位" value="3"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="selectSystemByWhat" icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addSystemVisible = true" style="margin-left: 10px;" size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" v-if="this.YesOrNoCondition == 1"
						:disabled="this.multipleSelection1.length === 0"
						@click="updateSystemStateGoMany(multipleSelection1)" style="margin-left: 10px;" size="small">
						发布<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" v-if="this.YesOrNoCondition == 2"
						:disabled="this.multipleSelection1.length === 0"
						@click="updateSystemStateStopMany(multipleSelection1)" style="margin-left: 10px;" size="small">
						暂停<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectSystemByStateNO" style="margin-left: 10px;" size="small">
						查看未发布的制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectSystemByStateYES" style="margin-left: 10px;" size="small">
						查看已发布的制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllSystem" style="margin-left: 10px;" size="small">
						查看所有制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection1.length === 0"
						@click="deleteSystemMany(multipleSelection1)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="systemData" border style="width: 1200px;"
						@selection-change="handleSelectionChange1" ref="systemTable">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column type="index" :index="indexMethod" width="50" align="center">
						</el-table-column>
						<el-table-column prop="systemTheme" label="制度主题" width="230" align="center"
							show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="systemtype.systemtypeName" label="制度类型" width="228" align="center">
						</el-table-column>
						<el-table-column prop="dept.deptName" label="发文单位" width="228" align="center">
						</el-table-column>
						<el-table-column prop="systemState" label="制度状态" width="228" align="center">
							<template v-slot="scope">
								<p v-if="scope.row.systemState==0">未发布</p>
								<p v-if="scope.row.systemState==1">已发布</p>
								<p v-if="scope.row.systemState==2">已暂停</p>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button v-if="scope.row.systemState==0 || scope.row.systemState==2"
									style="color: limegreen;" @click="updateSystemStateGo(scope.row)" type="text"
									size="small">发布</el-button>
								<el-button v-if="scope.row.systemState==1" style="color: red;"
									@click="updateSystemStateStop(scope.row)" type="text" size="small">暂停</el-button>
								<el-button @click="selectSystemOpen(scope.row)" type="text" size="small">查看</el-button>
								<el-button @click="updateSystemOpen(scope.row)" type="text" size="small">编辑</el-button>
								<el-button @click="deleteSystem(scope.row)" type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination"
					style="margin-top:20px ;display:flex;justify-content: center;position: absolute;width: 100%;">
					<el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
						:current-page="pageInfo1.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo1.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="添加制度" v-model="addSystemVisible" width="600px" :before-close="close" top="10vh">
				<el-form :model="systemForm" :rules="rules" ref="systemForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="制度主题">
									<el-input v-model="systemForm.systemTheme"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="发文单位">
									<el-select v-model="systemForm.deptId" filterable placeholder="请选择类型">
										<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
											v-for="item in deptData">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度类型">
									<el-select v-model="systemForm.systemtypeId" filterable placeholder="请选择类型">
										<el-option :key="item.systemtypeId" :label="item.systemtypeName"
											:value="item.systemtypeId" v-for="item in systemTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="允许查看人员">
									<el-input type="textarea" v-model="systemSelectYes" :rows="2"></el-input>
									<el-button type="primary" @click="systemSelectVisible = true"
										style="position: absolute;margin-left: 10px;margin-top: 15px;" size="small">
										<i class="el-icon-search"></i>
									</el-button>
								</el-form-item>
							</div>
							<div class="addcontent_line" style="margin-top: 15px;">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="systemForm.systemContent" :rows="7"></el-input>
								</el-form-item>
							</div>

						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="addSystem" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="提示" v-model="systemSelectVisible" width="625px" :before-close="close1">
				<el-transfer v-model="systemSelectYes" :titles="['未选择', '已选择']"
					:props="{key: 'deptId',label: 'deptName'}" :data="systemSelectNo" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close">取 消</el-button>
						<el-button type="primary" @click="systemSelectVisible = false">确 定</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="查看制度" v-model="selectSystemVisible" width="600px" :before-close="close" top="10vh">
				<el-form :model="systemForm" :rules="rules" ref="systemForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="制度主题">
									<el-input v-model="systemForm.systemTheme" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="发文单位">
									<el-select v-model="systemForm.deptId" filterable placeholder="请选择部门"
										disabled="true">
										<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
											v-for="item in deptData">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度类型">
									<el-select v-model="systemForm.systemtypeId" filterable placeholder="请选择类型"
										disabled="true">
										<el-option :key="item.systemtypeId" :label="item.systemtypeName"
											:value="item.systemtypeId" v-for="item in systemTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="允许查看人">
									<el-input v-model="systemSelectWho" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="systemForm.systemContent" :rows="7"
										disabled="true"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑制度" v-model="updateSystemVisible" width="950px" :before-close="close" top="10vh">
				<el-form :model="systemForm" :rules="rules" ref="systemForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="制度主题">
									<el-input v-model="systemForm.systemTheme"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="发文单位">
									<el-select v-model="systemForm.deptId" filterable placeholder="请选择部门">
										<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
											v-for="item in deptData">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度类型">
									<el-select v-model="systemForm.systemtypeId" filterable placeholder="请选择类型">
										<el-option :key="item.systemtypeId" :label="item.systemtypeName"
											:value="item.systemtypeId" v-for="item in systemTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="systemForm.systemContent" :rows="7"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="updateSystem" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>

		<el-tab-pane label="制度类型管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 550px;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入制度类型名称内容" v-model="pageInfo2.what" class="input-with-select"
						style="width: 500px;">
						<template #append>
							<el-button icon="el-icon-search" @click="selectSystemTypeByWhat"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addSystemTypeVisible = true" style="margin-left: 10px;"
						size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllSystemType" style="margin-left: 10px;" size="small">
						查看所有制度类型<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection2.length === 0"
						@click="deleteSystemTypeMany(multipleSelection2)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="systemTypeData" border style="width: 1200px" ref="systemTypeData"
						@selection-change="handleSelectionChange2">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column type="index" :index="indexMethod" width="100" align="center">
						</el-table-column>
						<el-table-column prop="systemtypeName" label="制度类型名称" width="864" align="center">
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button @click="updateSystemTypeOpen(scope.row)" type="text" size="small">编辑
								</el-button>
								<el-button @click="deleteSystemType(scope.row)" type="text" size="small">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination"
					style="margin-top: 30px;display:flex;justify-content: center;position: absolute;width: 100%;">
					<el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
						:current-page="pageInfo2.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo2.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo2.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="添加制度类型" v-model="addSystemTypeVisible" width="450px" top="27vh">
				<el-form :model="systemTypeForm" :rules="rules" ref="systemTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="单位类型名称">
							<el-input v-model="systemTypeForm.systemtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="addSystemType" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑制度类型" v-model="updateSystemTypeVisible" width="450px" top="27vh">
				<el-form :model="systemTypeForm" :rules="rules" ref="systemTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="编号">
							<el-input v-model="systemTypeForm.systemtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="单位类型名称">
							<el-input v-model="systemTypeForm.systemtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="updateSystemType" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

		</el-tab-pane>
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
				systemSelectWho: [],
				systemSelectYes: [],
				systemSelectNo: [],
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				selectCondition: '',
				input3: ref(''),
				select: ref(''),
				systemSelectVisible: false,
				selectSystemVisible: false,
				addSystemVisible: false,
				addSystemTypeVisible: false,
				updateSystemVisible: false,
				updateSystemTypeVisible: false,
				formLabelWidth: '120px',
				value2: "",
				systemData: [],
				systemTypeData: [],
				systemTypeData2: [],
				deptData: [],
				pageInfo1: {
					what: "",
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				pageInfo2: {
					what: "",
					currentPage: 1,
					pagesize: 6,
					total: 0
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
				multipleSelection1: [],
				multipleSelection2: [],
				systemForm: {
					systemId: '',
					systemtypeId: '',
					systemTheme: '',
					deptId: '',
					systemContent: '',
					systemState: '',
					addname: '',
					updatename: '',
					deletename: '',
					publishname: '',
					suspendname: ''
				},
				systemTypeForm: {
					systemtypeId: '',
					systemtypeName: '',
					addname: '',
					updatename: '',
					deletename: ''
				},
				login: {
					loginName: '',
					loginId: '',
					loginDept: ''
				},
				YesOrNoCondition: ''
			}
		},
		methods: {
			indexMethod(index) {
				return index + 1;
			},
			selectAllSystemType() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.systemTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectSystemTypeByWhat() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectSystemTypeByName", {
					params: this.pageInfo2
				}).then(function(
					response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.pageInfo2.what = ""
					_this.systemTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectSystemByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectSystemByTheme", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.systemData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectSystemByType", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.systemData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "3") {
					this.axios.get("http://localhost:8089/tsm/selectSystemByDept", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.systemData = response.data.list
						_this.pageInfo1.total = response.data.total
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
			handleSelectionChange1(multipleSelection1) {
				this.multipleSelection1 = multipleSelection1;
			},
			handleSelectionChange2(multipleSelection2) {
				this.multipleSelection2 = multipleSelection2;
			},
			deleteSystemMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.systemId).join()
				var names = this.multipleSelection1.map(item => item.systemTheme).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSystemMany/" + ids + "/" +
						updatename).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.systemData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除制度操作",
							message: "制度主题：" + names,
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
					this.$refs.systemTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deleteSystemTypeMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection2.map(item => item.systemtypeId).join()
				var names = this.multipleSelection2.map(item => item.systemtypeName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSystemTypeMany/" + ids + "/" +
						updatename).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
							params: _this.pageInfo2
						}).then(function(response) {
							console.log(response)
							_this.systemTypeData = response.data.list
							_this.pageInfo2.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除制度类型操作",
							message: "制度类型名称：" + names,
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
					this.$refs.systemTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			updateSystemStateStopMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.systemId).join()
				var names = this.multipleSelection1.map(item => item.systemTheme).join()
				this.$confirm('您将暂停选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSystemStateStopMany/" + ids + "/" +
						updatename).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectSystemByStateYES", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.systemData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了暂停制度操作",
							message: "制度主题：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '暂停成功'
						});
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '暂停失败'
						});
					})
				}).catch(() => {
					this.$refs.systemTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			updateSystemStateGoMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.systemId).join()
				var names = this.multipleSelection1.map(item => item.systemTheme).join()
				this.$confirm('您将发布选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSystemStateGoMany/" + ids + "/" +
						updatename).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectSystemByStateNO)", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.systemData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了发布制度操作",
							message: "制度主题：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '发布成功'
						});
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '发布失败'
						});
					})
				}).catch(() => {
					this.$refs.systemTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消发布'
					});
				});
			},
			selectSystemByStateNO() {
				const _this = this
				this.YesOrNoCondition = 1
				this.axios.get("http://localhost:8089/tsm/selectSystemByStateNO", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.systemData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectSystemByStateYES() {
				const _this = this
				this.YesOrNoCondition = 2
				this.axios.get("http://localhost:8089/tsm/selectSystemByStateYES", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.systemData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectAllSystem() {
				const _this = this
				this.YesOrNoCondition = 0
				this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.systemData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			deleteSystem(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.systemForm.deletename = this.login.loginName
				this.systemForm.systemId = row.systemId
				this.systemForm.systemTheme = row.systemTheme
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSystem", this.systemForm).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
								params: _this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.systemData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.systemForm) {
								delete _this.systemForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除制度操作",
								message: "制度主题：" + _this.systemForm.systemTheme,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.systemForm) {
							delete _this.systemForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.systemForm) {
						delete _this.systemForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deleteSystemType(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.systemTypeForm.deletename = this.login.loginName
				this.systemTypeForm.systemtypeId = row.systemtypeId
				this.systemTypeForm.systemtypeName = row.systemtypeName
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteSystemType", this.systemTypeForm).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
								params: _this.pageInfo2
							}).then(function(response) {
								console.log(response)
								_this.systemTypeData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.systemTypeForm) {
								delete _this.systemTypeForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除制度类型操作",
								message: "制度类型名称：" + _this.systemTypeForm.systemtypeName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.systemTypeForm) {
							delete _this.systemTypeForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			updateSystemOpen(row) {
				this.systemForm.systemId = row.systemId
				this.systemForm.systemTheme = row.systemTheme
				this.systemForm.systemContent = row.systemContent
				this.systemForm.deptId = row.deptId
				this.systemForm.systemtypeId = row.systemtypeId
				this.updateSystemVisible = true
			},
			updateSystemTypeOpen(row) {
				this.systemTypeForm.systemtypeId = row.systemtypeId
				this.systemTypeForm.systemtypeName = row.systemtypeName
				this.updateSystemTypeVisible = true
			},
			selectSystemOpen(row) {
				const _this = this
				this.systemForm.systemId = row.systemId
				this.systemForm.systemTheme = row.systemTheme
				this.systemForm.systemContent = row.systemContent
				this.systemForm.deptId = row.deptId
				this.systemForm.systemtypeId = row.systemtypeId
				this.axios.get("http://localhost:8089/tsm/selectEmpIdBySystemId/" + this.systemForm
						.systemId)
					.then(function(response) {
						console.log(response)
						_this.systemSelectWho = response.data
					}).catch(function(error) {
						console.log(error)
					})
				this.selectSystemVisible = true
			},
			close() {
				this.systemSelectVisible = false
				this.selectSystemVisible = false
				this.addSystemVisible = false
				this.updateSystemVisible = false
				this.addSystemTypeVisible = false
				this.updateSystemTypeVisible = false
				for (var key in this.systemForm) {
					delete this.systemForm[key]
				}
				for (var key1 in this.systemTypeForm) {
					delete this.systemTypeForm[key1]
				}
				this.$message({
					type: 'info',
					message: '已取消操作'
				});
			},
			close1() {
				this.systemSelectVisible = false
				this.$message({
					type: 'info',
					message: '已取消操作'
				});
			},
			handleSizeChange1(pagesize) {
				var _this = this
				this.pageInfo1.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo1)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
						params: this.pageInfo1
					})
					.then(function(response) {
						console.log(response.data)
						_this.systemData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange1(currentPage) {
				var _this = this
				this.pageInfo1.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
						params: this.pageInfo1
					})
					.then(function(response) {
						_this.systemData = response.data.list
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
				this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
						params: this.pageInfo2
					})
					.then(function(response) {
						console.log(response.data)
						_this.systemTypeData = response.data.list
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
				this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
						params: this.pageInfo2
					})
					.then(function(response) {
						_this.systemTypeData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			updateSystem() {
				const _this = this
				this.login.loginName = "梁政"
				this.systemForm.updatename = this.login.loginName
				this.axios.put("http://localhost:8089/tsm/updateSystemTypeName", this.systemTypeForm).then(
					function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
							params: _this.pageInfo2
						}).then(function(response) {
							console.log(response)
							_this.systemTypeData = response.data.list
							_this.pageInfo2.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$message({
							type: 'success',
							message: '编辑成功'
						})
						_this.$notify({
							title: "您刚刚进行了编辑制度类型操作",
							message: "制度类型名称：" + _this.systemTypeForm.systemtypeName,
							duration: '7000'
						})
						_this.updateSystemTypeVisible = false
						for (var key in _this.systemTypeForm) {
							delete _this.systemTypeForm[key]
						}
					}).catch(function(error) {
					console.log(error)
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '编辑失败'
					});
				})
			},
			updateSystemType() {
				const _this = this
				this.login.loginName = "梁政"
				this.systemTypeForm.updatename = this.login.loginName
				this.axios.put("http://localhost:8089/tsm/updateSystemType", this.systemTypeForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.systemTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '编辑成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑制度类型操作",
						message: "制度类型名称：" + _this.systemTypeForm.systemtypeName,
						duration: '7000'
					})
					_this.updateSystemTypeVisible = false
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '编辑失败'
					});
				})
			},
			updateSystemStateGo(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.systemForm.systemId = row.systemId
				this.systemForm.systemTheme = row.systemTheme
				this.systemForm.publishname = this.login.loginName
				this.$confirm('您将发布此制度, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSystemStateGo", this.systemForm).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
								params: _this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.systemData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.$notify({
								title: "您刚刚进行了发布制度操作",
								message: "制度主题：" + _this.systemForm.systemTheme,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '发布成功'
							});
							for (var key in _this.systemForm) {
								delete _this.systemForm[key]
							}
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.systemForm) {
							delete _this.systemForm[key]
						}
						_this.$message({
							type: 'info',
							message: '发布失败'
						});
					})
				}).catch(() => {
					for (var key in _this.systemForm) {
						delete _this.systemForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消发布'
					});
				});
			},
			updateSystemStateStop(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.systemForm.systemId = row.systemId
				this.systemForm.systemTheme = row.systemTheme
				this.systemForm.suspendname = this.login.loginName
				this.$confirm('您将暂停此制度, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateSystemStateStop", this.systemForm)
						.then(
							function(response) {
								console.log(response)
								_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
									params: _this.pageInfo1
								}).then(function(response) {
									console.log(response)
									_this.systemData = response.data.list
									_this.pageInfo1.total = response.data.total
								}).catch(function(error) {
									console.log(error)
								})
								_this.$notify({
									title: "您刚刚进行了暂停制度操作",
									message: "制度主题：" + _this.systemForm.systemTheme,
									duration: '7000'
								})
								_this.$message({
									type: 'success',
									message: '暂停成功'
								});
								for (var key in _this.systemForm) {
									delete _this.systemForm[key]
								}
							}).catch(function(error) {
							console.log(error)
							for (var key in _this.systemForm) {
								delete _this.systemForm[key]
							}
							_this.$message({
								type: 'info',
								message: '暂停失败'
							});
						})
				}).catch(() => {
					for (var key in _this.systemForm) {
						delete _this.systemForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			addSystem() {
				const _this = this
				this.login.loginName = "梁政"
				this.systemForm.addname = this.login.loginName
				this.axios.post("http://localhost:8089/tsm/insertSystem", this.systemForm).then(function(
					response) {
					console.log(response)
					_this.axios.post("http://localhost:8089/tsm/insertSystemSelect/" + response.data
						.systemId + "/" + _this.systemSelectYes).then(function(
						response) {
						console.log(response)
						for (var key in _this.systemSelectYes) {
							delete _this.systemSelectYes[key]
						}
					}).catch(function(error) {
						console.log(error)
						for (var key in _this.systemSelectYes) {
							delete _this.systemSelectYes[key]
						}
					})
					_this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.systemData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加制度操作",
						message: "制度主题：" + _this.systemForm.systemTheme,
						duration: '7000'
					})
					_this.addSystemVisible = false
					for (var key in _this.systemForm) {
						delete _this.systemForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.systemForm) {
						delete _this.systemForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})
			},
			addSystemType() {
				const _this = this
				this.login.loginName = "梁政"
				this.systemTypeForm.addname = this.login.loginName
				this.axios.post("http://localhost:8089/tsm/insertSystemType", this.systemTypeForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.systemTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加制度类型操作",
						message: "制度类型名称：" + _this.systemTypeForm.systemtypeName,
						duration: '7000'
					})
					_this.addSystemTypeVisible = false
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.systemTypeForm) {
						delete _this.systemTypeForm[key]
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
			this.axios.get("http://localhost:8089/tsm/selectAllSystemPageInfo", {
				params: this.pageInfo1
			}).then(function(response) {
				console.log(response)
				_this.systemData = response.data.list
				_this.pageInfo1.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllSystemTypePageInfo", {
				params: this.pageInfo2
			}).then(function(response) {
				console.log(response)
				_this.systemTypeData = response.data.list
				_this.pageInfo2.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllSystemType").then(function(response) {
				console.log(response)
				_this.systemTypeData2 = response.data
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllDept").then(function(response) {
				console.log(response)
				_this.deptData = response.data
				_this.systemSelectNo = response.data
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
