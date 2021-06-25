<template>
	<el-tabs type="border-card">
		<el-tab-pane label="公告管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 100%">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="pageInfo1.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition" filterable placeholder="请选择">
								<el-option label="公告主题" value="1"></el-option>
								<el-option label="公告类型" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="selectAnByWhat" icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addAnVisible = true" style="margin-left: 10px;" size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" v-if="this.YesOrNoCondition == 1"
						:disabled="this.multipleSelection1.length === 0"
						@click="updateAnStateGoMany(multipleSelection1)" style="margin-left: 10px;" size="small">
						发布<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" v-if="this.YesOrNoCondition == 2"
						:disabled="this.multipleSelection1.length === 0"
						@click="updateAnStateStopMany(multipleSelection1)" style="margin-left: 10px;" size="small">
						暂停<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAnByStateNO" style="margin-left: 10px;" size="small">
						查看未发布的制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAnByStateYES" style="margin-left: 10px;" size="small">
						查看已发布的制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllSystem" style="margin-left: 10px;" size="small">
						查看所有制度<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection1.length === 0"
						@click="deleteAnMany(multipleSelection1)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="anData" border style="width: 1200px;" @selection-change="handleSelectionChange1"
						ref="anTable">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column type="index" :index="indexMethod" label="编号" width="50" align="center">
						</el-table-column>
						<el-table-column prop="announcementTheme" label="公告主题" width="183" align="center"
							show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="announcementtype.announcementtypeName" label="公告类型" width="183"
							align="center">
						</el-table-column>
						<el-table-column prop="startTime" label="开始时间" width="183" align="center">
						</el-table-column>
						<el-table-column prop="endTime" label="结束时间" width="183" align="center">
						</el-table-column>
						<el-table-column prop="announcementState" label="公告状态" width="182" align="center">
							<template v-slot="scope">
								<p v-if="scope.row.announcementState==0">未发布</p>
								<p v-if="scope.row.announcementState==1">已发布</p>
								<p v-if="scope.row.announcementState==2">已暂停</p>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button v-if="scope.row.announcementState==0 || scope.row.announcementState==2"
									style="color: limegreen;" @click="updateAnStateGo(scope.row)" type="text"
									size="small">发布</el-button>
								<el-button v-if="scope.row.announcementState==1" style="color: red;"
									@click="updateAnStateStop(scope.row)" type="text" size="small">暂停</el-button>
								<el-button @click="selectAnOpen(scope.row)" type="text" size="small">查看</el-button>
								<el-button @click="updateAnOpen(scope.row)" type="text" size="small">编辑</el-button>
								<el-button @click="deleteAn(scope.row)" type="text" size="small">删除</el-button>
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

			<el-dialog title="添加公告" v-model="addAnVisible" width="600px" :before-close="close" top="5vh">
				<el-form :model="anForm" :rules="rules" ref="anForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="公告主题">
									<el-input v-model="anForm.announcementTheme"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="公告类型">
									<el-select v-model="anForm.announcementtypeId" filterable placeholder="请选择类型">
										<el-option :key="item.announcementtypeId" :label="item.announcementtypeName"
											:value="item.announcementtypeId" v-for="item in anTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="开始时间">
									<el-date-picker v-model="anForm.startTime" align="right" type="date"
										placeholder="选择日期" :shortcuts="shortcuts1">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="结束时间">
									<el-date-picker v-model="anForm.endTime" align="right" type="date"
										placeholder="选择日期" :shortcuts="shortcuts2">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="允许查看人员">
									<el-input type="textarea" v-model="anSelectYes" :rows="2"></el-input>
									<el-button type="primary" @click="anSelectVisible = true"
										style="position: absolute;margin-left: 10px;margin-top: 15px;" size="small">
										<i class="el-icon-search"></i>
									</el-button>
								</el-form-item>
							</div>
							<div class="addcontent_line" style="margin-top: 15px;">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="anForm.announcementContent" :rows="7"></el-input>
								</el-form-item>
							</div>

						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="addAn" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="提示" v-model="anSelectVisible" width="625px" :before-close="close1">
				<el-transfer v-model="anSelectYes" :titles="['未选择', '已选择']" :props="{key: 'deptId',label: 'deptName'}"
					:data="anSelectNo" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close">取 消</el-button>
						<el-button type="primary" @click="anSelectVisible = false">确 定</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="查看公告" v-model="selectAnVisible" width="600px" :before-close="close" top="5vh">
				<el-form :model="anForm" :rules="rules" ref="anForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="公告主题">
									<el-input v-model="anForm.announcementTheme" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="公告类型">
									<el-select v-model="anForm.announcementtypeId" filterable placeholder="请选择类型"
										disabled="true">
										<el-option :key="item.announcementtypeId" :label="item.announcementtypeName"
											:value="item.announcementtypeId" v-for="item in anTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="开始时间">
									<el-date-picker v-model="anForm.startTime" align="right" type="date" disabled="true"
										placeholder="选择日期" :disabled-date="disabledDate1" :shortcuts="shortcuts1">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="结束时间">
									<el-date-picker v-model="anForm.endTime" align="right" type="date" disabled="true"
										placeholder="选择日期" :shortcuts="shortcuts2">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="允许查看人员">
									<el-input v-model="anSelectWho" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line" style="margin-top: 15px;">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="anForm.announcementContent" :rows="7"
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

			<el-dialog title="编辑公告" v-model="updateAnVisible" width="950px" :before-close="close" top="7vh">
				<el-form :model="anForm" :rules="rules" ref="anForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="公告主题">
									<el-input v-model="anForm.announcementTheme"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="公告类型">
									<el-select v-model="anForm.announcementtypeId" filterable placeholder="请选择类型">
										<el-option :key="item.announcementtypeId" :label="item.announcementtypeName"
											:value="item.announcementtypeId" v-for="item in anTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="开始时间">
									<el-date-picker v-model="anForm.startTime" align="right" type="date"
										placeholder="选择日期" :disabled-date="disabledDate1" :shortcuts="shortcuts1">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="结束时间">
									<el-date-picker v-model="anForm.endTime" align="right" type="date"
										placeholder="选择日期" :shortcuts="shortcuts2">
									</el-date-picker>
								</el-form-item>
							</div>
							<div class="addcontent_line" style="margin-top: 15px;">
								<el-form-item label="制度内容">
									<el-input type="textarea" v-model="anForm.announcementContent" :rows="7"></el-input>
								</el-form-item>
							</div>

						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="updateAn" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>

		<el-tab-pane label="公告类型管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 550px;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入公告类型名称内容" v-model="pageInfo2.what" class="input-with-select"
						style="width: 500px;">
						<template #append>
							<el-button icon="el-icon-search" @click="selectAnTypeByWhat"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addAnTypeVisible = true" style="margin-left: 10px;" size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllAnType" style="margin-left: 10px;" size="small">
						查看所有制度类型<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection2.length === 0"
						@click="deleteAnTypeMany(multipleSelection2)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="anTypeData" border style="width: 1200px" ref="anTypeData"
						@selection-change="handleSelectionChange2">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column type="index" :index="indexMethod" label="编号" width="100" align="center">
						</el-table-column>
						<el-table-column prop="announcementtypeName" label="制度类型名称" width="864" align="center">
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button @click="updateAnTypeOpen(scope.row)" type="text" size="small">编辑
								</el-button>
								<el-button @click="deleteAnType(scope.row)" type="text" size="small">删除
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

			<el-dialog title="添加公告类型" v-model="addAnTypeVisible" width="450px" top="27vh">
				<el-form :model="anTypeForm" :rules="rules" ref="anTypeForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="公告类型名称">
							<el-input v-model="anTypeForm.announcementtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="addAnType" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑单位类型" v-model="updateAnTypeVisible" width="450px" top="27vh">
				<el-form :model="anTypeForm" :rules="rules" ref="anTypeForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="编号">
							<el-input v-model="anTypeForm.announcementtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="单位类型名称">
							<el-input v-model="anTypeForm.announcementtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close" size="small">关闭</el-button>
						<el-button type="primary" @click="updateAnType" size="small">保存</el-button>
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
				shortcuts1: [{
					text: '今天',
					value: new Date(),
				}, {
					text: '明天',
					value: (() => {
						const date = new Date()
						date.setTime(date.getTime() + 3600 * 1000 * 24)
						return date
					})(),
				}, {
					text: '一周后',
					value: (() => {
						const date = new Date()
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
						return date
					})(),
				}],
				disabledDate2(time) {
					return time.getTime() > Date.now()
				},
				shortcuts2: [{
					text: '今天',
					value: new Date(),
				}, {
					text: '明天',
					value: (() => {
						const date = new Date()
						date.setTime(date.getTime() + 3600 * 1000 * 24)
						return date
					})(),
				}, {
					text: '一周后',
					value: (() => {
						const date = new Date()
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
						return date
					})(),
				}],
				anSelectWho: [],
				anSelectYes: [],
				anSelectNo: [],
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				selectCondition: '',
				input3: ref(''),
				select: ref(''),
				anSelectVisible: false,
				selectAnVisible: false,
				addAnVisible: false,
				updateAnVisible: false,
				addAnTypeVisible: false,
				updateAnTypeVisible: false,
				formLabelWidth: '120px',
				value2: "",
				anData: [],
				anTypeData: [],
				anTypeData2: [],
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
				anForm: {
					antype: '',
					announcementtypeId: '',
					startTime: '',
					endTime: '',
					announcementTheme: '',
					announcementContent: '',
					announcementState: '',
					addname: '',
					updatename: '',
					deletename: '',
					publishname: '',
					suspenname: ''
				},
				anTypeForm: {
					announcementtypeId: '',
					announcementtypeName: '',
					addname: '',
					updatename: '',
					deletename: '',
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
			selectAllAnType() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.anTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectAnTypeByWhat() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAnTypeByName", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo2
				}).then(function(
					response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.pageInfo2.what = ""
					_this.anTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectAnByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectAnByTheme", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.anData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectAnByType", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.anData = response.data.list
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
			deleteAnMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.announcementId).join()
				var names = this.multipleSelection1.map(item => item.announcementTheme).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteAnMany/" + ids + "/" +
						updatename, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.anData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除公告操作",
							message: "公告主题：" + names,
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
					this.$refs.anTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			deleteAnTypeMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection2.map(item => item.announcementtypeId).join()
				var names = this.multipleSelection2.map(item => item.announcementtypeName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteAnTypeMany/" + ids + "/" +
						updatename, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo2
						}).then(function(response) {
							console.log(response)
							_this.anTypeData = response.data.list
							_this.pageInfo2.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除公告类型操作",
							message: "公告类型名称：" + names,
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
					this.$refs.anTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			updateAnStateStopMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.announcementId).join()
				var names = this.multipleSelection1.map(item => item.announcementTheme).join()
				this.$confirm('您将暂停选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateAnStateStopMany/" + ids + "/" +
						updatename, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAnByStateYES", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.anData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了暂停公告操作",
							message: "公告主题：" + names,
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
					this.$refs.anTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			updateAnStateGoMany() {
				const _this = this
				this.login.loginName = "梁政"
				var updatename = this.login.loginName
				var ids = this.multipleSelection1.map(item => item.announcementId).join()
				var names = this.multipleSelection1.map(item => item.announcementTheme).join()
				this.$confirm('您将发布选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateAnStateGoMany/" + ids + "/" +
						updatename, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAnByStateNO", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.anData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了发布公告操作",
							message: "公告主题：" + names,
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
					this.$refs.anTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消发布'
					});
				});
			},
			selectAnByStateNO() {
				const _this = this
				this.YesOrNoCondition = 1
				this.axios.get("http://localhost:8089/tsm/selectAnByStateNO", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.anData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectAnByStateYES() {
				const _this = this
				this.YesOrNoCondition = 2
				this.axios.get("http://localhost:8089/tsm/selectAnByStateYES", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.anData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			selectAllSystem() {
				const _this = this
				this.YesOrNoCondition = 0
				this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.anData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			},
			deleteAn(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.anForm.deletename = this.login.loginName
				this.anForm.announcementId = row.announcementId
				this.anForm.announcementTheme = row.announcementTheme
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteAn", this.anForm, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: _this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.anData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.anForm) {
								delete _this.anForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除公告操作",
								message: "公告主题：" + _this.anForm.announcementTheme,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.anForm) {
							delete _this.anForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deleteAnType(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.anTypeForm.deletename = this.login.loginName
				this.anTypeForm.announcementtypeId = row.announcementtypeId
				this.anTypeForm.announcementtypeName = row.announcementtypeName
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteAnType", this.anTypeForm, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: _this.pageInfo2
							}).then(function(response) {
								console.log(response)
								_this.anTypeData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							for (var key in _this.anTypeForm) {
								delete _this.anTypeForm[key]
							}
							_this.$notify({
								title: "您刚刚进行了删除公告类型操作",
								message: "公告类型名称：" + _this.anTypeForm.announcementtypeName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							});
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.anTypeForm) {
							delete _this.anTypeForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					for (var key in _this.anTypeForm) {
						delete _this.anTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			updateAnOpen(row) {
				this.anForm.announcementId = row.announcementId
				this.anForm.announcementtypeId = row.announcementtypeId
				this.anForm.startTime = row.startTime
				this.anForm.endTime = row.endTime
				this.anForm.announcementTheme = row.announcementTheme
				this.anForm.announcementContent = row.announcementContent
				this.updateAnVisible = true
			},
			updateAnTypeOpen(row) {
				this.anTypeForm.announcementtypeId = row.announcementtypeId
				this.anTypeForm.announcementtypeName = row.announcementtypeName
				this.updateAnTypeVisible = true
			},
			selectAnOpen(row) {
				const _this = this
				this.anForm.announcementId = row.announcementId
				this.anForm.announcementtypeId = row.announcementtypeId
				this.anForm.startTime = row.startTime
				this.anForm.endTime = row.endTime
				this.anForm.announcementTheme = row.announcementTheme
				this.anForm.announcementContent = row.announcementContent
				this.axios.get("http://localhost:8089/tsm/selectEmpIdByAnId/" + this.anForm
						.announcementId, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
					.then(function(response) {
						console.log(response)
						_this.anSelectWho = response.data
					}).catch(function(error) {
						console.log(error)
					})
				this.selectAnVisible = true
			},
			close() {
				this.anSelectVisible = false
				this.selectAnVisible = false
				this.addAnVisible = false
				this.updateAnVisible = false
				this.addAnTypeVisible = false
				this.updateAnTypeVisible = false
				for (var key in this.anForm) {
					delete this.anForm[key]
				}
				for (var key1 in this.anTypeForm) {
					delete this.anTypeForm[key1]
				}
				this.$message({
					type: 'info',
					message: '已取消操作'
				});
			},
			close1() {
				this.anSelectVisible = false
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
				this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo1
					})
					.then(function(response) {
						console.log(response.data)
						_this.anData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange1(currentPage) {
				var _this = this
				this.pageInfo1.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo1
					})
					.then(function(response) {
						_this.anData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange2(pagesize) {
				var _this = this
				this.pageInfo2.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo2)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo2
					})
					.then(function(response) {
						console.log(response.data)
						_this.anTypeData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange2(currentPage) {
				var _this = this
				this.pageInfo2.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo2) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo2
					})
					.then(function(response) {
						_this.anTypeData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			updateAn() {
				const _this = this
				this.login.loginName = "梁政"
				this.anForm.updatename = this.login.loginName
				this.axios.put("http://localhost:8089/tsm/updateAn", this.anForm, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.anData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '编辑成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑公告操作",
						message: "公告主题：" + _this.anForm.announcementTheme,
						duration: '7000'
					})
					_this.updateAnVisible = false
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
					_this.$message({
						type: 'info',
						message: '编辑失败'
					});
				})
			},
			updateAnType() {
				const _this = this
				this.login.loginName = "梁政"
				this.anTypeForm.updatename = this.login.loginName
				this.axios.put("http://localhost:8089/tsm/updateAnTypeName", this.anTypeForm, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo12
					}).then(function(response) {
						console.log(response)
						_this.anTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '编辑成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑公告类型操作",
						message: "公告类型名称：" + _this.anTypeForm.announcementtypeName,
						duration: '7000'
					})
					_this.updateAnTypeVisible = false
					for (var key in _this.anTypeForm) {
						delete _this.anTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.anTypeForm) {
						delete _this.anTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '编辑失败'
					});
				})
			},
			updateAnStateGo(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.anForm.announcementId = row.announcementId
				this.anForm.announcementTheme = row.announcementTheme
				this.anForm.publishname = this.login.loginName
				this.$confirm('您将发布此公告, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateAnStateGo", this.anForm, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(
						function(response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: _this.pageInfo1
							}).then(function(response) {
								console.log(response)
								_this.anData = response.data.list
								_this.pageInfo1.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.$notify({
								title: "您刚刚进行了发布公告操作",
								message: "公告主题：" + _this.anForm.announcementTheme,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '发布成功'
							});
							for (var key in _this.anForm) {
								delete _this.anForm[key]
							}
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.anForm) {
							delete _this.anForm[key]
						}
						_this.$message({
							type: 'info',
							message: '发布失败'
						});
					})
				}).catch(() => {
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消发布'
					});
				});
			},
			updateAnStateStop(row) {
				const _this = this
				this.login.loginName = "梁政"
				this.anForm.announcementId = row.announcementId
				this.anForm.announcementTheme = row.announcementTheme
				this.anForm.suspendname = this.login.loginName
				this.$confirm('您将暂停此公告, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/updateAnStateStop", this.anForm, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(
							function(response) {
								console.log(response)
								_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
									headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									},
									params: _this.pageInfo1
								}).then(function(response) {
									console.log(response)
									_this.anData = response.data.list
									_this.pageInfo1.total = response.data.total
								}).catch(function(error) {
									console.log(error)
								})
								_this.$notify({
									title: "您刚刚进行了暂停公告操作",
									message: "公告主题：" + _this.anForm.announcementTheme,
									duration: '7000'
								})
								_this.$message({
									type: 'success',
									message: '暂停成功'
								});
								for (var key in _this.anForm) {
									delete _this.anForm[key]
								}
							}).catch(function(error) {
							console.log(error)
							for (var key in _this.anForm) {
								delete _this.anForm[key]
							}
							_this.$message({
								type: 'info',
								message: '暂停失败'
							});
						})
				}).catch(() => {
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
					_this.$message({
						type: 'info',
						message: '已取消暂停'
					});
				});
			},
			addAnType() {
				const _this = this
				// this.$store.userInfo.userName
				this.login.loginName = "梁政"
				this.anTypeForm.addname = this.login.loginName
				this.axios.post("http://localhost:8089/tsm/insertAnType", this.anTypeForm, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.anTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加公告类型操作",
						message: "公告类型名称：" + _this.anTypeForm.announcementtypeName,
						duration: '7000'
					})
					for (var key in _this.anTypeForm) {
						delete _this.anTypeForm[key]
					}
					_this.addAnTypeVisible = false
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.anTypeForm) {
						delete _this.anTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})
			},
			addAn() {
				const _this = this
				this.login.loginName = "梁政"
				this.anForm.addname = this.login.loginName
				this.axios.post("http://localhost:8089/tsm/insertAn", this.anForm, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(
					response) {
					console.log(response)
					_this.axios.post("http://localhost:8089/tsm/insertAnSelect/" + response.data
						.announcementId + "/" + _this.anSelectYes, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(
						response) {
						console.log(response)
						for (var key in _this.anSelectYes) {
							delete _this.anSelectYes[key]
						}
					}).catch(function(error) {
						console.log(error)
						for (var key in _this.anSelectYes) {
							delete _this.anSelectYes[key]
						}
					})
					_this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.anData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加公告操作",
						message: "公告主题：" + _this.anForm.announcementTheme,
						duration: '7000'
					})
					_this.addAnVisible = false
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.anForm) {
						delete _this.anForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
				})
			},
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/SelectAllAnPageInfo", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
				params: this.pageInfo1
			}).then(function(response) {
				console.log(response)
				_this.anData = response.data.list
				_this.pageInfo1.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllAnTypePageInfo", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
				params: this.pageInfo2
			}).then(function(response) {
				console.log(response)
				_this.anTypeData = response.data.list
				_this.pageInfo2.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllAnType", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.anTypeData2 = response.data
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllDept", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.deptData = response.data
				_this.anSelectNo = response.data
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
		height: 470px;
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
