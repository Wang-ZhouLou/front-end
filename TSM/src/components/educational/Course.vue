<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>班级管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<el-button size="mini" @click="dialogFormVisible = true">新增</el-button>
	<el-button size="mini" @click="del()" plain>删除</el-button>
	
	<el-dialog title="开设课程" v-model="dialogFormVisible">
		<el-form :model="form">
			<el-form-item label="课程类型" :label-width="formLabelWidth">
				<el-select v-model="form.classtype.classtypeId" placeholder="请选择开设课程类型">
					<el-option v-for="item in  classType" :key="item.classtypeId" :label="item.classtypeName"
						:value="item.classtypeId" />
				</el-select>
			</el-form-item>
			<el-form-item label="课程名称" :label-width="formLabelWidth">
				<el-input v-model="form.courseName" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="课时量" :label-width="formLabelWidth">
				<el-input v-model="form.classhours" autocomplete="off" style="width: 510px;"></el-input>&nbsp;节
			</el-form-item>
			<el-form-item label="课程费用" :label-width="formLabelWidth">
				<el-input v-model="form.courseMoney" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addcourse">确 定</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="编辑课程" v-model="dialogFormVisible2">
		<el-form :model="form">
			<el-form-item label="课程编号" :label-width="formLabelWidth">
				<el-input v-model="form.courseId" disabled autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="课程名称" :label-width="formLabelWidth">
				<el-input v-model="form.courseName" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="课时量" :label-width="formLabelWidth">
				<el-input v-model="form.classhours" autocomplete="off" style="width: 510px;"></el-input>&nbsp;节
			</el-form-item>
			<el-form-item label="课程费用" :label-width="formLabelWidth">
				<el-input v-model="form.courseMoney" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="updatecourse()">确 定</el-button>
			</span>
		</template>
	</el-dialog>
	<el-table border @selection-change="handleSelectionChange" ref="multipleTable" style="margin-top: 20px; width: 100%"
		:data="CourseData">
		<el-table-column type="selection" align="center" width="55">
		</el-table-column>
		<el-table-column label="编号" align="center" prop="courseId">
		</el-table-column>
		<el-table-column label="课程名称" align="center" prop="courseName">
		</el-table-column>
		<el-table-column label="课程类型" align="center" prop="classtype.classtypeName">
		</el-table-column>
		<el-table-column label="课时量" align="center" prop="classhours">
		</el-table-column>
		<el-table-column label="课程费用" align="center" prop="courseMoney">
		</el-table-column>
		<el-table-column label="课程状态" align="center" prop="courseState">
			<template v-slot="scope">
				<p v-if="scope.row.courseState=='0'">课程开报中</p>
				<p v-if="scope.row.courseState=='1'">课程停报中</p>
			</template>



		</el-table-column>
		<el-table-column label="操作" width="220" align="center">
			<template #header>
				<el-input @change="c1()" v-model="pageInfo.flag" size="mini" placeholder="输入课类名称搜索" />
			</template>
			<template v-slot="scope">
				<div style="display: flex;justify-content: center;">
					<el-button size="mini" type="info" @click="showEdit(scope.row)">编辑</el-button>
					&nbsp;

					<p v-if="scope.row.courseState=='0'">
						<el-button size="mini" type="info" @click="updatecourseState(scope.row)">停报</el-button>
					</p>
					<p v-if="scope.row.courseState=='1'">
						<el-button size="mini" type="info" @click="updatecourseState(scope.row)">开设</el-button>
					</p>
					&nbsp;
					<el-button type="info" size="mini" @click="delete1(scope.row)">删除</el-button>
				</div>
			</template>
		</el-table-column>
	</el-table>
	<div class="block" style="margin:20px;display: flex;justify-content: center;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>
</template>
<script>
	import qs from 'qs' // eslint-disable-line no-unused-vars
	// import ref from 'vue' 
	import {
		ElMessage
	} from 'element-plus'
	export default {
		data() {
			return {
				CourseData: [],
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					courseId: "",
					courseName: "",
					classhours: "",
					courseMoney: "",
					classtype: {},
					addname:"",
					updatename:"",
				},
				pageInfo: {
					currentPage: 1,
					pagesize: 8,
					total: 0,
					flag: ""
				},
				classType: [],
				formLabelWidth: '120px',
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
				}
			}
		},
		methods: {
			updatecourseState(row) {
				this.showEdit2(row)
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updatecoursestate", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllcourse", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: this.pageInfo
							})
							.then(function(response) {
								_this.CourseData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) {
				this.form.courseId = row.courseId
				this.form.courseName = row.courseName
				this.form.courseState = row.courseState
				this.form.classhours = row.classhours
				this.form.courseMoney = row.courseMoney
				this.form.classtype = row.classtype
				this.dialogFormVisible2 = true
			},
			showEdit2(row) {
				this.form.courseId = row.courseId
				this.form.courseName = row.courseName
				this.form.courseState = row.courseState
				this.form.classhours = row.classhours
				this.form.courseMoney = row.courseMoney
				this.form.classtype = row.classtype
			},
			updatecourse() { // eslint-disable-line no-unused-vars
				const _this = this
				this.form.updatename=this.$store.state.userInfo.userName;
				this.axios.put("http://localhost:8089/tsm/updatecourse", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllcourse", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},

								params: this.pageInfo
							})
							.then(function(response) {
								_this.CourseData = response.data.list
								_this.pageInfo.total = response.data.total
								//console.log(_this.EnterpriseData[0])
								_this.dialogFormVisible2 = false
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			addcourse() {
				const _this = this
				this.form.addname=this.$store.state.userInfo.userName;
				this.axios.post("http://localhost:8089/tsm/addcourse", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllcourse", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},

								params: _this.pageInfo
							})
							.then(function(response) {
								_this.CourseData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogFormVisible = false
						for (var key in _this.form) {
							delete _this.form[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selAllcourse", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},

						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.CourseData = response.data.list
					}).catch(function(error) {
						console.log(error)
					});
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selAllcourse", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},

						params: this.pageInfo
					})
					.then(function(response) {
						_this.CourseData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})

			},
			//全选复选框
			SAll() {
				this.$refs.multipleTable.toggleAllSelection();
			},
			//取消选中的复选框
			NSel() {
				this.$refs.multipleTable.clearSelection();
			},
			//批量删除按钮
			del() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.delete1(item)
					});
					this.dels();
				}
			}
			//总复选框的全选和取消全选
			,
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			delete1(row) {
				this.showEdit2(row)
				const _this = this
				this.row.deletename=this.$store.state.userInfo.userName;
				this.axios.put("http://localhost:8089/tsm/delcourse", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllcourse", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},

								params: this.pageInfo
							})
							.then(function(response) {
								_this.CourseData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			c1() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selAllcourse", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},

						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response)
						_this.CourseData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selAllcourse", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},

					params: this.pageInfo
				})
				.then(function(response) {
					console.log(response)
					_this.CourseData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/selectClasstypes", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token

					},
				})
				.then(function(response) {
					console.log(response)
					_this.classType = response.data
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>
