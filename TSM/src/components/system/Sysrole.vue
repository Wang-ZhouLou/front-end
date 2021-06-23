<template>
	<div>
		<div class="crumbs">
			<font class="ksjs" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" size=mini style="width: 180px;">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-input v-model="pageInfo.flag" size="mini" placeholder="请输入内容" style="width: 140px;">
			</el-input>&nbsp;
			<el-button style="background-color: #5FB878;color: white; width: 50px;" size="mini" @click="selall">查询
			</el-button>
			<el-button style="background-color: #009688;color: white;width: 50px;" type="text" size="mini">增加
			</el-button>
			<el-button style="background-color: red;color: white;width: 50px;" type="text" size="mini"
				@click="pldele()">删除
			</el-button>


			<el-dialog title="设置模块权限" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item>
						<div class="custom-tree-container">
							<div class="block">
								<el-tree :data="data" show-checkbox node-key="id" default-expand-all
									:expand-on-click-node="false">
									<template #default="{ node, data }">
										<span class="custom-tree-node">
											<span>{{ node.label }}</span>
											<span>
												<a @click="append(data)">
													Append
												</a>
												<a @click="remove(node, data)">
													Delete
												</a>
											</span>
										</span>
									</template>
								</el-tree>
							</div>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible = false">关闭</el-button>
						<el-button type="primary" @click="addSource">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="设置操作权限" v-model="dialogFormVisible1">
				<el-form :model="form">
					<el-form-item>
						<div class="custom-tree-container">
							<div class="block">
								<el-tree :data="data" show-checkbox node-key="id" default-expand-all
									:expand-on-click-node="false">
									<template #default="{ node, data }">
										<span class="custom-tree-node">
											<span>{{ node.label }}</span>
											<span>
												<a @click="append(data)">
													Append
												</a>
												<a>
													<el-checkbox v-model="checked">备选项</el-checkbox>
													<el-checkbox v-model="checked1">备选项</el-checkbox>
													<el-checkbox v-model="checked2">备选项</el-checkbox>
													<el-checkbox v-model="checked3">备选项</el-checkbox>
												</a>
												<a @click="remove(node, data)">
													Delete
												</a>
											</span>
										</span>
									</template>
								</el-tree>
							</div>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible1 = false">关闭</el-button>
						<el-button type="primary" @click="addSource">保 存</el-button>
					</span>
				</template>
			</el-dialog>


		</div>&nbsp;
		<div class="qdwh">
			<el-table :data="roleData" border  @selection-change="handleSelectionChange"
				ref="multipleTable">
				<el-table-column type="selection"  width="55">
				</el-table-column>
				<el-table-column prop="id" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="roleName" label="角色名称" align="center">
				</el-table-column>
				<el-table-column prop="roleCode" label="英文名"  align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="handleClick" type="text" size="small">模块权限</el-button>
						<el-button type="text" size="small" @click="quanx">操作权限</el-button>
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
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line nzaao-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllrole", {
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
				this.axios.get("http://localhost:8089/tsm/selectAllrole", {
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
			handleClick() {
				this.dialogFormVisible = true
			},
			quanx() {
				this.dialogFormVisible1 = true
			},
			//级别新增
			append(data) {
				const newChild = {
					id: id++,
					label: 'testtest',
					children: []
				};
				if (!data.children) {
					data.children = []
				}
				data.children.push(newChild);
				this.data = [...this.data]
			},
			//级别删除
			remove(node, data) {
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);
				this.data = [...this.data]
			},
			//级别
			renderContent(h, {
				node,
				data,
				store // eslint-disable-line no-unused-vars
			}) {
				return h("span", {
					class: "custom-tree-node"
				}, h("span", null, node.label), h("span", null, h("a", {
					onClick: () => this.append(data)
				}, "Append "), h("a", {
					onClick: () => this.remove(node, data)
				}, "Delete")));
			}
		},
		data() {
			const data = [{ //层级
				id: 1,
				label: '一级 1',
				children: [{
					id: 4,
					label: '二级 1-1',
					children: [{
						id: 9,
						label: '三级 1-1-1'
					}, {
						id: 10,
						label: '三级 1-1-2'
					}]
				}]
			}, {
				id: 2,
				label: '一级 2',
				children: [{
					id: 5,
					label: '二级 2-1'
				}, {
					id: 6,
					label: '二级 2-2'
				}]
			}];
			return {
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}],
				value: '',
				data: JSON.parse(JSON.stringify(data)), //层级
				checked: false,
				checked1: false,
				checked2: false,
				checked3: false,
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
				select: '',
				dialogFormVisible: false,
				dialogFormVisible1: false,
				form: {
					sourceId: '',
					sourceName: '',
					potential: '',
					already: ''
				},
				search: ref(''),
				roleData: [],
				caozuoData: [{
					name: '王小虎',
					province: '上海'
				}],

			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllrole", {
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
		}
	}
</script>

<style>
</style>
