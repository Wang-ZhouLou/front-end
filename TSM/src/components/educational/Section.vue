<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>课段设置</el-breadcrumb-item>
	</el-breadcrumb>
	<div style="margin-left: -1160px;margin-top: 10px;">
		<el-button @click="addTrainingPeriod()" type="primary" size="mini" plain style="margin-bottom: 10px;">+ 课段
		</el-button>
	</div>
	<div>
		<div>
			<el-table :data="TrainingPeriodData" border style="width: 100%" @selection-change="handleSelectionChange()"
				ref="multipleTable">
				<el-table-column type="selection" min-width="60">
				</el-table-column>
				<el-table-column type="index" min-width="60" align="center" :index="indexMethod" label="编号">
				</el-table-column>
				<el-table-column min-width="60" prop="period" width="800" label="培训时段" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button @click="showEdit(scope.row)" type="text" size="small">
							<i class="el-icon-edit"></i>修改
						</el-button>
						<el-button @click="delSelectAllTrainingPeriod(scope.row)" type="text" size="small">
							<i class="el-icon-edit"></i>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="block">
			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="pageInfo.currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
				class="el-block-showtable-one-s">
			</el-pagination>
		</div>
	</div>
	<!-- 弹窗 -->
	<el-dialog title="增加课段信息" v-model="dialogVisible" width="30%" :before-close="handleClose">
		<el-form :model="TrainingPeriod" :rules="rules" ref="TrainingPeriod" label-width="100px" class="demo-ruleForm">
			<el-form-item label="培训时段:" prop="period">
				<el-input v-model="TrainingPeriod.period" placeholder="请输入培训时段"></el-input>
			</el-form-item>
			<el-form-item class="el-form-butt-show-one-s">
				<el-button type="primary" @click="addTrainingPeriodData('TrainingPeriod')">立即创建</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<el-dialog title="修改课段信息" v-model="dialogVisible2" width="30%" :before-close="handleClose">
		<el-form :model="TrainingPeriod" :rules="rules" ref="TrainingPeriod" label-width="100px" class="demo-ruleForm">
			<el-form-item label="培训时段:" prop="period">
				<el-input v-model="TrainingPeriod.period" placeholder="请输入培训时段"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="updateTrainingPeriod('TrainingPeriod')">立即修改</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
	import {
		ElMessage
	} from 'element-plus'
	export default {
		data() {
			return {
				dialogVisible: false,
				dialogVisible2: false,
				TrainingPeriod: {
					periodId: "",
					period: "",
					addname: "",
					addtime: "",
					updatename: "",
					updatetime: "",
					deletename: "",
					deletetime: "",
					timeliness: ""
				},
				rules: {
					period: [{
							required: true,
							message: '请输入培训时段',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在1到50个字符',
							trigger: 'blur'
						}
					]
				},
				pageInfo: {
					currentPage: 1,
					pagesize: 5,
					total: 12
				},
				input3: "",
				value1: true,
				TrainingPeriodData: []
			}
		},
		methods: {
			handleClose(done) {
				this.$confirm('确定关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			addTrainingPeriod() {
				this.dialogVisible = true;
				Object.keys(this.TrainingPeriod).forEach((key) => (this.TrainingPeriod[key] = ""))
			},
			addTrainingPeriodData(TrainingPeriod) {
				this.TrainingPeriod.addname = this.$store.state.userInfo.userName
				this.TrainingPeriod.timeliness = 0
				const _this = this
				console.log(this.TrainingPeriod)
				this.axios.post("http://localhost:8089/tsm/addTrainingPeriod", this.TrainingPeriod, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.FindTrainingPeriod();
						_this.dialogVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			indexMethod(index) {
				return index + 1 + (this.pageInfo.currentPage - 1) * this.pageInfo.pagesize;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			showEdit(row) {
				this.TrainingPeriod.periodId = row.periodId
				this.TrainingPeriod.period = row.period
				this.TrainingPeriod.updatename = this.$store.state.userInfo.userName
				this.TrainingPeriod.addname = null
				this.dialogVisible2 = true
			},
			updateTrainingPeriod(TrainingPeriod) {
				this.$refs[TrainingPeriod].validate((valid) => {
					if (valid) {
						const _this = this
						this.axios.put("http://localhost:8089/tsm/updateByTrainingPeriodKey", this
								.TrainingPeriod, {
									headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									}
								})
							.then(function(response) {
								_this.dialogVisible2 = false
								_this.FindTrainingPeriod();
							}).catch(function(error) {
								console.log(error)
							})
					} else {
						console.log("修改失败！");
						return false;
					}
				})
			},
			delSelectAllTrainingPeriod(row) {
				this.TrainingPeriod.periodId = row.periodId
				this.TrainingPeriod.deletename = this.$store.state.userInfo.userName
				var flag = true
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const _this = this
					this.axios.put("http://localhost:8089/tsm/deleteByTrainingPeriod", this.TrainingPeriod, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.FindTrainingPeriod();
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(function(error) {
					console.log(error)
				})
			},
			handleCurrentChange(page) {
				var _this = this
				this.pageInfo.currentPage = page;
				this.axios.get("http://localhost:8089/tsm/selectAllTrainingPeriod", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						_this.TrainingPeriodData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange(size) {
				var _this = this
				this.pageInfo.pagesize = size;
				this.axios.get("http://localhost:8089/tsm/selectAllTrainingPeriod", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						_this.TrainingPeriodData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			},
			FindTrainingPeriod() {
				var _this = this
				console.log(this.pageInfo.currentPage, this.pageInfo.pagesize)
				this.axios.get("http://localhost:8089/tsm/selectAllTrainingPeriod", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						_this.TrainingPeriodData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		created() {
			var _this = this
			console.log(this.pageInfo.currentPage, this.pageInfo.pagesize)
			this.axios.get("http://localhost:8089/tsm/selectAllTrainingPeriod", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log(response)
					_this.TrainingPeriodData = response.data.list
					_this.pageInfo.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
	.el-center-top-labels {
		background-color: #FFF;
		height: 99px;
		margin-bottom: 20px;
	}

	.el-col {
		border-radius: 0px;
	}

	.el-center-title-content {
		padding: 16px 32px 0 32px;
	}

	.ivu-page-header-main {
		width: 100%;
	}

	.ivu-page-header-row {
		width: 100%;
	}

	.ivu-page-header-title {
		margin-bottom: 16px;
	}

	.ivu-page-header-title {
		display: inline-block;
		color: #17233d;
		font-weight: 500;
		font-size: 20px;
	}

	.ivu-page-header-content {
		font-size: 14px;
		margin-bottom: 16px;
		color: #515a6e;
	}

	.el-table-show-one-s {
		margin: 0 23px;
	}

	.el-select-table-one-s {
		float: left;
		margin-left: 30px;
		margin-top: 15px;
		font-size: 14px;
		color: #515a6e;
	}

	.el-select-table-two-s {
		margin-top: 15px;
		margin-right: 30px;
		float: right;
	}

	.el-input-one-s {
		height: 32px;
		width: 193px;
		margin-right: 30px;
	}

	.el-input--suffix .el-input__inner {
		padding-right: 30px;
		height: 30px;
	}

	.grid-content2 {
		height: 65px;
		border-radius: 0px;
	}

	.bg-purple-dark1 {
		background: #FFF;
	}

	.el-top-background-one-s {
		-webkit-border-top-left-radius: 4px;
		-webkit-border-top-right-radius: 4px;
	}

	.el-table-one-s {
		padding-top: 20px;
		height: 100%;
		padding-left: 15px;
		padding-right: 15px;
	}

	.el-table__body-wrapper {
		height: 100%;
	}

	.el-pagin-show-one-s {
		padding-top: 15px;
		padding-bottom: 15px;
		background: #FFF;
		margin-bottom: 30px;
		-webkit-border-bottom-left-radius: 4px;
		-webkit-border-bottom-right-radius: 4px;
	}

	/* switch按钮样式 */
	.switch .el-switch__label {
		position: absolute;
		display: none;
		color: #fff !important;
	}

	/*打开时文字位置设置*/
	.switch .el-switch__label--right {
		z-index: 1;
	}

	/* 调整打开时文字的显示位子 */
	.switch .el-switch__label--right span {
		margin-right: 9px;
	}

	/*关闭时文字位置设置*/
	.switch .el-switch__label--left {
		z-index: 1;
	}

	/* 调整关闭时文字的显示位子 */
	.switch .el-switch__label--left span {
		margin-left: 9px;
	}

	/*显示文字*/
	.switch .el-switch__label.is-active {
		display: block;
	}

	/* 调整按钮的宽度 */
	.switch.el-switch .el-switch__core,
	.el-switch .el-switch__label {
		width: 60px !important;
		margin: 0;
	}

	.el-table .cell {
		padding-left: 9px;
	}
</style>
