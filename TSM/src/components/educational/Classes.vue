<template>
	<div>
		<div class="crumbs">
			<font class="ksjs" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-input v-model="input" style="width: 140px;" size="mini" placeholder="请输入教室名称"></el-input>&nbsp;
			<el-button style="background-color: #5FB878;color: white;" size="mini">查询</el-button>
			<el-button style="background-color: #009688;color: white;width: 50px;" size="mini" type="text"
				@click="dialogFormVisible = true">增加
			</el-button>

			<el-dialog title="新增班级信息" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item label="班级名称" :label-width="formLabelWidth">
						<el-input v-model="form.classesName" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						班主任:
						<el-select v-model="form.empId" placeholder="选择班主任" autocomplete="off">
							<el-option v-for="item in emp2Data" :key="item.empId" :label="item.empName" :value="item.empId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						课程:
						<el-select v-model="form.courseId" placeholder="选择课程" autocomplete="off">
							<el-option v-for="item in courseData" :key="item.courseId" :label="item.courseName" :value="item.courseId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						教员:
						<el-select v-model="form.teacherId" placeholder="选择教员" autocomplete="off">
							<el-option v-for="item in empData" :key="item.empId" :label="item.empName" :value="item.empId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="班级人数容纳量" :label-width="formLabelWidth">
						<el-input v-model="form.classesSize" type="text" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="开班时间" :label-width="formLabelWidth">
						<el-input v-model="form.starteddate" type="date" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="addclasses">确 定</el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog title="编辑班级信息" v-model="dialogFormVisible2">
				<el-form :model="form">
					<el-form-item label="班级名称" :label-width="formLabelWidth">
						<el-input v-model="form.classesName" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						班主任:
						<el-select v-model="form.empId" placeholder="选择班主任" autocomplete="off">
							<el-option v-for="item in emp2Data" :key="item.empId" :label="item.empName" :value="item.empId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						课程:
						<el-select v-model="form.courseId" placeholder="选择课程" autocomplete="off">
							<el-option v-for="item in courseData" :key="item.courseId" :label="item.courseName" :value="item.courseId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						教员:
						<el-select v-model="form.teacherId" placeholder="选择教员" autocomplete="off">
							<el-option v-for="item in empData" :key="item.empId" :label="item.empName" :value="item.empId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="班级人数容纳量" :label-width="formLabelWidth">
						<el-input v-model="form.classesSize" type="text" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="开班时间" :label-width="formLabelWidth">
						<el-input v-model="form.starteddate" type="date" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible2 = false">取 消</el-button>
						<el-button type="primary" @click="updateClasses">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>&nbsp;
		<div class="qdwh">
			<el-table :data="classesData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column fixed prop="classesId" label="班级编号" width="160" align="center">
				</el-table-column>
				<el-table-column prop="classesName" label="班级名称" width="160" align="center">
				</el-table-column>
				<el-table-column prop="course.courseName" label="课程" width="160" align="center">
				</el-table-column>
				<el-table-column prop="emp2.empName" label="班主任姓名" width="160" align="center">
				</el-table-column>
				<el-table-column prop="emp.empName" label="教员姓名" width="160" align="center">
				</el-table-column>
				<el-table-column prop="classesSize" label="班级人数" width="160" align="center">
				</el-table-column>
				<el-table-column prop="classesOpen" label="开班状态" width="150" align="center">
					<template v-slot="scope">
						<p v-if="scope.row.classesOpen==0">未开班</p>
						<p v-if="scope.row.classesOpen==1">已开班</p>
					</template>
				</el-table-column>
				<el-table-column prop="starteddate" label="开班时间" width="150" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="deleteClasses(scope.row)" type="text" size="small">删除</el-button>
						<el-button type="text" size="small" @click="showEdit(scope.row)">
							<i class="el-icon-edit"></i>编辑
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

	<!-- 分页 -->
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>
</div>
</template>

<script>
	import {
		ref
	} from 'vue'
	export default {
		methods: {
			addclasses(){
				const _this = this
				this.axios.post("http://localhost:8089/tsm/addClasses", this.form,{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectClassesAll", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
								params: _this.pageInfo
							})
							.then(function(response) {
								_this.classesData = response.data.list
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
			deleteClasses(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteClasses", row,{
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
						.then(function(response) {
							console.log(response)
							var rows = _this.classesData
								.filter(d => d.classesId != row.classesId)
							_this.classesData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消删除!'
					});
				});
			},

			updateClasses(){
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateClasses", this.form,{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectClassesAll", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
								params: _this.pageInfo
							})
							.then(function(response) {
								_this.classesData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogFormVisible2 = false
						for (var key in _this.form) {
							delete _this.form[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) { //自动获取值并填入到form表单中
				this.form.classesId = row.classesId
				this.form.courseId = row.courseId
				this.form.teacherId = row.teacherId
				this.form.empId = row.empId
				this.form.detailcourseId = row.detailcourseId
				this.form.classesName = row.classesName
				this.form.classesOpen = row.classesOpen
				this.form.classesSize = row.classesSize
				this.form.starteddate = row.starteddate
				this.form.enddate = row.enddate
				this.form.lastdate = row.lastdate
				this.form.emp = row.emp
				this.form.emp2 = row.emp2
				this.form.course = row.course
				this.dialogFormVisible2 = true
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
			}
		},
		data() {
			return {
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					classesId: "",
					empId: "",
					teacherId:"",
					courseId:"",
					classesName: "",
					classesOpen: "",
					classesSize:"",
					starteddate: "",
					enddate: "",
					lastdate: "",
					emp:{},
					emp2:{},
					course:{}
					
				},
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				input: ref(''),
				value: '',
				classesData: [],
				empData:[],
				courseData:[],
				emp2Data:[],
				value1: ''
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectClassesAll", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
					params: this.pageInfo
				})
				.then(function(response) {
					console.log(response)
					_this.classesData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/WJselAllcourse",{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.courseData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/wjselectAllEmp",{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.empData = response.data
					_this.emp2Data = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
