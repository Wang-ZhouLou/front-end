<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>学员访谈</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<div style="margin-left: -910px;">
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" size="mini" type="text"
				@click="open">删除</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;

		<el-dialog title="访谈记录" v-model="dialogFormVisible">
			<el-form :model="form">
				<el-form-item>
					<div style="margin: -25px 0 0 25px ;font-size: 13px;">
						学号: {{form.studentId}}
						&nbsp;
						访谈学员: {{form.classesId}}
					</div>
					<div class="qdwh">
						<el-button style="background-color: #FF5722;color: white; width: 50px; margin-left: 610px;"
							size="mini" type="text" @click="de2()">删除
						</el-button>
						<el-table border style="width: 100%" size=mini :data="InterviewData"
							@selection-change="handleSelectionChange2" ref="multipleTable2">
							<el-table-column type="selection" width="55" align="center">
							</el-table-column>
							<el-table-column prop="interviewId" label="编号" width="150" align="center">
							</el-table-column>
							<el-table-column prop="interviewTime" label="访谈时间" width="120" align="center">
							</el-table-column>
							<el-table-column prop="interviewname" label="访谈人" width="120" align="center">
							</el-table-column>
							<el-table-column prop="progress" label="进展程度" width="120" align="center">
							</el-table-column>
							<el-table-column prop="theme" label="访谈主题" align="center">
							</el-table-column>
						</el-table>
					</div>
					<div style="margin: 20px 0 0 0;">
						访谈主题: <el-input v-model="intervie.theme" style="width: 190px;margin-right: 100px;">
						</el-input>
						进展程度: <el-input v-model="intervie.progress" style="width: 190px;">
						</el-input>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="close()">取 消</el-button>
					<el-button type="primary" @click="addinterview(row)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<div class="zxdj">
			<el-table :data="StudentData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="studentId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="studentName" label="姓名" width="180" align="center">
				</el-table-column>
				<el-table-column prop="studytime" label="报名日期" width="200" align="center">
				</el-table-column>
				<el-table-column prop="studentPhone" label="联系电话" width="180" align="center">
				</el-table-column>
				<el-table-column prop="classes.classesName" label="班级名称" width="160" align="center">
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="140" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="selAllInterview(scope.row)" type="text" size="small">访谈记录</el-button>
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
		methods: {
			//全选复选框
			SAll2() {
				this.$refs.multipleTable2.toggleAllSelection();
			},
			//取消选中的复选框
			NSel2() {
				this.$refs.multipleTable2.clearSelection();
			},
			//批量删除按钮
			de2() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld(); //调用请选择要删除的内容
				} else {
					this.multipleSelection.forEach(item => {
						this.delinterview(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange2(val) {
				this.multipleSelection = val;
			},
			//单个删除
			delinterview(row) {
				const _this = this
				this.intervie.deletename = this.$store.state.userInfo.userName; //获取当前登记人员名称
				this.intervie.timeliness = 1
				this.intervie.interviewId = row.interviewId
				this.axios.put("http://localhost:8089/tsm/delinterview", this.intervie, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllInterview?studentId=" + row.studentId, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.InterviewData = response.data
								console.log(response)
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			//新增访谈记录
			addinterview() {
				const _this = this
				this.intervie.addname = this.$store.state.userInfo.userName; //获取当前登记人员名称
				this.intervie.studentId = this.form.studentId
				this.intervie.classesId = this.form.classesId
				this.intervie.interviewname = this.$store.state.userInfo.userName; //获取当前登记人员名称
				console.log(this.form.studentId)
				console.log(this.form.classesId)
				this.axios.post("http://localhost:8089/tsm/addinterview", this.intervie, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						console.log(response)
						for (var key in _this.intervie) {
							delete _this.intervie[key];
						}
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selbystudentName", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
					})
					.then(function(response) {
						console.log(response.data)
						_this.StudentData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selbystudentName", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
					})
					.then(function(response) {
						_this.StudentData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			selAllInterview(row) {
				const _this = this
				this.form.studentId = row.studentId
				this.form.studentName = row.studentName
				this.form.classesId = row.classesId
				this.axios.get("http://localhost:8089/tsm/selAllInterview?studentId=" + row.studentId, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.InterviewData = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.axios.get("http://localhost:8089/tsm/selwjstudent", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.studentsData = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.classesData = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.dialogFormVisible = true
			},
			close() {
				for (var key in this.intervie) {
					delete this.intervie[key];
				}
				this.dialogFormVisible = false
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
			}
		},
		data() {
			return {
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				deld() {
					ElMessage({
						showClose: true,
						message: '请选择删除内容!',
						type: 'error'
					});
				},
				dels() {
					ElMessage({
						showClose: true,
						message: '删除成功!',
						type: 'success'
					});
				},
				form: {
					interviewname: "",
					theme: "",
					studentId: "",
					studentName: "",
					progress: "",
					addname: "",
					classesId: "",
					classes: ""
				},
				intervie: {
					interviewname: "",
					interviewId: "",
					theme: "",
					studentId: "",
					studentName: "",
					progress: "",
					addname: "",
					classesId: "",
					deletename: "",
					timeliness: ""
				},
				dialogFormVisible: false,
				options: [],
				optionss: [],
				input: ref(''),
				value: '',
				StudentData: [],
				InterviewData: [],
				studentsData: [],
				classesData: [],
				value1: ''
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selbystudentName", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo,

				})
				.then(function(response) {
					_this.StudentData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
