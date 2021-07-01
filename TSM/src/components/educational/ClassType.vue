<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>课类维护</el-breadcrumb-item>
	</el-breadcrumb><br>
	<el-button size="mini" @click="dialogFormVisible = true">新增</el-button>
	<!-- <el-button @click="delmany" type="danger" size="mini" :disabled="this.multipleSelection.length==0">批量删除</el-button> -->
	<!-- <el-dialog title="课类操作详情" v-model="dialogFormVisible3">
		<el-form :model="form">
			<el-form-item label="增加人:" :label-width="formLabelWidth">
				<el-input v-model="form.addname" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="增加时间" :label-width="formLabelWidth">
				<el-input v-model="form.addtime" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="删除人" :label-width="formLabelWidth">
				<el-input v-model="form.deletename" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="删除时间" :label-width="formLabelWidth">
				<el-input v-model="form.deletetime" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="修改人" :label-width="formLabelWidth">
				<el-input v-model="form.updatename" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="最后修改时间" :label-width="formLabelWidth">
				<el-input v-model="form.updatetime" autocomplete="off" disabled></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible3 = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
			</span>
		</template>
	</el-dialog> -->
	<el-dialog title="新增课类名称" v-model="dialogFormVisible">
		<el-form :model="form">
			<el-form-item label="课类名称" :label-width="formLabelWidth">
				<el-input v-model="form.classtypeName" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addClasstype">确 定</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog title="编辑课类名称" v-model="dialogFormVisible2">
		<el-form :model="form">
			<el-form-item label="课类编号" :label-width="formLabelWidth">
				<el-input v-model="form.classtypeId" autocomplete="off" disabled></el-input>
			</el-form-item>
			<el-form-item label="课类名称" :label-width="formLabelWidth">
				<el-input v-model="form.classtypeName" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="updateDept">确 定</el-button>
			</span>
		</template>
	</el-dialog>
	<!-- .filter(data => !search || data.classtypeName.toLowerCase().includes(search.toLowerCase()))" -->
	<el-table @selection-change="handleSelectionChange" :data="tableData">
		<!-- <el-table-column type="selection" width="55">
		</el-table-column> -->
		<el-table-column label="编号" prop="classtypeId">
		</el-table-column>
		<el-table-column label="课类名称" prop="classtypeName">
		</el-table-column>
		<!-- <el-table-column label="时效性" prop="timeliness">
		</el-table-column> -->
		<el-table-column align="right">
			<template #header>
				<el-input v-model="search" size="mini" placeholder="输入课类名称搜索" />
			</template>
			<template #default="scope">
				<!-- <el-button size="mini" type="info" @click="showEdit2(scope.row)">详情</el-button> -->
				<el-button size="mini" type="info" @click="showEdit(scope.row)">编辑</el-button>
				<el-button type="info" size="small" @click="delClasstype(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>
</template>


<script>
	import qs from "qs"

	export default {

		data() {
			return {
				pageInfo: {
					currentPage: 1, //标识当前页码
					pagesize: 8, //每页多少条数据
					total: 0
				},

				tableData: [],
				search: '',
				delarr: [], //存放删除的数据
				multipleSelection: [],
				dialogFormVisible: false,
				dialogFormVisible2: false,
				dialogFormVisible3: false,
				form: {
					classtypeId: '',
					classtypeName: '',
					addname: "",
					addtime: "",
					updatename: "",
					updatetime: "",
					deletename: "",
					deletetime: "",
					timeliness: ""
				},
				formLabelWidth: '120px'
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectClasstypes", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log(response)
					_this.tableData = response.data
				}).catch(function(error) {
					console.log(error)
				})

			this.axios.get("http://localhost:8089/tsm/selectClasstypeAll", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},

					params: this.pageInfo
				})
				.then(function(response) {
					console.log(response)
					_this.tableData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})

		},
		methods: {
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectClasstypeAll", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},

						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectClasstypeAll", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},

						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},

			// 多选删除
			// delmany() {
			// 	this.multipleSelection=[];
			// 	console.log("aaa")
			// 	const _this = this
			// 	const length = this.multipleSelection.length;

			// 	for (let i = 0; i < length; i++) {
			// 		// console.log(this.multipleSelection[i])
			// 		this.delarr.push(this.multipleSelection[i].classtypeId);
			// 		console.log(this.delarr[i])
			// 	}
			// 	// const _this = this
			// 	console.log(this.delarr)
			// 	console.log("aaa")
			// 	_this.axios.put("http://localhost:8089/tsm/deleteMoreClassType",this.delarr+"/"+"deletename")
			// 		.then(function(response) { // eslint-disable-line no-unused-vars
			// 			console.log("成功删除？成功传输！") // eslint-disable-line no-unused-vars
			// 			console.log(response)
			// 		}).catch(function(error) {
			// 			console.log("成功删除？ 失败！")
			// 			console.log(error)
			// 		})
			// },
			showEdit2(row) {
				this.form.addname = row.addname
				this.form.addtime = row.addtime
				this.form.updatename = row.updatename
				this.form.updatetime = row.updatetime
				this.form.deletename = row.deletename
				this.form.deletetime = row.deletetime
				this.dialogFormVisible3 = true
			},

			handleSelectionChange(val) {
				// const _this=this
				val.forEach((val, index) => { // eslint-disable-line no-unused-vars
					this.tableData.forEach((v, i) => { // eslint-disable-line no-unused-vars
						// id 是每一行的数据id
						if (val.classtypeId == v.classtypeId) {
							this.multipleSelection = val;
							console.log(val.classtypeId);
						}
					})
				})

			},

			showEdit(row) {
				this.form.classtypeId = row.classtypeId
				this.form.classtypeName = row.classtypeName
				this.dialogFormVisible2 = true
			},
			addClasstype() {
				const _this = this
				this.form.addname=this.$store.state.userInfo.userName;
				this.axios.post("http://localhost:8089/tsm/addClasstypes", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						var classtype = response.data
						_this.tableData.push(classtype)
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					});

			},
			updateDept() {
				const _this = this
				console.log(this.form)
				this.form.updatename=this.$store.state.userInfo.userName;
				this.axios.put("http://localhost:8089/tsm/updateClasstypes", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						var classtype = response.data
						var row = _this.tableData.filter(c => c.classtypeId == classtype.classtypeId)[0]
						row.classtypeName = classtype.classtypeName
						_this.dialogFormVisible2 = false
					}).catch(function(error) {
						console.log(error)
					}).catch(() => {
						this.$message({
							type: 'error',
							message: '取消删除!'
						});
					});
			},


			delClasstype(row) {
				const _this = this
				this.row.deletename=this.$store.state.userInfo.userName;
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.axios.put("http://localhost:8089/tsm/deleteClasstypes/", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})

						.then(function(response) { // eslint-disable-line no-unused-vars

							var rows = _this.tableData
								.filter(c => c.classtypeId != row.classtypeId)
							console.log("del rows:%o", rows)
							_this.tableData = rows
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消删除!'
					});
				});
			}

		}
	}
</script>
