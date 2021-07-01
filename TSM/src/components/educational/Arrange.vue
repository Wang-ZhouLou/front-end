<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>排课</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div style="margin-left: -950px;">
		<el-button style="background-color: #009688;color: white; width: 100px;" size="mini" @click="addClick()">设置排课信息
		</el-button>
		<el-button style="background-color: #5FB878;color: white;width: 100px;" type="text" size="mini"
			@click="appClick()">审核排课信息
		</el-button>
	</div><br>
	<div>
		<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange()"
			ref="multipleTable">
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" :index="indexMethod" label="编号">
			</el-table-column>
			<el-table-column prop="classesVo.classesName" label="班级名称" align="center">
			</el-table-column>
			<el-table-column prop="classRoomVo.classroomName" label="教室名称" align="center">
			</el-table-column>
			<el-table-column prop="empVo.empName" label="教师名称" align="center">
			</el-table-column>
			<el-table-column prop="arrangeDate" label="授课日期" align="center">
			</el-table-column>
			<el-table-column prop="trainingPeriodVo.period" label="授课时间" align="center">
			</el-table-column>
		</el-table>
	</div>
	<div>
		<el-dialog title="排课信息" v-model="dialogVisible" width="50%" :before-close="handleClose">
			<el-form label-width="100px" class="demo-ruleForm">
				<el-form-item label="可用教室">
					<el-checkbox-group v-model="form.classRoom">
						<el-checkbox v-for="item in classRoom" :label="item.classroomId" name="type" checked>
							{{item.classroomName}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="课表时间段">
					<el-cascader :options="thisWeek2" v-model="form.options" :props="props" collapse-tags clearable>
					</el-cascader>
				</el-form-item>
				<el-form-item label="排课班级">
					<el-checkbox-group v-model="form.classes">
						<el-checkbox v-for="item in classes" :label="item.classesId" name="type" checked>
							{{item.classesName}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">立即创建</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import {
		ElMessage
	} from 'element-plus'

	import qs from 'qs'

	export default {
		data() {
			return {
				props: {
					multiple: true
				},
				classRoom: [],
				tableData: [],
				classes: [],
				dialogVisible: false,
				thisWeek: [],
				thisWeek2: [],
				thisTime: [],
				form: {
					classRoom: [],
					options: [],
					classes: []
				}
			}
		},
		methods: {
			addClick() {
				this.dialogVisible = true;
				this.selectAllTrainingPeriodList();
				this.selectAllClassRoomsByState();
				this.getTime(7);
				this.selectAllClassesByState();
			},
			appClick() {
				if (this.tableData.length == 0) {
					ElMessage.warning({
						message: '无审核数据',
						type: 'warning'
					});
					return false;
				} else {
					this.$confirm('此操作将审核排课信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						const _this = this
						var arrange = [];
						for (var i = 0; i < this.tableData.length; i++) {
							var select = {
								classroomId: "",
								classesId: [],
								arrangeDate: "",
								periodId: "",
								addname: "",
								empId: ""
							};
							select.classroomId = this.tableData[i].classroomId;
							select.classesId = this.tableData[i].classesId;
							select.arrangeDate = this.tableData[i].arrangeDate;
							select.periodId = this.tableData[i].periodId;
							select.addname = this.tableData[i].addname;
							select.empId = this.tableData[i].empId;
							arrange.push(select)
						}
						this.axios.put("http://localhost:8089/tsm/appArrange", arrange, {
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.selectAllAdvancearrange();
								_this.$message({
									type: 'success',
									message: '审核成功!'
								});
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消审核'
						});
					});
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			indexMethod(index) {
				return index + 1;
			},
			selectAllAdvancearrange() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllAdvancearrange", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			onSubmit() {
				console.log(this.form);
				var arrange = [];

				for (var i = 0; i < this.form.classRoom.length; i++) {
					for (var h = 0; h < this.form.options.length; h++) {
						var select = {
							classRoomId: "",
							classesId: [],
							date: "",
							periodId: "",
							addname: ""
						};
						select.classRoomId = this.form.classRoom[i];
						select.date = this.form.options[h][0];
						select.classesId = this.form.classes;
						select.periodId = this.form.options[h][1];
						select.addname = this.$store.state.userInfo.userName;
						arrange.push(select)
					}
				}
				const _this = this
				console.log("---------------------------------------------")
				this.axios.post("http://localhost:8089/tsm/checkedArrange", arrange, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.selectAllAdvancearrange();
						_this.$message({
							type: 'success',
							message: '设置成功!'
						});
						_this.dialogVisible = false;
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectAllTrainingPeriodList() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllTrainingPeriodList", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.thisTime = response.data
						var arr = [];
						for (var i = 0; i < _this.thisWeek.length; i++) {
							var obj = {
								value: _this.thisWeek[i],
								label: _this.thisWeek[i],
								children: []
							};
							for (var j = 0; j < _this.thisTime.length; j++) {
								var arr2 = {
									value: "",
									label: ""
								};
								arr2.value = _this.thisTime[j].periodId,
									arr2.label = _this.thisTime[j].period,
									obj.children.push(arr2)
							}
							arr.push(obj);
						}
						_this.thisWeek2 = arr;
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectAllClassRoomsByState() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectAllClassRoomsByState", {
						params: {
							"state": 0
						},
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.classRoom = response.data.data
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectAllClassesByState() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.classes = response.data
					}).catch(function(error) {
						console.log(error)
					})
			},
			getTime(time) {
				//time = 7下周  -7上周   0本周
				let date = new Date(); //this.chaoZuoTime
				let currentFirstDate = new Date(date);

				let formatDate = function(date) {
					// console.log(date);
					let year = date.getFullYear(); //年
					let month = date.getMonth() + 1; //月
					if (month <= 9) {
						month = "0" + month;
					}
					let day = date.getDate(); //日;
					if (day <= 9) {
						day = "0" + day;
					}
					// let arr = ["日", "一", "二", "三", "四", "五", "六"];
					let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][
						date.getDay()
					];
					//我需要的格式是  （周几 月.日） 这里看你们的需求
					return year + "-" + month + "-" + day + " (" + week + ")";
				};

				let addDate = function(date, n) {
					// console.log(date.getDate() + n);
					date.setDate(date.getDate() + n);
					return date;
				};

				let setDate = function(date) {
					let week = date.getDay() - 1;
					date = addDate(date, week * -1);
					currentFirstDate = new Date(date);
					let weekList = [];
					for (let i = 0; i < 7; i++) {
						weekList[i] = formatDate(i == 0 ? date : addDate(date, 1));
					}
					return weekList;
				};
				this.thisWeek = setDate(addDate(currentFirstDate, time));

			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllAdvancearrange", {
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
		}
	}
</script>

<style>
	.ivu-divider {
		margin: 0 8px;
		display: inline-block;
		height: .9em;
		width: 1px;
		vertical-align: middle;
		position: relative;
		top: -.06em;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		color: #515a6e;
		box-sizing: border-box;
		list-style: none;
		background: #e8eaec;
	}

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

	.grid-content {
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

	.el-button {
		width: min-content;
	}
</style>
