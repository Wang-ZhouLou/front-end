<template>
	<div>
		<div style="margin-left: -750px;">
			<font class="ksjs1" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-select placeholder="请选择" size=mini v-model="select">
				<el-option label="所有" value=""></el-option>
				<el-option label="未审核" value="1"></el-option>
				<el-option label="已审核" value="2"></el-option>
			</el-select>&nbsp;
			<el-input v-model="input" style="width: 140px;" size="mini"></el-input>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini" @click="selall">查询</el-button>
		</div>&nbsp;

		<div class="zxdj">
			<el-table :data="studentoutsData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column fixed prop="outstandingId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="outstandingName" label="单据号" width="90" align="center">
				</el-table-column>
				<el-table-column prop="outstandingDate" label="补缴日期" width="200" align="center">
				</el-table-column>
				<el-table-column prop="entryfees.register.consultant" label="缴费学员" width="140" align="center">
				</el-table-column>
				<el-table-column prop="accumulateds" label="累计欠费" width="140" align="center">
				</el-table-column>
				<el-table-column prop="alongmoney" label="补缴金额" width="220" align="center">
				</el-table-column>
				<el-table-column prop="approvalType" label="状态" width="200" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.approvalType==0"><i class="el-icon-warning"></i>
						</p>
						<p v-if="slot.row.approvalType==1"><i class="el-icon-check"></i></p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="upapprovaltype(scope.row)" type="text" size="small">审核</el-button>
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
			//修改审核状态
			upapprovaltype(row) {
				const _this = this
				row.approvalType = 1
				this.axios.put("http://localhost:8089/tsm/upapprovaltype", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/seleAllstudentout", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.studentoutsData = response.data.list
								_this.pageInfo.total = response.data.total
								console.log(response.data.list)
							}).catch(function(error) {
								console.log(error)
							})
					})
			},
			//模糊查询
			selall() {
				if (this.select == 1) {
					const _this = this
					this.axios.get("http://localhost:8089/tsm/seleWapprovaltype", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.studentoutsData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response.data.list)
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.select == 2) {
					const _this = this
					this.axios.get("http://localhost:8089/tsm/seleYapprovaltype", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.studentoutsData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response.data.list)
						}).catch(function(error) {
							console.log(error)
						})
				} else {
					const _this = this
					this.axios.get("http://localhost:8089/tsm/seleAllstudentout", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.studentoutsData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response.data.list)
						}).catch(function(error) {
							console.log(error)
						})
				}
			},
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.selall()
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.selall()
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
				select: '',
				dialogFormVisible: false,
				form: {},
				options: [],
				input: ref(''),
				value: '',
				studentoutsData: [],
				entryfeesData: [],
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
			this.selall()
			this.axios.get("http://localhost:8089/tsm/WjselectAllentryfees", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log(response.data)
					_this.entryfeesData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
