<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>日志查询</el-breadcrumb-item>
	</el-breadcrumb><br>
	<el-tabs type="border-card">
		<el-tab-pane label="登录日志">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<input type="date" v-model="pageInfo1.time" style="margin-right: 10px;width: 130px;background-color: white;
						border: 1px #B3C0D1 solid;color: #8C939D;border-radius: 4px;text-align: center;" />
					<el-input placeholder="请输入登录人姓名" v-model="pageInfo1.what" class="input-with-select"
						style="width: 500px;">
						<template #append>
							<el-button icon="el-icon-search" @click="selectLoByWhatOrTimeOrWAT"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="selectAllLoJ" style="margin-left: 10px;" size="small">
						查看所有登录日志<i class="el-icon-search el-icon--right"></i>
					</el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="loginData" border style="width: 1200px">
						<el-table-column type="index" :index="indexMethod1" width="100" align="center">
						</el-table-column>
						<el-table-column prop="emp.empName" label="登录人" width="550" align="center">
						</el-table-column>
						<el-table-column prop="logintime" label="登录时间" width="550" align="center">
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
						:current-page="pageInfo1.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo1.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="操作日志">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<!-- <el-date-picker v-model="pageInfo2.time" type="date" placeholder="选择日期"
						:disabled-date="disabledDate" :shortcuts="shortcuts" style="margin-right: 10px;">
					</el-date-picker> -->
					<input type="date" v-model="pageInfo2.time" style="margin-right: 10px;width: 130px;background-color: white;
						border: 1px #B3C0D1 solid;color: #8C939D;border-radius: 4px;text-align: center;" />
					<el-input placeholder="请输入内容" v-model="pageInfo2.what" class="input-with-select"
						style="width: 500px;">
						<template #prepend>
							<el-select v-model="selectCondition2" placeholder="请选择">
								<el-option label="操作人" value="1"></el-option>
								<el-option label="操作内容" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search" @click="selectOpByWhatOrTimeOrWAT"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="selectAllOpJ" style="margin-left: 10px;" size="small">
						查看所有操作日志<i class="el-icon-search el-icon--right"></i>
					</el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="opData" border style="width: 1200px">
						<el-table-column type="index" :index="indexMethod2" width="100" align="center">
						</el-table-column>
						<el-table-column prop="operator" label="操作人" width="366" align="center">
						</el-table-column>
						<el-table-column prop="opcontent" label="操作内容" width="366" align="center">
						</el-table-column>
						<el-table-column prop="optiome" label="操作时间" width="366" align="center">
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
						:current-page="pageInfo2.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo2.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo2.total">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import {
		defineComponent,
		ref
	} from 'vue'
	import qs from 'qs'
	import {
		ElMessage
	} from 'element-plus'
	export default defineComponent({
		data() {
			return {
				pageinfocondition1: '',
				pageinfocondition2: '',
				indexMethod1(index) {
					return index + 1;
				},
				indexMethod2(index) {
					return index + 1;
				},
				selectCondition1: '',
				selectCondition2: '',
				input3: ref(''),
				select: ref(''),
				dialogFormVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				value2: "",
				fileList: [],
				ruleForm: {
					suggest: '',
					title: '',
					type: '',
					starttime: '',
					endtime: '',
					remind: false,
					nature: '',
					name: '',
					remindtime: '',
					address: '',
					anonymous: false,
					upload: ''
				},
				rules: {
					title: [{
							required: true,
							message: '请填写标题',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 11,
							message: '长度在 1 到 11 个字符',
							trigger: 'blur'
						}
					],
					type: [{
						required: true,
						message: '请选择意见箱',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				memorandumData: [],
				pageInfo1: {
					what: '',
					time: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				pageInfo2: {
					what: '',
					time: '',
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				opData: [],
				loginData: []
			}
		},
		methods: {
			selectAllLoJ() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllLoginJPageInfo", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				}).then(function(response) {
					console.log(response)
					_this.pageinfocondition1 = 0
					_this.pageInfo1.time = ""
					_this.pageInfo1.what = ""
					_this.loginData = response.data.list
					_this.pageInfo1.total = response.data.total
					console.log(response.data.total)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectAllOpJ() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllOpJPageInfo", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo2
				}).then(function(response) {
					console.log(response)
					_this.pageinfocondition2 = 0
					_this.selectCondition2 = ""
					_this.pageInfo2.time = ""
					_this.pageInfo2.what = ""
					_this.opData = response.data.list
					_this.pageInfo2.total = response.data.total
					console.log(response.data.total)
					_this.$message({
						type: 'success',
						message: '查询成功'
					})
				}).catch(function(error) {
					console.log(error)
					_this.$message({
						type: 'info',
						message: '查询失败'
					})
				})
			},
			selectLoByWhatOrTimeOrWAT() {
				const _this = this
				if (this.pageInfo1.what != '') {
					if (this.pageInfo1.time != '') {
						this.axios.get("http://localhost:8089/tsm/selectLoginJByLoginTimeAndEmp", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						}).then(function(
							response) {
							console.log(response)
							_this.$message({
								type: 'success',
								message: '查询成功'
							})
							_this.pageinfocondition1 = 1
							_this.loginData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
							_this.$message({
								type: 'info',
								message: '查询失败'
							})
						})
					} else if (this.pageInfo1.time == '') {
						this.axios.get("http://localhost:8089/tsm/selectLoginJByEmp", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						}).then(function(
							response) {
							console.log(response)
							_this.$message({
								type: 'success',
								message: '查询成功'
							})
							_this.pageinfocondition1 = 2
							_this.loginData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
							_this.$message({
								type: 'info',
								message: '查询失败'
							})
						})
					} else {
						ElMessage.warning({
							message: '提醒！请选择条件进行查询！',
							type: 'warning',
							duration: '7000'
						});
					}
				} else if (this.pageInfo1.what == '') {
					if (this.pageInfo1.time != '') {
						this.axios.get("http://localhost:8089/tsm/selectLoginJByLoginTime", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						}).then(function(
							response) {
							console.log(response)
							_this.$message({
								type: 'success',
								message: '查询成功'
							})
							_this.pageinfocondition1 = 3
							_this.loginData = response.data.list
							_this.pageInfo1.total = response.data.total
						}).catch(function(error) {
							console.log(error)
							_this.$message({
								type: 'info',
								message: '查询失败'
							})
						})
					} else if (this.pageInfo1.time == '') {
						_this.pageInfo2.what = ""
						_this.pageInfo2.time = ""
						ElMessage.warning({
							message: '提醒！请选择条件进行查询！',
							type: 'warning',
							duration: '7000'
						});
					} else {
						ElMessage.warning({
							message: '提醒！请选择条件进行查询！',
							type: 'warning',
							duration: '7000'
						});
					}
				} else {
					_this.pageInfo2.what = ""
					_this.pageInfo2.time = ""
					ElMessage.warning({
						message: '提醒！请选择条件进行查询！',
						type: 'warning',
						duration: '7000'
					});
				}
			},
			selectOpByWhatOrTimeOrWAT() {
				const _this = this
				if (this.pageInfo2.time == '') {
					if (this.selectCondition2 == '1') {
						if (this.pageInfo2.what != '') {
							this.axios.get("http://localhost:8089/tsm/selectOpJByOperator", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: this.pageInfo2
							}).then(function(
								response) {
								console.log(response)
								_this.$message({
									type: 'success',
									message: '查询成功'
								})
								_this.pageinfocondition2 = 1
								_this.opData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
								_this.$message({
									type: 'info',
									message: '查询失败'
								})
							})
						} else {
							ElMessage.warning({
								message: '温馨提醒！请选择条件并输入条件内容或者选择时间进行查询！',
								type: 'warning',
								duration: '7000'
							});
						}
					} else if (this.selectCondition2 == '2') {
						if (this.pageInfo2.what != '') {
							this.axios.get("http://localhost:8089/tsm/selectOpJByOpcontent", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: this.pageInfo2
							}).then(function(
								response) {
								console.log(response)
								_this.$message({
									type: 'success',
									message: '查询成功'
								})
								_this.pageinfocondition2 = 2
								_this.opData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
								_this.$message({
									type: 'info',
									message: '查询失败'
								})
							})
						} else {
							ElMessage.warning({
								message: '温馨提醒！请选择条件并输入条件内容或者选择时间进行查询！',
								type: 'warning',
								duration: '7000'
							});
						}
					} else {
						ElMessage.warning({
							message: '温馨提醒！请选择条件并输入条件内容或者选择时间进行查询！',
							type: 'warning',
							duration: '7000'
						});
					}
				} else if (this.pageInfo2.time != '') {
					if (this.selectCondition2 == '') {
						if (this.pageInfo2.what == '') {
							this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiome", {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								},
								params: this.pageInfo2
							}).then(function(
								response) {
								console.log(response)
								_this.$message({
									type: 'success',
									message: '查询成功'
								})
								_this.pageinfocondition2 = 3
								_this.opData = response.data.list
								_this.pageInfo2.total = response.data.total
							}).catch(function(error) {
								console.log(error)
								_this.$message({
									type: 'info',
									message: '查询失败'
								})
							})
						} else {
							ElMessage.warning({
								message: '温馨提醒！如要同时选择时间和条件进行查询，请选择条件后输入条件内容并选择时间！',
								type: 'warning',
								duration: '7000'
							});
						}
					} else if (this.selectCondition2 != '') {
						if (this.pageInfo2.what == '') {
							ElMessage.warning({
								message: '温馨提醒！如要同时选择时间和条件进行查询，请选择条件后输入条件内容并选择时间！',
								type: 'warning',
								duration: '7000'
							});
						} else if (this.selectCondition2 == '1') {
							if (this.pageInfo2.what != '') {
								this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOperator", {
									headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									},
									params: this.pageInfo2
								}).then(function(
									response) {
									console.log(response)
									_this.$message({
										type: 'success',
										message: '查询成功'
									})
									_this.pageinfocondition2 = 4
									_this.opData = response.data.list
									_this.pageInfo2.total = response.data.total
								}).catch(function(error) {
									console.log(error)
									_this.$message({
										type: 'info',
										message: '查询失败'
									})
								})
							} else {
								ElMessage.warning({
									message: '温馨提醒！如要同时选择时间和条件进行查询，请选择条件后输入条件内容并选择时间！',
									type: 'warning',
									duration: '7000'
								});
							}
						} else if (this.selectCondition2 == '2') {
							if (this.pageInfo2.what != '') {
								this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOpContent", {
									headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									},
									params: this.pageInfo2
								}).then(function(
									response) {
									console.log(response)
									_this.$message({
										type: 'success',
										message: '查询成功'
									})
									_this.pageinfocondition2 = 5
									_this.opData = response.data.list
									_this.pageInfo2.total = response.data.total
								}).catch(function(error) {
									console.log(error)
									_this.$message({
										type: 'info',
										message: '查询失败'
									})
								})
							} else {
								ElMessage.warning({
									message: '温馨提醒！如要同时选择时间和条件进行查询，请选择条件后输入条件内容并选择时间！',
									type: 'warning',
									duration: '7000'
								});
							}
						}
					}else {
						ElMessage.warning({
							message: '温馨提醒！请选择条件并输入条件内容或者选择时间进行查询！',
							type: 'warning',
							duration: '7000'
						});
					}
				} else {
					ElMessage.warning({
						message: '温馨提醒！请选择条件并输入条件内容或者选择时间进行查询！',
						type: 'warning',
						duration: '7000'
					});
				}
			},
			handleSizeChange1(pagesize) {
				var _this = this
				this.pageInfo1.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo1)
				console.log(ps)
				if (this.pageinfocondition1 == '1') {
					this.axios.get("http://localhost:8089/tsm/selectLoginJByLoginTimeAndEmp", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						})
						.then(function(response) {
							console.log(response.data)
							_this.loginData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition1 == '2') {
					this.axios.get("http://localhost:8089/tsm/selectLoginJByEmp", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						})
						.then(function(response) {
							console.log(response.data)
							_this.loginData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition1 == '3') {
					this.axios.get("http://localhost:8089/tsm/selectLoginJByLoginTime", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						})
						.then(function(response) {
							console.log(response.data)
							_this.loginData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else {
					this.axios.get("http://localhost:8089/tsm/selectAllLoginJPageInfo", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo1
						})
						.then(function(response) {
							console.log(response.data)
							_this.loginData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				}
			},
			handleCurrentChange1(currentPage) {
				var _this = this
				this.pageInfo1.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectAllLoginJPageInfo", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo1
					})
					.then(function(response) {
						_this.loginData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange2(pagesize) {
				var _this = this
				this.pageInfo2.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo2)
				console.log(ps)
				if (this.pageinfocondition2 == '1') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOperator", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition2 == '2') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOperator", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition2 == '3') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpcontent", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition2 == '4') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOpContent", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition2 == '5') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiome", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else {
					this.axios.get("http://localhost:8089/tsm/selectAllOpJPageInfo", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							console.log(response.data)
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				}
			},
			handleCurrentChange2(currentPage) {
				var _this = this
				this.pageInfo2.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo2) // eslint-disable-line no-unused-vars
				console.log(this.pageinfocondition)
				if (this.pageinfocondition == '1') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOperator", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition == '2') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOperator", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition == '3') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpcontent", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition == '4') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiomeAndOpContent", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.pageinfocondition == '5') {
					this.axios.get("http://localhost:8089/tsm/selectOpJByOpTiome", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				} else {
					this.axios.get("http://localhost:8089/tsm/selectAllOpJPageInfo", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: this.pageInfo2
						})
						.then(function(response) {
							_this.opData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				}
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllOpJPageInfo", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
				params: this.pageInfo2
			}).then(function(response) {
				console.log(response)
				_this.opData = response.data.list
				_this.pageInfo2.total = response.data.total
				console.log(response.data.total)
			}).catch(function(error) {
				console.log(error)
			})
			this.axios.get("http://localhost:8089/tsm/selectAllLoginJPageInfo", {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				},
				params: this.pageInfo1
			}).then(function(response) {
				console.log(response)
				_this.loginData = response.data.list
				_this.pageInfo1.total = response.data.total
			}).catch(function(error) {
				console.log(error)
			})
		}
	});
</script>

<style>
	.el-select .el-input {
		width: 130px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.addcontent {
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
	}

	.addcontent1 {
		width: 100%;
	}

	.addcontent_line {
		width: 100%;
		height: 65px;
	}

	.textarea {
		height: 155px;
	}

	.upload {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>
