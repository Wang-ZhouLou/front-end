<template>
	<el-tabs type="border-card">
		<el-tab-pane label="单位管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 100%">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="pageInfo1.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition" placeholder="请选择">
								<el-option label="单位名称" value="1"></el-option>
								<el-option label="单位类型" value="2"></el-option>
								<el-option label="单位级别" value="3"></el-option>
								<el-option label="单位地址" value="4"></el-option>
								<el-option label="负责人" value="5"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button @click="selectUnitByWhat" icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addUnitVisible = true" style="margin-left: 10px;" size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllUnit" style="margin-left: 10px;" size="small">
						查看所有单位<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection.length === 0"
						@click="deleteUnitMany(multipleSelection)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="unitData" border style="width: 1200px;" @selection-change="handleSelectionChange"
						ref="unitTable">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="unitId" label="编号" width="50" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="unitName" label="单位名称" width="193" align="center">
						</el-table-column>
						<el-table-column prop="unittype.unittypeName" label="单位类型" width="193" align="center">
						</el-table-column>
						<el-table-column prop="unitLevel" label="单位级别" width="193" align="center">
						</el-table-column>
						<el-table-column prop="director" label="负责人" width="193" align="center">
						</el-table-column>
						<el-table-column prop="unitAddress" label="单位地址" width="193" align="center">
						</el-table-column>
						<el-table-column prop="mailcode" label="邮政编码" width="193" align="center">
						</el-table-column>
						<el-table-column prop="unitPhone" label="单位电话" width="193" align="center">
						</el-table-column>
						<el-table-column prop="email" label="电子邮件" width="193" align="center">
						</el-table-column>
						<el-table-column prop="profile" label="简介" width="193" align="center">
						</el-table-column>
						<el-table-column prop="remarks" label="备注" width="193" align="center">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="150" align="center">
							<template #default="scope">
								<el-button @click="selectUnitOpen(scope.row)" type="text" size="small">查看</el-button>
								<el-button @click="updateUnitOpen(scope.row)" type="text" size="small">编辑</el-button>
								<el-button @click="deleteUnit(scope.row)" type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination"
					style="margin-top:20px ;display:flex;justify-content: center;position: absolute;width: 100%;">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="pageInfo1.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo1.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="添加单位" v-model="addUnitVisible" width="950px">
				<el-form :model="unitForm" :rules="rules" ref="unitForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="单位名称">
									<el-input v-model="unitForm.unitName"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位类型">
									<el-select v-model="unitForm.unittypeId" placeholder="请选择类型">
										<el-option :key="item.unittypeId" :label="item.unittypeName"
											:value="item.unittypeId" v-for="item in unitTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位级别">
									<el-select v-model="unitForm.unitLevel" placeholder="请选择级别">
										<el-option label="A级" value="A"></el-option>
										<el-option label="B级" value="B"></el-option>
										<el-option label="C级" value="C"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="负责人">
									<el-input v-model="unitForm.director"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="简介">
									<el-input type="textarea" v-model="unitForm.profile" :rows="5"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="addcontent2">
							<div class="addcontent_line">
								<el-form-item label="邮政编码">
									<el-input v-model="unitForm.mailcode"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位电话">
									<el-input v-model="unitForm.unitPhone"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="电子邮件">
									<el-input v-model="unitForm.email"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位地址">
									<el-input v-model="unitForm.unitAddress"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="备注">
									<el-input type="textarea" v-model="unitForm.remarks" :rows="5"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="addUnitVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="addUnit" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="查看单位" v-model="selectUnitVisible" width="950px">
				<el-form :model="unitForm" :rules="rules" ref="unitForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="单位名称">
									<el-input v-model="unitForm.unitName" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位类型">
									<el-input v-model="unitForm.unittypeId" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位级别">
									<el-input v-model="unitForm.unitLevel" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="负责人">
									<el-input v-model="unitForm.director" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="简介">
									<el-input type="textarea" v-model="unitForm.profile" :rows="5" disabled="true">
									</el-input>
								</el-form-item>
							</div>
						</div>
						<div class="addcontent2">
							<div class="addcontent_line">
								<el-form-item label="邮政编码">
									<el-input v-model="unitForm.mailcode" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位电话">
									<el-input v-model="unitForm.unitPhone" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="电子邮件">
									<el-input v-model="unitForm.email" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位地址">
									<el-input v-model="unitForm.unitAddress" disabled="true"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="备注">
									<el-input type="textarea" v-model="unitForm.remarks" :rows="5" disabled="true">
									</el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="selectUnitVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="selectUnitVisible = false" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑单位" v-model="updateUnitVisible" width="950px">
				<el-form :model="unitForm" :rules="rules" ref="unitForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="单位名称">
									<el-input v-model="unitForm.unitName"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位类型">
									<el-select v-model="unitForm.unittypeId" placeholder="请选择类型">
										<el-option :key="item.unittypeId" :label="item.unittypeName"
											:value="item.unittypeId" v-for="item in unitTypeData2">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位级别">
									<el-select v-model="unitForm.unitLevel" placeholder="请选择级别">
										<el-option label="A级" value="A"></el-option>
										<el-option label="B级" value="B"></el-option>
										<el-option label="C级" value="C"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="负责人">
									<el-input v-model="unitForm.director"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="简介">
									<el-input type="textarea" v-model="unitForm.profile" :rows="5"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="addcontent2">
							<div class="addcontent_line">
								<el-form-item label="邮政编码">
									<el-input v-model="unitForm.mailcode"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位电话">
									<el-input v-model="unitForm.unitPhone"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="电子邮件">
									<el-input v-model="unitForm.email"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="单位地址">
									<el-input v-model="unitForm.unitAddress"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="备注">
									<el-input type="textarea" v-model="unitForm.remarks" :rows="5"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="updateUnitVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="updateUnit" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>

		<el-tab-pane label="单位类型管理" style="height: 530px;">
			<div class="all" style="width: 100%;height: 550px;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入单位类型名称内容" v-model="pageInfo2.what" class="input-with-select"
						style="width: 500px;">
						<template #append>
							<el-button icon="el-icon-search" @click="selectUnitTypeByWhat"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addUnitTypeVisible = true" style="margin-left: 10px;"
						size="small">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" @click="selectAllUnitType" style="margin-left: 10px;" size="small">
						查看所有单位类型<i class="el-icon-search el-icon--right"></i>
					</el-button>
					<el-button :disabled="this.multipleSelection.length === 0"
						@click="deleteUnitTypeMany(multipleSelection)" type="primary" icon="el-icon-delete"
						style="margin-left: 10px;" size="small"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="unitTypeData" border style="width: 1200px" ref="unitTypeTable"
						@selection-change="handleSelectionChange">
						<el-table-column type="selection" width="35" align="center">
						</el-table-column>
						<el-table-column prop="unittypeId" label="编号" width="100" align="center">
						</el-table-column>
						<el-table-column prop="unittypeName" label="单位类型名称" width="864" align="center">
						</el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button @click="updateUnitTypeOpen(scope.row)" type="text" size="small">编辑
								</el-button>
								<el-button @click="deleteUnitType(scope.row)" type="text" size="small">删除
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

			<el-dialog title="添加单位类型" v-model="addUnitTypeVisible" width="450px" top="27vh">
				<el-form :model="unitTypeForm" :rules="rules" ref="unitTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="单位类型名称">
							<el-input v-model="unitTypeForm.unittypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="addUnitTypeVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="addUnitType" size="small">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑单位类型" v-model="updateUnitTypeVisible" width="450px" top="27vh">
				<el-form :model="unitTypeForm" :rules="rules" ref="unitTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;width: 400px;">
						<el-form-item label="编号">
							<el-input v-model="unitTypeForm.unittypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="单位类型名称">
							<el-input v-model="unitTypeForm.unittypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="updateUnitTypeVisible = false" size="small">关闭</el-button>
						<el-button type="primary" @click="updateUnitType" size="small">保存</el-button>
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
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				selectCondition: '',
				input3: ref(''),
				select: ref(''),
				selectUnitVisible: false,
				addUnitVisible: false,
				updateUnitVisible: false,
				addUnitTypeVisible: false,
				updateUnitTypeVisible: false,
				formLabelWidth: '120px',
				value2: "",
				unitForm: {
					unitId: '',
					unitName: '',
					unitType: '',
					unittypeId: '',
					unitLevel: '',
					director: '',
					unitAddress: '',
					mailcode: '',
					unitPhone: '',
					email: '',
					profile: '',
					remarks: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					deletename: '',
					deletetime: ''
				},
				unitTypeForm: {
					unittypeId: '',
					unittypeName: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					timeliness: ''
				},
				ruleForm: {
					name: '',
					type: '',
					level: '',
					director: '',
					address: '',
					phone: '',
					email: '',
					profile: '',
					remarks: '',
					addname: '',
					addtime: ''
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
				unitData: [],
				unitTypeData: [],
				unitTypeData2: [],
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
				multipleSelection: []
			}
		},
		methods: {
			handleSelectionChange(multipleSelection) {
				this.multipleSelection = multipleSelection;
			},
			deleteUnitMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.unitId).join()
				var names = this.multipleSelection.map(item => item.unitName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteUnitMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.unitData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除单位操作",
							message: "单位名称：" + names,
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
					this.$refs.unitTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deleteUnitTypeMany() {
				const _this = this
				var ids = this.multipleSelection.map(item => item.unittypeId).join()
				var names = this.multipleSelection.map(item => item.unittypeName).join()
				this.$confirm('您将删除选中的信息，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteUnitTypeMany/" + ids).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
							params: _this.pageInfo2
						}).then(function(response) {
							console.log(response)
							_this.unitTypeData = response.data.list
							_this.pageInfo2.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除单位类型操作",
							message: "单位类型名称：" + names,
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
					this.$refs.unitTypeTable.clearSelection();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectUnitOpen(row) {
				this.unitForm.unitName = row.unitName
				this.unitForm.unittypeId = row.unittype.unittypeName
				this.unitForm.unitLevel = row.unitLevel
				this.unitForm.director = row.director
				this.unitForm.unitAddress = row.unitAddress
				this.unitForm.mailcode = row.mailcode
				this.unitForm.unitPhone = row.unitPhone
				this.unitForm.email = row.email
				this.unitForm.profile = row.profile
				this.unitForm.remarks = row.remarks
				this.selectUnitVisible = true
			},
			updateUnitOpen(row) {
				this.unitForm.unitId = row.unitId
				this.unitForm.unitName = row.unitName
				this.unitForm.unittypeId = row.unittypeId
				this.unitForm.unitLevel = row.unitLevel
				this.unitForm.director = row.director
				this.unitForm.unitAddress = row.unitAddress
				this.unitForm.mailcode = row.mailcode
				this.unitForm.unitPhone = row.unitPhone
				this.unitForm.email = row.email
				this.unitForm.profile = row.profile
				this.unitForm.remarks = row.remarks
				this.updateUnitVisible = true
			},
			deleteUnit(row) {
				const _this = this
				this.unitForm.unitId = row.unitId
				this.unitForm.unitName = row.unitName
				this.$confirm('您将删除此信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteUnit", this.unitForm).then(function(
						response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
							params: _this.pageInfo1
						}).then(function(response) {
							console.log(response)
							_this.unitData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
						_this.$notify({
							title: "您刚刚进行了删除单位操作",
							message: "单位名称：" + _this.unitForm.unitName,
							duration: '7000'
						})
						_this.$message({
							type: 'success',
							message: '删除成功'
						})
						for (var key in _this.unitTypeForm) {
							delete _this.unitTypeForm[key]
						}
					}).catch(function(error) {
						console.log(error)
						for (var key in _this.unitTypeForm) {
							delete _this.unitTypeForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						})
					})
				}).catch(() => {
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			selectUnitByWhat() {
				const _this = this
				if (this.selectCondition == "1") {
					this.axios.get("http://localhost:8089/tsm/selectUnitByName", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "2") {
					this.axios.get("http://localhost:8089/tsm/selectUnitByUnitTypeName", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "3") {
					this.axios.get("http://localhost:8089/tsm/selectUnitByLevel", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "4") {
					this.axios.get("http://localhost:8089/tsm/selectUnitByAddress", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.selectCondition == "5") {
					this.axios.get("http://localhost:8089/tsm/selectUnitByDirector", {
						params: this.pageInfo1
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo1.what = ""
						_this.unitData = response.data.list
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
			selectUnitTypeByWhat() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectUnitTypeByName", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功!'
					})
					_this.pageInfo2.what = ""
					_this.unitTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败!'
					})
				})
			},
			selectAllUnitType() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.unitTypeData = response.data.list
					_this.pageInfo2.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			handleSizeChange1(pagesize) {
				var _this = this
				this.pageInfo1.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo1)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectUnitPageInfo", {
						params: this.pageInfo1
					})
					.then(function(response) {
						console.log(response.data)
						_this.unitData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange1(currentPage) {
				var _this = this
				this.pageInfo1.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectUnitPageInfo", {
						params: this.pageInfo1
					})
					.then(function(response) {
						_this.unitData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange2(pagesize) {
				var _this = this
				this.pageInfo2.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo2)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
						params: this.pageInfo2
					})
					.then(function(response) {
						console.log(response.data)
						_this.unitTypeData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange2(currentPage) {
				var _this = this
				this.pageInfo2.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo2) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
						params: this.pageInfo2
					})
					.then(function(response) {
						_this.unitTypeData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			addUnit() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertUnit", this.unitForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加单位操作",
						message: "单位名称：" + _this.unitForm.unitName,
						duration: '7000'
					})
					_this.addUnitVisible = false
					for (var key in _this.unitForm) {
						delete _this.unitForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					});
				})

			},
			addUnitType() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertUnitType", this.unitTypeForm).then(function(
					response) {
					console.log(response)
					_this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.unitTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					_this.$message({
						type: 'success',
						message: '添加成功'
					})
					_this.$notify({
						title: "您刚刚进行了添加单位类型操作",
						message: "单位类型名称：" + _this.unitTypeForm.unittypeName,
						duration: '7000'
					})
					_this.addUnitTypeVisible = false
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '添加失败'
					});
				})

			},
			updateUnit() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateUnit", this.unitForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
						params: _this.pageInfo1
					}).then(function(response) {
						console.log(response)
						_this.unitData = response.data.list
						_this.pageInfo1.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					console.log(response)
					_this.$message({
						type: 'success',
						message: '修改成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑单位操作",
						message: "单位名称：" + _this.unitForm.unitName,
						duration: '7000'
					})
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					_this.updateUnitVisible = false
				}).catch(function(error) {
					console.log(error)
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					_this.$message({
						type: 'info',
						message: '修改失败'
					})
				})
			},
			updateUnitTypeOpen(row) {
				const _this = this
				_this.unitTypeForm.unittypeId = row.unittypeId
				_this.unitTypeForm.unittypeName = row.unittypeName
				_this.unitTypeForm.addname = row.addname
				_this.unitTypeForm.timeliness = row.timeliness
				_this.updateUnitTypeVisible = true
			},
			deleteUnitType(row) {
				const _this = this
				_this.unitTypeForm.unittypeId = row.unittypeId
				_this.unitTypeForm.addname = row.addname
				_this.unitTypeForm.unittypeName = row.unittypeName
				this.$confirm('您将删除此信息 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/deleteUnitType", this.unitTypeForm).then(
						function(
							response) {
							console.log(response)
							_this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
								params: _this.pageInfo2
							}).then(function(response) {
								console.log(response)
								_this.unitTypeData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
							_this.$notify({
								title: "您刚刚进行了删除单位类型操作",
								message: "单位类型名称：" + _this.unitTypeForm.unittypeName,
								duration: '7000'
							})
							_this.$message({
								type: 'success',
								message: '删除成功'
							})
							for (var key in _this.unitTypeForm) {
								delete _this.unitTypeForm[key]
							}
						}).catch(function(error) {
						console.log(error)
						for (var key in _this.unitTypeForm) {
							delete _this.unitTypeForm[key]
						}
						_this.$message({
							type: 'info',
							message: '删除失败'
						})
					})
				}).catch(() => {
					for (var key in _this.unitTypeForm) {
						delete _this.unitTypeForm[key]
					}
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				});
			},
			updateUnitType() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateUnitTypeName", this.unitTypeForm).then(function(
					response) {
					_this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
						params: _this.pageInfo2
					}).then(function(response) {
						console.log(response)
						_this.unitTypeData = response.data.list
						_this.pageInfo2.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
					console.log(response)
					_this.$message({
						type: 'success',
						message: '修改成功'
					})
					_this.$notify({
						title: "您刚刚进行了编辑单位类型操作",
						message: "单位类型名称：" + _this.unitTypeForm.unittypeName,
						duration: '7000'
					})
					_this.updateUnitTypeVisible = false
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '修改失败'
					})
				})
			},
			selectAllUnit() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
					_this.unitData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllUnitPageInfo", {
				params: this.pageInfo1
			}).then(function(response) {
				console.log(response)
				_this.unitData = response.data.list
				_this.pageInfo1.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectUnitTypePageInfo", {
				params: this.pageInfo2
			}).then(function(response) {
				console.log(response)
				_this.unitTypeData = response.data.list
				_this.pageInfo2.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllUnitType").then(function(response) {
				console.log(response)
				_this.unitTypeData2 = response.data
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
