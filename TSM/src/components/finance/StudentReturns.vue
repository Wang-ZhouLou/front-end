<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>学员退费管理</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<div style="margin-left: -775px;">
			<font class="ksjs1" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-input v-model="pageInfo.classesName" placeholder="请输入关键字" style="width: 140px;" size="mini">
			</el-input>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini" @click="selall">查询</el-button>
			<el-button style="background-color: #5FB878;color: white;width: 60px;" type="text" size="mini">审核通过
			</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" type="text" @click="pldele()"
				size="mini">删除
			</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;
		<div class="zxdj">
			<el-table :data="refundData" border style="width: 100%" @selection-change="handleSelectionChange"
				ref="multipleTable">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="refundId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="addtime" label="退费日期" width="140" align="center">
				</el-table-column>
				<el-table-column prop="register.consultant" label="姓名" width="110" align="center">
				</el-table-column>
				<el-table-column prop="classes.classesName" label="退学班级" width="210" align="center">
				</el-table-column>
				<el-table-column prop="course.courseName" label="退费课程" width="100" align="center">
				</el-table-column>
				<el-table-column prop="course.courseMoney" label="退还金额" width="140" align="center">
				</el-table-column>
				<el-table-column prop="addname" label="经办人" width="100" align="center">
				</el-table-column>
				<el-table-column prop="cwApproval" label="审核" align="center" width="90">
					<template v-slot="slot">
						<p v-if="slot.row.cwApproval==0"><i class="el-icon-warning"></i>
						</p>
						<p v-if="slot.row.cwApproval==1"><i class="el-icon-check"></i></p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button type="text" size="small" @click="upcwApproval(scope.row)">审核通过</el-button>
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
			upcwApproval(row) {
				const _this = this
				row.cwApproval = 1
				this.axios.put("http://localhost:8089/tsm/upcwApproval", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.refundData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					})
			},
			//退费模糊查询
			selall() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.refundData = response.data.list
						_this.pageInfo.total = response.data.total
						console.log(response)
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
			pldele() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.delRefund(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//单个删除
			delRefund(row) {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/delRefund", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.refundData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
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
				this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.refundData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.refundData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		data() {
			return {
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					classesName: ""
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
				input: ref(''),
				value: '',
				refundData: [],
				courseData: [],
				classesData: [],
				value1: ''
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/seleAllRefund", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.refundData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/WJselAllcourse", {
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
				this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.classesData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
