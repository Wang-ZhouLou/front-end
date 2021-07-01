<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>角色管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<div class="crumbs">
			<div style="margin-left: -860px;">
				<font class="ksjs" style="font-size: 13px;">快速检索:</font>&nbsp;
				<el-input v-model="pageInfo.rolename" size="mini" placeholder="请输入内容" style="width: 140px;">
				</el-input>&nbsp;
				<el-button style="background-color: #5FB878;color: white; width: 50px;" size="mini" @click="selall">查询
				</el-button>
				<el-button style="background-color: #009688;color: white;width: 50px;" @click="adddialogForm=true"
					type="text" size="mini">增加
				</el-button>
			</div>

			<el-dialog title="设置模块权限" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item>
						<div class="custom-tree-container">
							<div class="block">
								<el-tree :data="muens" show-checkbox node-key="id" :default-expanded-keys="xz"
									:check-strictly="true" :default-checked-keys="xz" :props="defaultProps" ref="tree">
								</el-tree>
							</div>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="colse()">关闭</el-button>
						<el-button type="primary" @click="updateAuter()">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="新增角色" v-model="adddialogForm">
				<el-form :model="form">
					<el-form-item label="中文名">
						<el-input v-model="role.roleName"></el-input>
					</el-form-item>
					<el-form-item label="英文名">
						<el-input v-model="role.roleCode"></el-input>
					</el-form-item>
					<el-form-item label="角色描述">
						<el-input v-model="role.roleDesc"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="colse()">关闭</el-button>
						<el-button type="primary" @click="addrole()">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="修改角色" v-model="updialogForm">
				<el-form :model="form">
					<el-form-item label="中文名">
						<el-input v-model="role.roleName"></el-input>
					</el-form-item>
					<el-form-item label="英文名">
						<el-input v-model="role.roleCode"></el-input>
					</el-form-item>
					<el-form-item label="角色描述">
						<el-input v-model="role.roleDesc"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="colse()">关闭</el-button>
						<el-button type="primary" @click="updRole()">保 存</el-button>
					</span>
				</template>
			</el-dialog>


		</div>&nbsp;
		<div class="qdwh">
			<el-table :data="roleData" border @selection-change="handleSelectionChange" ref="multipleTable">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="id" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="roleName" label="角色名称" align="center">
				</el-table-column>
				<el-table-column prop="roleCode" label="英文名" align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="handleClick(scope.row)" type="text" size="small">模块权限</el-button>
						<el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
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
	let id = 1000;
	import {
		ref
	} from 'vue'

	import qs from 'qs'
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			//模糊查询
			selall() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selAllmh", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.roleData = response.data.list
						_this.pageInfo.total = response.data.total
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
			},
			//修改角色信息
			updRole() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updRole", this.role, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selAllmh", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.roleData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})

						if (response.data.code == 200) {
							ElMessage.success({
								message: response.data.data,
								type: 'success'
							});
						} else if (response.data.code == 600) {
							ElMessage.error({
								message: response.data.message,
								type: 'success'
							});
							_this.$router.push({
								path: '/login'
							})
						} else if (response.data.code == '601') {
							ElMessage.error({
								message: response.data.message,
								type: 'success'
							});
						} else {
							ElMessage.error({
								message: response.data.message,
								type: 'success'
							});
						}

						for (var key in _this.role) {
							delete _this.role[key];
						}
						_this.updialogForm = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) { //自动获取值并填入到form表单中
				this.role.roleName = row.roleName
				this.role.roleCode = row.roleCode
				this.role.roleDesc = row.roleDesc
				this.role.id = row.id
				this.updialogForm = true
			},

			updateAuter() {
				const _this = this
				this.axios.delete("http://localhost:8089/tsm/delAuthorByroleid", {
					params: {
						"roleid": this.roleid,
						"Authors": qs.stringify(this.$refs.tree.getCheckedKeys())
					},
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(response) {
					console.log(response)
					if (response.data.code == 200) {
						ElMessage.success({
							message: response.data.data,
							type: 'success'
						});
					} else if (response.data.code == 600) {
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});

						_this.$router.push({
							path: '/login'
						})
					} else if (response.data.code == '601') {
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});
					} else {
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});
					}
				}).catch(function(error) {
					console.log(error)
				})
				this.dialogFormVisible = false
			},
			addrole() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertrole", this.role, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(response) {

					_this.$notify({
						title: '您刚刚执行了添加角色',
						message: '角色名:' + _this.role.roleName,
						duration: '7000'
					})
				}).catch(function(error) {
					console.log(error)
				})
				this.axios.get("http://localhost:8089/tsm/selAllmh", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.roleData = response.data.list
						_this.pageInfo.total = response.data.total
						//console.log(response)
						_this.role = {}
					}).catch(function(error) {
						console.log(error)
					})
			},
			//清空f
			colse() {
				this.xz = [];
				var _this = this
				for (var key in _this.role) {
					delete _this.role[key];
				}
				this.dialogFormVisible = false
				this.adddialogForm = false
				this.updialogForm = false
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line nzaao-unused-vars
				this.axios.get("http://localhost:8089/tsm/selAllmh", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.roleData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selAllmh", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.roleData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			//根据角色id查找权限
			handleClick(row) {
				this.xz = [];
				const _this = this
				this.roleid = row.id
				this.axios.get("http://localhost:8089/tsm/selectMenuByroleid", {
						params: {
							roleid: row.id
						},
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.rolemuens = response.data.data
						//console.log("----------")
						//console.log(_this.rolemuens)
						// _this.rolemuens.forEach((item) => {
						// 	item.asideChildren.forEach((item) => {
						// 		item.asideChildren.forEach((item) => {
						// 			_this.xz.push(item.id)
						// 		})
						// 	})
						// })
						_this.rolemuens.forEach((item) => {
							_this.xz.push(item.id)
						})
						_this.dialogFormVisible = true
						_this.$nextTick(() => {
							_this.$refs.tree.setCheckedKeys(_this.xz);
						});
					}).catch(function(error) {
						console.log(error)
					})


			}
		},
		data() {
			return {
				roleid: 0,
				//新增
				role: {},
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					rolename: ""
				},
				select: '',
				dialogFormVisible: false,
				updialogForm: false,
				adddialogForm: false,
				form: {
					roleName: '',
					roleCode: '',
					roleDesc: ''
				},
				search: ref(''),
				//角色
				roleData: [],
				//权限单角色
				rolemuens: [],
				//全权限
				muens: [],
				xz: [],
				//自定义
				defaultProps: {
					children: 'asideChildren',
					label: 'menuName'
				}
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selAllmh", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.roleData = response.data.list
					_this.pageInfo.total = response.data.total
					//console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/selectMenus", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.muens = response.data.data
					console.log(_this.muens)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
