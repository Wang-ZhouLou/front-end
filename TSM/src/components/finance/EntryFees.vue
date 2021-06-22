<template>
	<div>
		<div>
			<font class="ksjs1" style="font-size: 13px;">审核:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<font class="ksjs1" style="font-size: 13px;">学员:</font>&nbsp;
			<el-input v-model="input" style="width: 140px;" size="mini"></el-input>&nbsp;
		</div>&nbsp;
		<div class="db1">
			<font class="ksjs1" style="font-size: 13px;">缴费日期:</font>&nbsp;
			<el-date-picker v-model="value1" type="daterange" size="mini" style="width: 200px;" range-separator="至"
				start-placeholder="开始日期" end-placeholder="结束日期">
			</el-date-picker>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" type="text" @click="pldele()"
				size="mini">删除
			</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;

		<el-dialog title="进行学费缴费" v-model="dialogFormVisible">
			<el-form :model="form">
				<el-form-item>
					<font style="margin: 0 0 0 50px;">编号: </font>
					<el-input v-model="form.feesId" disabled style="width: 520px;margin-bottom: 10px;">
					</el-input><br>
					<font style="margin: 0 0 0 20px;">缴费方式: </font>
					<el-select v-model="form.feesType" style="width: 520px; margin-bottom: 10px;">
						<el-option label="全额缴费" value="0">全额缴费</el-option>
						<el-option label="预缴学费" value="1">预缴学费</el-option>
					</el-select><br>
					<font style="margin: 0 0 0 20px;">应收金额: </font>
					<el-input v-model="form.course.courseMoney" style="width: 520px;margin-bottom: 10px;">
					</el-input><br>
					<font style="margin: 0 0 0 20px;">实收金额: </font>
					<el-input v-model="form.receipts" style="width: 520px;margin-bottom: 10px;">
					</el-input><br>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="close()">关闭</el-button>
					<el-button type="primary" @click="upentryfees">保 存</el-button>
				</span>
			</template>
		</el-dialog>

		<div class="zxdj">
			<el-table :data="entryfeesData" border style="width: 100%" @selection-change="handleSelectionChange"
				ref="multipleTable">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="feesId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="feesName" label="单据号" width="90" align="center">
				</el-table-column>
				<el-table-column prop="addtime" label="缴费日期" width="210" align="center">
				</el-table-column>
				<el-table-column prop="register.consultant" label="缴费学员" width="140" align="center">
				</el-table-column>
				<el-table-column prop="course.courseMoney" label="应收金额" width="120" align="center">
				</el-table-column>
				<el-table-column prop="feesType" label="缴费方式" width="120" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.feesType==0">全额缴费</p>
						<p v-if="slot.row.feesType==1">预缴学费</p>
					</template>
				</el-table-column>
				<el-table-column prop="receipts" label="实收金额/预缴金额" width="140" align="center">
				</el-table-column>
				<el-table-column prop="addname" label="录入人" width="100" align="center">
				</el-table-column>
				<el-table-column prop="feesState" label="状态" width="90" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.feesState==0"><i class="el-icon-warning"></i>
						</p>
						<p v-if="slot.row.feesState==1"><i class="el-icon-check"></i></p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="showEdit(scope.row)" type="text" size="small">收钱
						</el-button>
						<el-button type="text" size="small" @click="upPayState(scope.row)">审核通过</el-button>
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
			//修改缴费方式修改咨询登记中的缴费状态
			upPayState(row) {
				const _this = this
				row.paystate = 2
				this.axios.put("http://localhost:8089/tsm/upPayState", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.registerData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					})
				//报班点击审核通过修改缴费状态
				row.feesState = 1
				this.axios.put("http://localhost:8089/tsm/upfeesState", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.entryfeesData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					})
				//新增欠费记录表信息
				this.form2.registerId = row.registerId
				this.axios.post("http://localhost:8089/tsm/addmemorandumatt", this.form2, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						console.log(response)
						for (var key in _this.form2) {
							delete _this.form2[key];
						}
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
						this.deleAlls(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//修改报班缴费信息
			upentryfees() {
				const _this = this
				this.form.accumulated = this.form.course.courseMoney - this.form.receipts //剩余待缴=应收-实收
				this.axios.put("http://localhost:8089/tsm/upentryfees", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.entryfeesData = response.data.list
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
			showEdit(row) {
				this.form.feesId = row.feesId
				this.form.register = row.register
				this.form.receipts = row.receipts
				this.form.course = row.course
				this.form.feesAdvance = row.feesAdvance
				this.form.feesType = row.feesType
				this.dialogFormVisible = true
			},

			//删除
			deleAlls(row) {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/deleteEntryfees", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.entryfeesData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
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
			},
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.entryfeesData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.entryfeesData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
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
				dialogFormVisible: false,
				form: {
					feesAdvance: '',
					receipts: '',
					registerId: '',
					register: '',
					course: [],
					feesType: '',
				},
				form2: {
					registerId: '',
				},
				input: ref(''),
				value: '',
				entryfeesData: [],
				courseData: [],
				registerData: [],
				shortcuts: [{
					text: '最近一周',
					value: (() => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
						return [start, end]
					})(),
				}, {
					text: '最近一个月',
					value: (() => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
						return [start, end]
					})(),
				}, {
					text: '最近三个月',
					value: (() => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
						return [start, end]
					})(),
				}],
				value1: ''
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllentryfees", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.entryfeesData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/WJselAllcourse")
				.then(function(response) {
					console.log(response.data)
					_this.courseData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/WjselectregisterAll")
				.then(function(response) {
					console.log(response.data)
					_this.registerData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
