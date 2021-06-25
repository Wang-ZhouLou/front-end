<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>职工管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div class="all" style="width: 100%;height: 100%;">
		<div class="time" style="display: flex;justify-content: center;">
			<el-input placeholder="请输入内容" v-model="pageInfo.what" class="input-with-select" style="width: 500px;">
				<template #prepend>
					<el-select v-model="selectCondition" placeholder="请选择">
						<el-option label="姓名" value="1"></el-option>
						<el-option label="性别" value="2"></el-option>
						<el-option label="工号" value="3"></el-option>
						<el-option label="部门" value="4"></el-option>
						<el-option label="职位" value="5"></el-option>
					</el-select>
				</template>
				<template #append>
					<el-button icon="el-icon-search" @click="selectEmpByWhat"></el-button>
				</template>
			</el-input>
			<el-button type="primary" @click="addEmpVisible = true" style="margin-left: 10px;" size="small">
				添加<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" style="margin-left: 10px;" @click="selectAllEmpByState1" size="small">
				查看离职员工<i class="el-icon-user-solid el-icon--right"></i>
			</el-button>
			<el-button type="primary" style="margin-left: 10px;" @click="selectAllEmpByState2" size="small">
				查看在职员工<i class="el-icon-user-solid el-icon--right"></i>
			</el-button>
			<el-button type="primary" style="margin-left: 10px;" @click="selectAllEmp" size="small">
				查看所有员工<i class="el-icon-user-solid el-icon--right"></i>
			</el-button>
			<el-button :disabled="this.multipleSelection.length === 0" @click="stopEmpStateMany(multipleSelection)"
				v-if="this.StopOrGoCondition == 1" type="primary" style="margin-left: 10px;" size="small">
				停职<i class="el-icon-error el-icon--right"></i>
			</el-button>
			<el-button :disabled="this.multipleSelection.length === 0" @click="goEmpStateMany(multipleSelection)"
				v-if="this.StopOrGoCondition == 2" type="primary" style="margin-left: 10px;" size="small">
				复职<i class="el-icon-success el-icon--right"></i>
			</el-button>
		</div>
		<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
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
				<el-table-column prop="enterprise.enterpriseName" label="企业档案" width="231">
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
			</el-table>
		</div>
		<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageInfo.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>
	</div>

	<el-dialog title="添加职工信息" v-model="addEmpVisible" width="950px" top="10vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="姓名">
							<el-input v-model="empForm.empName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="部门">
							<el-select v-model="empForm.deptId" placeholder="请选择部门">
								<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
									v-for="item in deptData">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="职位">
							<el-select v-model="empForm.positionId" placeholder="请选择职位">
								<el-option :key="item.positionId" :label="item.positionName" :value="item.positionId"
									v-for="item in positionData">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="性别">
							<el-select v-model="empForm.empSex" placeholder="请选择性别">
								<el-option label="男" value="男"></el-option>
								<el-option label="女" value="女"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="教育水平">
							<el-input v-model="empForm.education"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="毕业学校">
							<el-input v-model="empForm.graduate"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="addcontent2">
					<div class="addcontent_line">
						<el-form-item label="联系电话">
							<el-input v-model="empForm.empPhone"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="电子邮件">
							<el-input v-model="empForm.eMail"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="生日">
							<el-date-picker v-model="empForm.birthday" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="居住地址">
							<el-input v-model="empForm.address"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="empForm.remarks" :rows="7"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addEmpVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="addEmp" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="确定要给此职工停职吗" v-model="stopEmpStateVisible" width="400px" top="27vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent_line" style="margin-top: 25px;">
				<el-form-item label="工号">
					<el-input v-model="empForm.jobnumber" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="单位名称">
					<el-input v-model="empForm.empName" disabled="true"></el-input>
				</el-form-item>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="stopEmpStateVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="stopEmpState" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="确定要给此职工复职吗" v-model="goEmpStateVisible" width="400px" top="27vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent_line" style="margin-top: 25px;">
				<el-form-item label="工号">
					<el-input v-model="empForm.jobnumber" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="单位名称">
					<el-input v-model="empForm.empName" disabled="true"></el-input>
				</el-form-item>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="goEmpStateVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="goEmpState" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="查看职工信息" v-model="selectEmpVisible" width="1000px" top="9vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="姓名">
							<el-input v-model="empForm.empName" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="部门">
							<el-input v-model="empForm.deptId" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="职位">
							<el-input v-model="empForm.positionId" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="工号">
							<el-input v-model="empForm.jobnumber" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="性别">
							<el-input v-model="empForm.empSex" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="教育水平">
							<el-input v-model="empForm.education" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="毕业学校">
							<el-input v-model="empForm.graduate" disabled="true"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="addcontent2">
					<div class="addcontent_line">
						<el-form-item label="联系电话">
							<el-input v-model="empForm.empPhone" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="电子邮件">
							<el-input v-model="empForm.eMail" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="生日">
							<el-date-picker v-model="empForm.birthday" type="date" placeholder="选择日期" disabled="true">
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="居住地址">
							<el-input v-model="empForm.address" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="职工状态">
							<el-input v-model="empForm.empstate" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="empForm.remarks" :rows="4" disabled="true"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="selectEmpVisible = false" size="small">关闭</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="编辑职工信息" v-model="updateEmpVisible" width="950px" top="10vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent">
				<div class="addcontent1">
					<div class="addcontent_line">
						<el-form-item label="姓名">
							<el-input v-model="empForm.empName"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="性别">
							<el-select v-model="empForm.empSex" placeholder="请选择性别">
								<el-option label="男" value="男"></el-option>
								<el-option label="女" value="女"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="教育水平">
							<el-input v-model="empForm.education"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="毕业学校">
							<el-input v-model="empForm.graduate"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="addcontent2">
					<div class="addcontent_line">
						<el-form-item label="联系电话">
							<el-input v-model="empForm.empPhone"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="电子邮件">
							<el-input v-model="empForm.eMail"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="生日">
							<el-date-picker v-model="empForm.birthday" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="居住地址">
							<el-input v-model="empForm.address"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="empForm.remarks" :rows="7"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updateEmpVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="updateEmp" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="转部门/转职位" v-model="updateDaPVisible" width="950px" top="25vh">
		<el-form :model="empForm" :rules="rules" ref="empForm" label-width="100px" class="demo-ruleForm" size="mini"
			label-position="right">
			<div class="addcontent" style="height: 200px;">
				<div class="addcontent1">
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="职工姓名">
							<el-input v-model="empForm.empName" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="原部门">
							<el-input v-model="oldDept" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="原职位">
							<el-input v-model="oldPosition" disabled="true"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="addcontent2">
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="工号">
							<el-input v-model="empForm.jobnumber" disabled="true"></el-input>
						</el-form-item>
					</div>
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="新部门">
							<el-select v-model="empForm.deptId" placeholder="请选择部门">
								<el-option :key="item.deptId" :label="item.deptName" :value="item.deptId"
									v-for="item in deptData">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="addcontent_line" style="margin-top: 15px;">
						<el-form-item label="新职位">
							<el-select v-model="empForm.positionId" placeholder="请选择职位">
								<el-option :key="item.positionId" :label="item.positionName" :value="item.positionId"
									v-for="item in positionData">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
				</div>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="updateDaPVisible = false" size="small">关闭</el-button>
				<el-button type="primary" @click="updateDeptAndPosition" size="small">保存</el-button>
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
				oldDept: '',
				oldDeptId: '',
				oldPosition: '',
				StopOrGoCondition: '',
				updateDaPVisible: false,
				updateEmpVisible: false,
				selectEmpVisible: false,
				stopEmpStateVisible: false,
				goEmpStateVisible: false,
				addEmpVisible: false,
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				input3: ref(''),
				select: ref(''),
				dialogwhoselectVisible: false,
				dialogFormVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				value2: "",
				empForm: {
					empId: '',
					deptId: '',
					positionId: '',
					enterpriseId: '',
					jobnumber: '',
					empName: '',
					empSex: '',
					empPhone: '',
					eMail: '',
					birthday: '',
					education: '',
					graduate: '',
					remarks: '',
					address: '',
					password: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					leavename: '',
					leavetime: '',
					empstate: '',
					loginstate: ''
				},
				ruleForm: {
					id: '',
					name: '',
					dept: '',
					position: '',
					jobnumber: '',
					sex: '',
					phone: '',
					email: '',
					birthday: '',
					education: '',
					graduate: '',
					address: '',
					enterprise: '',
					remarks: ''
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
				empData: [],
				deptData: [],
				positionData: [],
				pageInfo: {
					empstate: '',
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
			stopEmpStateMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.empId).join()
				var names = this.multipleSelection.map(item => item.empName).join()
				this.$confirm('您将停职所选中的职工，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/stopEmpStateMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
							params: _this.pageInfo
						}).then(function(response) {
							console.log(response)
							_this.empData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了停职操作",
							message: "职工姓名：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '停职成功'
						});
					}).catch(function(error) {
						console.log(error)
						this.$message({
							type: 'info',
							message: '停职失败'
						});
					})
				}).catch(() => {
					this.$refs.empTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消停职'
					});
				});
			},
			goEmpStateMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.empId).join()
				var names = this.multipleSelection.map(item => item.empName).join()
				this.$confirm('您将复职所选中的职工，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/goEmpStateMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
							params: _this.pageInfo
						}).then(function(response) {
							console.log(response)
							_this.empData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了复职操作",
							message: "职工姓名：" + names,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '复职成功'
						});
					}).catch(function(error) {
						console.log(error)
						this.$message({
							type: 'info',
							message: '复职失败'
						});
					})
				}).catch(() => {
					this.$refs.empTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消复职'
					});
				});
			},
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
			},
			updateDeptAndPositionOpen(row) {
				this.empForm.empId = row.empId
				this.empForm.empName = row.empName
				this.oldDept = row.dept.deptName
				this.oldDeptId = row.deptId
				this.oldPosition = row.position.positionName
				this.empForm.deptId = row.deptId
				this.empForm.positionId = row.positionId
				this.empForm.jobnumber = row.jobnumber
				this.updateDaPVisible = true
			},
			updateEmpOpen(row) {
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empId = row.empId
				this.empForm.empName = row.empName
				this.empForm.empSex = row.empSex
				this.empForm.education = row.education
				this.empForm.graduate = row.graduate
				this.empForm.empPhone = row.empPhone
				this.empForm.eMail = row.eMail
				this.empForm.birthday = row.birthday
				this.empForm.address = row.address
				this.empForm.remarks = row.remarks
				this.updateEmpVisible = true
			},
			selectEmpOpen(row) {
				this.empForm.empName = row.empName
				this.empForm.deptId = row.dept.deptName
				this.empForm.positionId = row.position.positionName
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empSex = row.empSex
				this.empForm.education = row.education
				this.empForm.graduate = row.graduate
				this.empForm.empPhone = row.empPhone
				this.empForm.eMail = row.eMail
				this.empForm.birthday = row.birthday
				if (row.empstate == 0) {
					this.empForm.empstate = "在职"
				} else {
					this.empForm.empstate = "离职"
				}
				this.empForm.address = row.address
				this.empForm.remarks = row.remarks
				this.selectEmpVisible = true
			},
			stopEmpStateOpen(row) {
				this.empForm.empId = row.empId
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empName = row.empName
				this.stopEmpStateVisible = true
			},
			goEmpStateOpen(row) {
				this.empForm.empId = row.empId
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empName = row.empName
				this.goEmpStateVisible = true
			},
			selectEmpByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectEmpByName", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectEmpBySex", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "3") {
					this.axios.get("http://localhost:8089/tsm/selectEmpByJobnumber", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "4") {
					this.axios.get("http://localhost:8089/tsm/selectEmpByDept", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'success',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "5") {
					this.axios.get("http://localhost:8089/tsm/selectEmpByPosition", {
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.what = ""
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'success',
							message: '查询失败'
						})
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
			selectAllEmp() {
				const _this = this
				this.StopOrGoCondition = 0
				this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
					params: this.pageInfo
				}).then(function(
					response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.empData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectAllEmpByState1() {
				const _this = this
				this.pageInfo.empstate = 1
				this.StopOrGoCondition = 2
				this.axios.get("http://localhost:8089/tsm/selectEmpByState", {
					params: _this.pageInfo
				}).then(
					function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectAllEmpByState2() {
				const _this = this
				this.pageInfo.empstate = 0
				this.StopOrGoCondition = 1
				this.axios.get("http://localhost:8089/tsm/selectEmpByState", {
					params: this.pageInfo
				}).then(function(
					response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.empData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			updateEmp() {
				const _this = this
				this.StopOrGoCondition = 0
				this.axios.put("http://localhost:8089/tsm/updateEmp", this.empForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$notify({
						title: '您刚刚执行了修改职工信息操作',
						message: '工号:' + _this.empForm.jobnumber + " " + '姓名：' + _this.empForm
							.empName,
						duration: '7000'
					})
					_this.$message({
						type: 'success',
						message: '修改成功'
					})
					_this.updateEmpVisible = false
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
				}).catch(function(error) {
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
					console.log(error)
					_this.$message({
						type: 'info',
						message: '修改失败'
					})
				})
			},
			updateDeptAndPosition() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateDeptAndPosition/" + this.oldDeptId, this.empForm)
					.then(function(
						response) {
						_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
							params: _this.pageInfo
						}).then(function(
							response) {
							console.log(response)
							_this.empData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: '您刚刚执行了转部门/转职位操作',
							message: '工号:' + _this.empForm.jobnumber + " " + '姓名：' + _this.empForm
								.empName,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '操作成功'
						})
						console.log(response)
						_this.updateDaPVisible = false
						for (var key in _this.empForm) {
							delete _this.empForm[key]
						}
					}).catch(function(error) {
						for (var key in _this.empForm) {
							delete _this.empForm[key]
						}
						_this.$message({
							type: 'info',
							message: '操作失败'
						})
						console.log(error)
					})
			},
			stopEmpState() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/stopEmpState", this.empForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$notify({
						title: '您刚刚执行了停职操作',
						message: '工号:' + _this.empForm.jobnumber + " " + '姓名：' + _this.empForm
							.empName,
						duration: '7000'
					})
					_this.$message({
						type: 'success',
						message: '停职成功'
					})
					console.log(response)
					_this.stopEmpStateVisible = false
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
				}).catch(function(error) {
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
					console.log(error)
					_this.$message({
						type: 'info',
						message: '停职失败'
					})
				})
			},
			goEmpState() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/goEmpState", this.empForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$notify({
						title: '您刚刚执行了复职操作',
						message: '工号:' + _this.empForm.jobnumber + " " + '姓名：' + _this.empForm
							.empName,
						duration: '7000'
					})
					_this.$message({
						type: 'success',
						message: '复职成功'
					})
					console.log(response)
					_this.goEmpStateVisible = false
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
				}).catch(function(error) {
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
					console.log(error)
					_this.$message({
						type: 'info',
						message: '复职失败'
					})
				})
			},
			addEmp() {
				const _this = this
				this.StopOrGoCondition = 0
				this.axios.post("http://localhost:8089/tsm/insertEmp", this.empForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
						params: _this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.empData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$notify({
						title: '您刚刚执行了添加职工操作',
						message: '工号:' + _this.empForm.jobnumber + " " + '姓名：' + _this.empForm
							.empName,
						duration: '7000'
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					console.log(response)
					_this.addEmpVisible = false
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
				}).catch(function(error) {
					for (var key in _this.empForm) {
						delete _this.empForm[key]
					}
					console.log(error)
					_this.$message({
						type: 'info',
						message: '添加失败'
					})
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
