<template>
	<div>
		<div>
			<font class="ksjs1" style="font-size: 13px;">选择校区:</font>&nbsp;
			<el-select v-model="value" placeholder="请选择" style="width: 140px;" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<font class="ksjs1" style="font-size: 13px;">审核:</font>&nbsp;
			<el-select v-model="value" style="width: 140px;" size="mini">
				<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>&nbsp;
			<font class="ksjs1" style="font-size: 13px;">退费日期:</font>&nbsp;
			<el-date-picker v-model="value1" type="daterange" size="mini" style="width: 200px;" range-separator="至"
				start-placeholder="开始日期" end-placeholder="结束日期">
			</el-date-picker>&nbsp;
			<el-button style="background-color: #009688;color: white;" size="mini">查询</el-button>
			<el-button style="background-color: #5FB878;color: white;" size="mini">审核通过</el-button>
			<el-button style="background-color:  #FF5722;color: white;width: 50px;" type="text" @click="open"
				size="mini">删除</el-button>
			<el-button style="background-color: #009688;color: white;" size="mini">导出</el-button>
		</div>&nbsp;
		<div class="zxdj">
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column fixed prop="date" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="name" label="退费日期" width="100" align="center">
				</el-table-column>
				<el-table-column prop="province" label="缴费学员" width="100" align="center">
				</el-table-column>
				<el-table-column prop="city" label="退费明细" width="400" align="center">
				</el-table-column>
				<el-table-column prop="address" label="退还金额" width="110" align="center">
				</el-table-column>
				<el-table-column prop="zip" label="经办人" width="100" align="center">
				</el-table-column>
				<el-table-column prop="lxdh" label="校区" width="100" align="center">
				</el-table-column>
				<el-table-column prop="zt" label="状态" width="100" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
						<el-button type="text" size="small">回访</el-button>
					</template>
				</el-table-column>
			</el-table>&nbsp;
		</div>

	</div>

</template>

<script>
	import {
		ref
	} from 'vue'
	export default {
		methods: {
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
				options: [{
						value: '选项1',
						label: '人大分校区'
					}, {
						value: '选项2',
						label: '北大分校区'
					},
					{
						value: '选项3',
						label: '清华分校区'
					}
				],
				optionss: [{
					value: '选项1',
					label: '已审核'
				}, {
					value: '选项2',
					label: '未审核'
				}],
				input: ref(''),
				value: '',
				tableData: [{
					date: '2',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海市弄',
					zip: 200333
				}, {
					date: '04',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海1517 弄',
					zip: 200333
				}, {
					date: '2',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海519 弄',
					zip: 200333
				}, {
					date: '8',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海1516 弄',
					zip: 200333
				}],
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
		}
	}
</script>

<style>
</style>
