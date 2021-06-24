<template>
	<div>
		<div class="crumbs">
			<el-button style="background-color: #009688;color: white;width: 50px;" size="mini" type="text"
				@click="dialogFormVisible = true">增加
			</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" size="mini" type="text"
				@click="open">删除</el-button>

			<el-dialog title="新增教室" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item style="display: flex;justify-content: center;">
						教室名: <el-input v-model="form.classroomName" style="width: 250px;margin-right: 105px;">
						</el-input>
						<br />
						<br />
						容纳量:
						<el-input v-model="form.catacity" style="width: 250px;"></el-input>
						<br />
						<br />
						教室地点：<el-input v-model="form.place" style="width: 250px;margin-right: 105px;"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close()">关闭</el-button>
						<el-button type="primary" @click="addClassromm">保 存</el-button>
					</span>
				</template>
			</el-dialog>


			<el-dialog title="修改教室" v-model="dialogFormVisible2">
				<el-form :model="form">
					<el-form-item style="display: flex;justify-content: center;">
							教室编号:&nbsp; <el-input disabled="disabled"  v-model="form.classroomId" style=" width: 250px;margin-right: 105px;">
								</el-input>
							<br />
							<br />
							教室名: &nbsp;&nbsp;&nbsp;&nbsp; <el-input v-model="form.classroomName" style="width: 250px;margin-right: 105px;">
							</el-input>
							<br />
							<br />
							容纳量:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<el-input v-model="form.catacity" style="width: 250px;"></el-input>
							<br />
							<br />
							教室地点：<el-input v-model="form.place" style="width: 250px;margin-right: 105px;"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close()">关闭</el-button>
						<el-button type="primary" @click="updateclassroom">保 存</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
		<div>
			<el-table :data="ClassroomData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="classroomId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="classroomName" label="教室名" width="370" align="center">
				</el-table-column>
				<el-table-column prop="place" label="教室地点" width="370" align="center">
				</el-table-column>
				<el-table-column prop="catacity" label="容纳量" align="center">
				</el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<!-- #:v-slot 插槽
								scope定义对象的名字-->
					<template #default="scope">
						<el-button type="text" size="small" @click="showEidt(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="delclassroom(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

		</div>
	</div>
	<div class="block" style="margin:20px;display: flex;justify-content: center;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>

</template>

<script>
	import qs from 'qs'
	export default {
		methods: {
			close() {
				var _this = this
				for (var key in _this.form) {
					delete _this.form[key];
				}
				_this.dialogFormVisible = false
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
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/selectfinds", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.ClassroomData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectfinds", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
						params: this.pageInfo
					})
					.then(function(response) {
						_this.ClassroomData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			addClassromm() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/addclassroom", this.form,{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectfinds", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
								params: _this.pageInfo})
							.then(function(response) {
								_this.ClassroomData = response.data.list
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
			showEidt(row) {
				// 传当前行的值
				this.form.classroomId = row.classroomId
				this.form.classroomName = row.classroomName
				this.form.place = row.place
				this.form.catacity = row.catacity
				this.dialogFormVisible2 = true
			},
			updateclassroom() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updclassroom", this.form,{
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectfinds", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
								params: _this.pageInfo
							})
							.then(function(response) {
								_this.ClassroomData = response.data.list
								_this.pageInfo.total = response.data.total
								//console.log(_this.EnterpriseData[0])

							}).catch(function(error) {
								console.log(error)
							})

						_this.dialogFormVisible2 = false
					}).catch(function(error) {
						console.log("dddddddddd")
						console.log(error)
					})
			},
			delclassroom(row) {
				const _this = this
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.axios.put("http://localhost:8089/tsm/delclassroom/" + row,{
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
						.then(function(response) { // eslint-disable-line no-unused-vars
							var rows = _this.ClassroomData
								.filter(d => d.classroomId != row.classroomId)
							_this.ClassroomData = rows
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
			}

		},

		data() {
			return {
				dialogFormVisible: false,
				dialogFormVisible2: false,
				form: {
					classroomId: '',
					classroomName: '',
					place: '',
					Capacity: ''
				},
				pageInfo: {
					currentPage: 1,
					pagesize: 3,
					total: 0
				},
				ClassroomData: []
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectfinds", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
					params: this.pageInfo
				})
				.then(function(response) {
					console.log(response)
					_this.ClassroomData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
