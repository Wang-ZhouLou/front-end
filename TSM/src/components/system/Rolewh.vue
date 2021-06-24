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
			<el-button style="background-color: #009688;color: white;margin-bottom: 10px;" size="mini">查询</el-button>
			<br>

			<el-button style="background-color: #5FB878;color: white;" @click="addEmpVisible = true" size="mini">新增</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" type="text" @click="open"
				size="mini">删除</el-button>
		</div>
		
		
		
		
		



		<div class="zxdj">
			<el-table :data="empData" border @selection-change="handleSelectionChange" ref="multipleTable" align>
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="empId" label="编号" align="center">
				</el-table-column>
				<el-table-column prop="empName" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="dept.deptName" label="部门" align="center">
				</el-table-column>
				<el-table-column prop="jobnumber" label="工号" align="center">
				</el-table-column>
				<!-- <el-table-column prop="empstate" label="职工状态" width="231">
					<template v-slot="scope">
						<p v-if="scope.row.empstate==0">在职</p>
						<p v-if="scope.row.empstate==1">离职</p>
					</template>
				</el-table-column> -->
				<el-table-column prop="empSex" label="性别" align="center">
				</el-table-column>
				<!-- <el-table-column prop="empPhone" label="电话"  align="center">
				</el-table-column>
				<el-table-column prop="eMail" label="电子邮件"  align="center">
				</el-table-column>
				<el-table-column prop="birthday" label="生日"  align="center">
				</el-table-column>
				<el-table-column prop="address" label="居住地址"  align="center">
				</el-table-column>
				<el-table-column prop="education" label="教育水平"  align="center">
				</el-table-column>
				<el-table-column prop="graduate" label="毕业学校"  align="center">
				</el-table-column>
				<el-table-column prop="remarks" label="备注"  align="center">
				</el-table-column> -->
				<el-table-column prop="enabled" label="限制登录状态" align="center">
					<template v-slot="scope">
						<p v-if="scope.row.enabled==true">不限制</p>
						<p v-if="scope.row.enabled==false">限制</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">

						<el-button v-if="scope.row.enabled==true" @click="stopEmpStateOpen(scope.row)" type="text"
							size="small" style="color: red;">停职</el-button>
						<el-button v-if="scope.row.enabled==false" @click="goEmpStateOpen(scope.row)" type="text"
							size="small" style="color: green;">复职</el-button>

						<el-button @click="selectEmpOpen(scope.row)" type="text" size="small">查看</el-button>
						<el-button @click="updateEmpOpen(scope.row)" type="text" size="small" style="color: gold;">编辑
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>

	<!-- 分页 -->
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
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
				<el-button @click="close()" size="small">关闭</el-button>
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
				<el-button @click="close()" size="small">关闭</el-button>
				<el-button type="primary" @click="updatemp()" size="small">保存</el-button>
			</span>
		</template>
	</el-dialog>

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
		data() {
			return {
				empData: [],
				deptData: [],
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 5, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				empForm: {
				},
				selectEmpVisible: false,
				updateEmpVisible: false,
				addEmpVisible:false
			}
		},
		methods: {
			
			updatemp(){
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateEmp",this.empForm, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(response) {
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
				
				// this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
				// 	params: this.pageInfo,
				// 	headers: {
				// 		'content-type': 'application/json',
				// 		'jwtAuth': _this.$store.getters.token
				// 	}
				// }).then(function(response) {
				// 	//console.log(response)
				// 	_this.empData = response.data.list
				// 	_this.pageInfo.total = response.data.total
				// }).catch(function(error) {
				// 	console.log(error)
				// })
				// var _this = this
				// this.axios.put("http://localhost:8089/tsm/updateEmp",{
				// 		this.empForm,
				// 		headers: {
				// 			'content-type': 'application/json',
				// 			'jwtAuth': _this.$store.getters.token
				// 		}
				// 	})
				// 	.then(function(response) {
				// 		console.log(response)
						
						
				// 	}).catch(function(error) {
				// 		console.log(error)
				// 	})
					// _this.axios.get("http://localhost:8089/tsm/selectAllEmp", {
					// 	params: _this.pageInfo,
					// 	headers: {
					// 		'content-type': 'application/json',
					// 		'jwtAuth': _this.$store.getters.token
					// 	}
					// }).then(function(response) {
					// 	//console.log(response)
					// 	_this.empData = response.data.list
					// 	_this.pageInfo.total = response.data.total
					// }).catch(function(error) {
					// 	console.log(error)
					// })
			},

			updateEmpOpen(row) {
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empId = row.empId
				this.empForm.empName = row.empName
				this.empForm.empSex = row.empSex

				
				this.empForm.empPhone = row.empPhone
				this.empForm.eMail = row.eMail
				this.empForm.birthday = row.birthday
				this.empForm.address = row.address
				this.empForm.remarks = row.remarks
				this.empForm.education = row.education
				this.empForm.graduate = row.graduate
				this.empForm.authorities=row.authorities
				// if (row.enabled == true) {
				// 	this.empForm.enabled = 0
				// } else {
				// 	this.empForm.enabled = 1
				// }
				//this.empForm.enabled=row.enabled
				
				// this.empForm.accountNonExpired=row.accountNonExpired
				// this.empForm.credentialsNonExpired=row.credentialsNonExpired
				// this.empForm.accountNonLocked=row.accountNonLocked
				
				this.updateEmpVisible = true
			},
			selectEmpOpen(row) {
				this.empForm.empName = row.empName
				this.empForm.deptId = row.dept.deptName
				this.empForm.jobnumber = row.jobnumber
				this.empForm.empSex = row.empSex
				this.empForm.education = row.education
				this.empForm.graduate = row.graduate
				this.empForm.empPhone = row.empPhone
				this.empForm.eMail = row.eMail
				this.empForm.birthday = row.birthday
				if (row.enabled == true) {
					this.empForm.empstate = "在职"
				} else {
					this.empForm.empstate = "离职"
				}
				this.empForm.address = row.address
				this.empForm.remarks = row.remarks
				this.selectEmpVisible = true
			},
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
			},
			close() {
				for (var key in this.empForm) {
					delete this.empForm[key];
				}
				this.updateEmpVisible = false
				this.selectEmpVisible = false
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

		}
	}
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
</style>
