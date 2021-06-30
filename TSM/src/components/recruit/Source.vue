<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>生源渠道</el-breadcrumb-item>
	</el-breadcrumb>
	<div>
		<div class="crumbs" style="margin-left: -860px;">
			<font class="ksjs" style="font-size: 13px;">快速检索:</font>&nbsp;
			<!-- @change=selall -->
			<el-input v-model="pageInfo.flag" size="mini" placeholder="生源渠道模糊搜索" style="width: 140px;">
			</el-input>&nbsp;
			<el-button style="background-color: #5FB878;color: white; width: 50px;" size="mini" @click="selall">查询
			</el-button>
			<el-button style="background-color: #009688;color: white;width: 50px;" type="text" size="mini"
				@click="dialogFormVisible = true">增加
			</el-button>
			<el-button style="background-color: red;color: white;width: 50px;" type="text" size="mini"
				@click="pldele()">删除
			</el-button>


			<el-dialog title="新增生源渠道信息" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item>
						生源渠道: <el-input v-model="form.sourceName" style="width: 650px;margin-bottom: 10px;"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible = false">关闭</el-button>
						<el-button type="primary" @click="addSource">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="修改生源渠道信息" v-model="dialogFormVisible1">
				<el-form :model="form">
					<el-form-item>
						&nbsp; &nbsp; &nbsp; &nbsp;编号: <el-input disabled v-model="form.sourceId"
							style="width: 650px;margin-bottom: 10px;">
						</el-input><br>
						生源渠道: <el-input v-model="form.sourceName" style="width: 650px;margin-bottom: 10px;"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close()">关闭</el-button>
						<el-button type="primary" @click="updsource">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog v-model="dialogFormVisible2">
				<el-form :model="form1">
					<el-form-item>
						<div style="font-size: 16px;margin-top: -20px;">
							<b>{{form.sourceName}}的学员列表信息</b>
						</div>
					</el-form-item>
					<el-table :data="studnetData" border style="width: 100%" size=mini>
						<el-table-column type="selection" align="center" width="55">
						</el-table-column>
						<el-table-column label="编号" align="center" prop="studentId">
						</el-table-column>
						<el-table-column label="报名日期" align="center" prop="studytime">
						</el-table-column>
						<el-table-column label="姓名" align="center" prop="studentName">
						</el-table-column>
						<el-table-column label="联系地址" align="center" prop="address">
						</el-table-column>
						<el-table-column label="联系电话" align="center" prop="studentPhone">
						</el-table-column>
						<el-table-column label="性别" align="center" prop="sex">
						</el-table-column>
						<el-table-column label="学号" align="center" prop="studentNumber">
						</el-table-column>
					</el-table>
				</el-form>
				<div style="margin-bottom: 200px;"></div>
				<template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="close1()">关闭</el-button>
					</span>
				</template>

			</el-dialog>

		</div>&nbsp;
		<div class="qdwh">
			<el-table :data="sourceData" border style="width: 100%" @selection-change="handleSelectionChange"
				ref="multipleTable">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="sourceId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="sourceName" label="生源渠道" width="800" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="selStudent(scope.row)" type="text" size="small">查看学员</el-button>
						<el-button type="text" size="small" @click="showEdit(scope.row)">
							<i class="el-icon-edit"></i>编辑
						</el-button>
						<el-button type="text" size="small" @click="deleteupdSource(scope.row)">
							删除
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
			close1() {
				var _this = this
				for (var key in _this.studnetData) {
					delete _this.studnetData[key];
				}
				_this.dialogFormVisible2 = false
			},
			selStudent(row) {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/seleSourceId?sourceId=" + row.sourceId, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.studnetData = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.form.sourceName = row.sourceName
				this.dialogFormVisible2 = true
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
			pldele() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.delete1(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//模糊查询
			selall() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllSources", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.sourceData = response.data.list
						_this.pageInfo.total = response.data.total
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
			},
			//修改
			updsource() {
				const _this = this
				this.form.lastupdatename = this.$store.state.userInfo.userName;
				this.axios.put("http://localhost:8089/tsm/updSource", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllSources", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.sourceData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogFormVisible1 = false
						for (var key in _this.form) {
							delete _this.form[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) { //自动获取值并填入到form表单中
				this.form.sourceId = row.sourceId
				this.form.sourceName = row.sourceName
				this.form.already = row.already
				this.form.potential = row.potential
				this.dialogFormVisible1 = true
			},
			//批量删除
			delete1(row) {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/deleteupdSource", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllSources", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.sourceData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			//单个删除
			deleteupdSource(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteupdSource", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							var rows = _this.sourceData
								.filter(d => d.sourceId != row.sourceId)
							_this.sourceData = rows
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
			//新增
			addSource() {
				const _this = this
				this.form.addchannelname = this.$store.state.userInfo.userName; //获取当前登记人员名称
				this.axios.post("http://localhost:8089/tsm/addsource", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllSources", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.sourceData = response.data.list
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
			close() {
				var _this = this
				for (var key in _this.form) {
					delete _this.form[key];
				}
				_this.dialogFormVisible = false
				_this.dialogFormVisible1 = false
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllSources", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.sourceData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllSources", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.sourceData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleClick(row) {
				console.log(row);
			}
		},
		data() {
			return {
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
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				dialogFormVisible: false,
				dialogFormVisible1: false,
				dialogFormVisible2: false,
				form: {
					addchannelname: "",
					lastupdatename: "",
					sourceId: '',
					sourceName: "",
					potential: '',
					already: ''
				},
				search: ref(''),
				value: '',
				sourceData: [],
				studnetData: [],
			}
		},
		created() {
			const _this = this
			console.log("tokeN:" + _this.$store.getters.token);
			this.axios.get("http://localhost:8089/tsm/selectAllSources", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.sourceData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
