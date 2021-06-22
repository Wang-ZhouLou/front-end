<template>
	<div>
		<div>
			<font class="ksjs1" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<el-input v-model="input" style="width: 140px;" size="mini"></el-input>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
		</div>&nbsp;

		<el-dialog title="学费补缴" v-model="dialogFormVisible">
			<el-form :model="form" size=mini>
				<el-form-item>
					<div style="margin: -20px 0 0 50px;">
						编号: <el-input v-model="form.feesId" disabled style="width: 160px;">
						</el-input>
						单号: <el-input v-model="form.feesName" disabled style="width: 160px;"></el-input>
						姓名: <el-input v-model="form.register.consultant" disabled style="width: 160px;"></el-input>
					</div>
					<div>
						<p>班级报读记录</p>
						<el-table :data="courseData" border style="width: 100%" size=mini>
							<el-table-column type="selection" width="55" align="center">
							</el-table-column>
							<el-table-column fixed prop="courseId" label="编号" width="50" align="center">
							</el-table-column>
							<el-table-column prop="addtime" label="报读日期" width="150" align="center">
							</el-table-column>
							<el-table-column prop="courseName" label="报读课程" width="150" align="center">
							</el-table-column>
							<el-table-column prop="courseMoney" label="实际学费" width="150" align="center">
							</el-table-column>
							<el-table-column prop="classhours" label="课时量" align="center">
							</el-table-column>
						</el-table>
					</div>&nbsp;
					<p>费用信息统计</p>
					<div style="margin-left: 20px;">
						应收总额: <el-input v-model="form.course.courseMoney" disabled
							style="width: 180px;margin: 10px 160px 0 0;">
						</el-input>
						实收金额: <el-input v-model="form.receipts" disabled style="width: 180px;"></el-input>
					</div>
					<div style="margin-left: 20px;">
						剩余待缴: <el-input v-model="form.accumulated" disabled
							style="width: 180px;margin: 10px 160px 0 0;">
						</el-input>
						补缴金额: <el-input v-model="form.alongmoney" style="width: 180px;"></el-input>元
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="close()">关闭</el-button>
					<el-button type="primary" @click="addStudentoutstanding()">保 存</el-button>
				</span>
			</template>
		</el-dialog>


		<div class="zxdj">
			<el-table :data="studentoutData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column fixed prop="feesId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="name" label="学号" width="90" align="center">
				</el-table-column>
				<el-table-column prop="register.consultant" label="缴费学员" width="140" align="center">
				</el-table-column>
				<el-table-column prop="accumulated" label="剩余待缴" width="220" align="center">
				</el-table-column>
				<el-table-column prop="course.courseMoney" label="应收金额" width="120" align="center">
				</el-table-column>
				<el-table-column prop="receipts" label="实收金额" width="110" align="center">
				</el-table-column>
				<el-table-column prop="register.phone" label="联系电话" width="200" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="xfbjxs(scope.row)" type="text" size="small">学费补缴</el-button>
					</template>
				</el-table-column>
			</el-table>&nbsp;
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
	export default {
		methods: {
			//新增学费补缴表信息
			addStudentoutstanding() {
				const _this = this
				this.form.accumulateds = this.form.accumulated - this.form.alongmoney //累计欠费=剩余待缴金额-补缴金额
				this.axios.post("http://localhost:8089/tsm/addStudentoutstanding", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						console.log(response)
						_this.dialogFormVisible = false
						for (var key in _this.form) {
							delete _this.form[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
				//修改剩余金额alongmoney
				this.form.accumulated = this.form.accumulated - this.form.alongmoney
				console.log(this.form.accumulated)
				this.axios.put("http://localhost:8089/tsm/upaccumulated", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selefeesType", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.studentoutData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					})
			},
			xfbjxs(row) {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/WjfeeesId?feesId=" + row.feesIdK)
					.then(function(response) {
						_this.courseData = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.form.feesId = row.feesId
				this.form.register = row.register //缴费学员
				this.form.course = row.course //应收金额
				this.form.receipts = row.receipts //实收金额
				this.form.accumulated = row.accumulated //剩余学费
				this.form.feesName = row.feesName
				this.dialogFormVisible = true
			},
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selefeesType", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.studentoutData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selefeesType", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.studentoutData = response.data.list
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
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				form: {
					feesId: '',
					accumulateds: '',
					accumulated: ''
				},
				dialogFormVisible: false,
				options: [],
				input: ref(''),
				value: '',
				studentoutData: [],
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
			this.axios.get("http://localhost:8089/tsm/selefeesType", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.studentoutData = response.data.list
					_this.pageInfo.total = response.data.total
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
