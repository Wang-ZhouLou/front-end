<template>
	<div>
		<div class="crumbs">
			<font class="ksjs" style="font-size: 13px;">快速检索:</font>&nbsp;
			<!-- @change=selall -->
			<el-select placeholder="请选择" size=mini v-model="select">
				<el-option label="所有" value=""></el-option>
				<el-option label="招生未审核" value="1"></el-option>
				<el-option label="招生已审核" value="2"></el-option>
				<!-- 				<el-option label="教务未审核" value="3"></el-option>
				<el-option label="教务已审核" value="4"></el-option> -->
			</el-select>
			<el-button style="background-color: #5FB878;color: white; width: 50px;" size="mini" @click="selall">查询
			</el-button>

		</div>&nbsp;
		<div class="qdwh">
			<el-table :data="memorandumentData" border style="width: 100%">
				<el-table-column prop="memorandumattachmentId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="register.consultant" label="学生姓名" width="250" align="center">
				</el-table-column>
				<el-table-column prop="register.sex" label="性别" width="250" align="center">
				</el-table-column>
				<el-table-column prop="register.phone" label="联系方式" width="250" align="center">
				</el-table-column>
				<el-table-column prop="zsisexamine" label="招生审核状态" width="250" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.zsisexamine==0">未审核</p>
						<p v-if="slot.row.zsisexamine==1">已审核</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="upzsisexamine(scope.row)" type="text" size="small">招生审核</el-button>
						<!-- 	<el-button type="text" size="small" @click="upjwisexamine(scope.row)">教务审核</el-button> -->
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
<<<<<<< Updated upstream
			//修改招生审核
=======
			upjwisexamine(row) {
				if (row.zsisexamine == 1) {
					const _this = this
					
					//修改教务
					row.jwisexamine = 1
					this.axios.put("http://localhost:8089/tsm/upjwisexamine", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) { // eslint-disable-line no-unused-vars
							_this.selall()
						})
					this.axios.post("http://localhost:8089/tsm/addstudent",form2,{
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
				} else {
					this.jwsh();
				}
			},
			//修改缴费状态
>>>>>>> Stashed changes
			upzsisexamine(row) {
				const _this = this
				row.zsisexamine = 1
				this.axios.put("http://localhost:8089/tsm/upzsisexamine", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.selall()
					})
			},
			//模糊查询
			selall() {
				if (this.select == 1) { // eslint-disable-line no-unused-vars
					const _this = this
					this.axios.get("http://localhost:8089/tsm/wshzsisexamine", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.memorandumentData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response)
						}).catch(function(error) {
							console.log(error)
						})
				} else if (this.select == 2) { // eslint-disable-line no-unused-vars
					const _this = this
					this.axios.get("http://localhost:8089/tsm/yshzsisexamine", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.memorandumentData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response)
						}).catch(function(error) {
							console.log(error)
						})
				} else { // eslint-disable-line no-unused-vars
					const _this = this
					this.axios.get("http://localhost:8089/tsm/seleAllmemorandumatt", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							_this.memorandumentData = response.data.list
							_this.pageInfo.total = response.data.total
							console.log(response)
						}).catch(function(error) {
							console.log(error)
						})
				}
			},
			handleSizeChange(pagesize) {
				//var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.selall()
			},
			handleCurrentChange(currentPage) {
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.selall()
			},
			handleClick(row) {
				console.log(row);
			}
		},
		data() {
			return {
				jwsh() {
					ElMessage({
						showClose: true,
						message: '招生人员未审核!',
						type: 'error'
					});
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
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				select: '',
				dialogFormVisible1: false,
				form: {
					sourceId: '',
					sourceName: '',
					potential: '',
					already: ''
				},
				form2:{
					consultant:"",
					sex:"",
					phone:""
					// const fo1={
						
					// }
					// fo1.consultant = this.memorandumentData.consultant
					// fo1.sex = this.memorandumentData.sex
					// fo1.phone = this.memorandumentData.phone
					// this.form2=fo1
					
					
				},
				search: ref(''),
				value: '',
				memorandumentData: [],
				returnvisitdate: [],
			}
		},
		created() {
			//主键
			const _this = this
<<<<<<< Updated upstream
=======
			/* this.axios.get("http://localhost:8089/tsm/seleAllmemorandumatt", {
					params: this.pageInfo
				})
				.then(function(response) {
					_this.memorandumentData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
					
				}).catch(function(error) {
					console.log(error)
				}), */
>>>>>>> Stashed changes
			this.selall()
			//外键
			this.axios.get("http://localhost:8089/tsm/Wjselectreturnvisit")
				.then(function(response) {
					_this.returnvisitdate = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
