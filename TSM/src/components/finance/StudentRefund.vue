<template>
	<div>
		<div>
			<font class="ksjs1" style="font-size: 13px;">审核:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<font class="ksjs1" style="font-size: 13px;">补缴日期:</font>&nbsp;
			<el-date-picker v-model="value1" type="daterange" size="mini" style="width: 200px;" range-separator="至"
				start-placeholder="开始日期" end-placeholder="结束日期">
			</el-date-picker>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
			<el-button style="background-color: #5FB878;color: white;" size="mini">审核通过</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" size="mini" type="text"
				@click="open">删除</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;

		<div class="zxdj">
			<el-table :data="StuentrefunData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column fixed prop="date" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="name" label="单据号" width="90" align="center">
				</el-table-column>
				<el-table-column prop="province" label="收支日期" width="130" align="center">
				</el-table-column>
				<el-table-column prop="city" label="收支明细" width="130" align="center">
				</el-table-column>
				<el-table-column prop="address" label="售/退数量" width="130" align="center">
				</el-table-column>
				<el-table-column prop="zip" label="收支总额" width="130" align="center">
				</el-table-column>
				<el-table-column prop="lxdh" label="现金金额" width="130" align="center">
				</el-table-column>
				<el-table-column prop="zxkc" label="经办人" width="130" align="center">
				</el-table-column>
				<el-table-column prop="syqd" label="状态" width="90" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="打印" align="center">
					<template #default="scope">
						<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
						<el-button type="text" size="small">回访</el-button>
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
	export default {
		methods: {
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectALLstorageex", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.StuentrefunData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectALLstorageex", {
						params: this.pageInfo
					})
					.then(function(response) {
						_this.StuentrefunData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleClick(row) {
				console.log(row);
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
				options: [],
				optionss: [],
				input: ref(''),
				value: '',
				StuentrefunData: [],
				bookstorageData: [],
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
			this.axios.get("http://localhost:8089/tsm/selectALLstorageex", {
					params: this.pageInfo
				})
				.then(function(response) {
					_this.StuentrefunData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/selectBookstor")
				.then(function(response) {
					_this.bookstorageData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
