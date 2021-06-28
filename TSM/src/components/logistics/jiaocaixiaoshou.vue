<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>教材销售</el-breadcrumb-item>
	</el-breadcrumb><br>
	&nbsp;<a style="font-size: 14px;">快速检索 :</a> &nbsp;
	<el-select v-model="value4" placeholder="校区" class="el2" size="mini">

		<el-option v-for="item in options1" :key="item.value4" :label="item.label" :value="item.value4">
		</el-option>
	</el-select>
	<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="input7" style="width: 150px;">
	</el-input>


	<div style="margin: -27px 0 0 400px;">
		<el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
		<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="xskd">
			销售开单</el-button>
		<el-button type="primary" size="mini" icon="el-icon-delete" @click="del()">删除</el-button>

	</div>

	<el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%" class="el3">
		<el-table-column fixed prop="bookdeliveryId" label="编号" width="50">
		</el-table-column>
		<el-table-column type="selection" width="50">
		</el-table-column>
		<el-table-column prop="bookdelivery.salenumber" label="销售编号" width="120">
		</el-table-column>
		<el-table-column prop="bookdelivery.deliverytime" label="销售日期" width="120">
		</el-table-column>
		<el-table-column prop="book.bookname" label="教材名称" width="390">
		</el-table-column>
		<el-table-column prop="deliverycount" label="数量" width="80">
		</el-table-column>
		<el-table-column prop="book.booksprice" label="售价" width="80">
		</el-table-column>
		<el-table-column prop="bookdelivery.tota" label="合计	" width="80">
		</el-table-column>
		<el-table-column prop="student.studentName" label="购买者" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="课程顾问" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="录入人" width="143">
		</el-table-column>
		<el-table-column fixed="right" label="操作" width="152">
			<template #default="scope" style="width: 100%;">
				<el-button type="text" size="medium" style="text-decoration:underline;" @click="debookdel1(scope.row)">
					删除出库</el-button>
			</template>
		</el-table-column>
	</el-table>


	<el-dialog :data="xiaosData" title="" v-model="dialogTableVisible" style="margin: -30px 0 0 0; height:100%"
		width="100%">
		<el-form :model="form">
			<el-table :data="gridData">
				<el-table-column property="form4.bookname" label="出售教材" width="650"></el-table-column>
				<el-table-column property="form4.booksprice" label="教材售价" width="190"></el-table-column>
				<el-table-column property="form4.deliverycount" label="出售数量" width="190"></el-table-column>
				<el-table-column property="form4.tota" label="应收金额" width="260"></el-table-column>
				<el-table-column property="cz" label="操作">
					<el-button type="text" size="medium" style="text-decoration:underline;" @click="deleteInfo(index)">
						删除</el-button>

				</el-table-column>
			</el-table>

			<el-button type="primary" icon="el-icon-circle-plus-outline" style="width: 110px;margin: 0px 0 0 1250px;"
				size="mini" @click="a1()">添加教材</el-button>
			<el-form v-model="form3">
				<div>
					<div style="margin: 20px 0 0 370px;">
						<a style="font-size: 16px;">单号 :</a>&nbsp;
						<el-input placeholder="请输入单号" v-model="form.salenumber" style="width: 170px;">
						</el-input>
						<a style="font-size: 16px; margin: 0 0 0 300px;">录入人 :</a>&nbsp;
						<el-input type="text" style="width: 170px;height: ;" placeholder="梁政"></el-input>
						<!-- <el-select v-model="form2.emp.empId" autocomplete="off" size="mini" style="width: 180px;" @change="as1">
						<el-option v-for="item in empdata" :label="item.empName" :key="item.empId" :value="item.empId">
						</el-option>
					</el-select> -->



					</div>

					<div style="margin: 20px 0 0 339px;">
						<a style="font-size: 16px;">支付方式 :</a>&nbsp;
						<el-select v-model="value" placeholder="现金支付" style="width: 170px;">
							<el-option v-for="item in options" :key="item.value2" :label="item.label1"
								:value="item.value2">
							</el-option>
						</el-select>
						<a style="font-size: 16px; margin: 0 0 0 300px;">购买者 :</a>&nbsp;
						<el-input type="text" style="width: 170px;" v-model="form.studentName"></el-input>


					</div>





				</div>
			</el-form>

			<el-button type="primary" style="margin: 20px 0 0 650px;" @click="addstu">确 定</el-button>
			<el-button @click="dialogTableVisible=false">取 消</el-button>
		</el-form>

	</el-dialog>
	<el-dialog title="" v-model="ts" style="margin: -30px 0 0 0; height:100%" width="100%">

		<el-form :model="form1">
			<div style="margin: 10px 0 0 70px;">


				<el-select v-model="form2.book.bookId" autocomplete="off" size="mini" style="width: 180px;" @change="a">
					<el-option v-for="item in bookdata" :label="item.bookname" :key="item.bookId" :value="item.bookId">
					</el-option>
				</el-select>

			</div>
			<div style="font-size: 16px; margin: -26px 0 0 620px;">
				<span>￥: </span>&nbsp;
				<el-input type="text" style="width: 60px;" size="mini" v-model="bookdata.booksprice"></el-input>
				<span>/本</span>

			</div>
			<div style="font-size: 16px; margin: -25px 0 0 816px;">
				<el-input type="text" style="width: 50px;" size="mini" v-model="form2.form4.deliverycount"></el-input> 本
			</div>
			<el-button type="primary" style="margin: 20px 0 0 650px;" @click="showEdit">确 定</el-button>
			<el-button @click="ts=false">取 消</el-button>
		</el-form>


	</el-dialog>
	<!-- <el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
		<span>确定要删除吗？</span>
		<template #footer>
			<span class="dialog-footer">

				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
			</span>
		</template>
	</el-dialog> -->



	<div class="block" style="margin:20px;display: flex;justify-content: center;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[ 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>

</template>

<script>
	import qs from "qs" // eslint-disable-line no-unused-vars

	import {
		defineComponent,
		ref
	} from 'vue'
	import {
		ElMessage
	} from 'element-plus'
	export default defineComponent({

		data() {
			return {
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
				addss() {
					ElMessage({
						showClose: true,
						message: '新增成功!',
						type: 'success'
					});
				},
				receipts: 0,
				form2: {
					emp: {},
					book: {},
					form4: {

					}
				},
				input: ref(''),
				input1: ref(''),
				input2: ref(''),
				input3: ref(''),
				input4: ref(''),
				input5: ref(''),
				input6: ref(''),
				input7: ref(''),
				input12: ref(''),
				input13: ref('1'),
				input14: ref(''),
				input15: ref(''),
				empdata: [],
				tableData: [],
				xiaosData: [],
				bookdata: [],
				inputdata: [],
				gridData: [],
				form: {
					deliveryddetailsId: '',
					bookdeliveryId: '',
					salenumber: '',
					deliverytime: '',
					bookname: '',
					deliverycount: '',
					booksprice: '',
					zk: '',
					receivablemoney: '',
					tota: '',
					studentId: '',
					studentName: '',
					empName: ''


				},
				form1: {
					bookId: '',
					bookname: '',
					booksprice: '',
					deliverycount: '',
					zk: '',
					receivablemoney: ''
				},
				form3: {
					student: {},
					salenumber: '',


					empName: ''
				},
				value: '',
				value1: '',
				options: [{
					value2: '1',
					label1: '现金支付'
				}, {
					value2: '2',
					label1: '刷卡支付'
				}, {
					value2: '3',
					label1: '现金+刷卡'
				}, ],

				value2: '',


				options1: [{
					value4: '1',
					label: '校区'
				}, {
					value4: '2',
					label: '教材名'
				}, {
					value4: '3',
					label: '课程顾问'
				}, {
					value4: '4',
					label: '购买者'
				}, ],
				value4: '',

				dialogVisible: false,

				pageInfo: {
					currentPage: 1, //标识当前页码
					pagesize: 6, //每页多少条数据
					total: 0
				},
				// gridData: [],
				dialogTableVisible: false,
				ts: false,
				option: [{
					value: '1',
					label: '95'
				}, {
					value: '2',
					label: '90'
				}, {
					value: '3',
					label: '85'
				}, {
					value: '3',
					label: '80'
				}],

			}

		},
		methods: {
			addstu() {
				const _this = this

				console.log("1111aas")
				// this.form.deliverycount=this.course.deliverycount

				this.axios.post("http://localhost:8089/tsm/insertstu", this.form)
					.then(function(response) {
						console.log(response)



						_this.addbookdel1(response.data.studentId)


						_this.dialogTableVisible = false

					}).catch(function(error) {
						console.log(error)
					})
			},
			addbookdel1(row) {
				const _this = this
				this.form.tota = this.bookdata.booksprice * this.form2.form4.deliverycount
				this.form.studentId = row
				console.log("1111aas")
				// this.form.deliverycount=this.course.deliverycount

				this.axios.post("http://localhost:8089/tsm/insertz", this.form)
					.then(function(response) {
						console.log(response)



						_this.addbookdel(response.data.bookdeliveryId)


						_this.dialogTableVisible = false

					}).catch(function(error) {
						console.log(error)
					})
			},
			addbookdel(row) {
				const _this = this
				this.form.deliverycount = this.form2.form4.deliverycount
				this.form.tota = this.bookdata.booksprice * this.form2.form4.deliverycount
				this.form.receivablemoney = this.form.tota
				this.form.bookId = this.form2.book.bookId
				this.form.bookdeliveryId = row
				console.log("1111aas")
				// this.form.deliverycount=this.course.deliverycount

				this.axios.post("http://localhost:8089/tsm/insertdel", this.form)
					.then(function(response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/findPage2", {
								params: _this.pageInfo
							})
							.then(function(response) {
								_this.pageInfo.total = response.data.total
								_this.tableData = response.data.list

							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogTableVisible = false
						_this.addss()
						for (var key in _this.form) {
							delete _this.form[key]
						}
					}).catch(function(error) {
						console.log(error)
					})

			},
			showEdit2(row) {
				this.form.deliveryddetailsId = row.deliveryddetailsId
				this.form.tota = row.tota
				this.form.bookId = row.bookId
				this.form.bookname = row.bookname
				// this.form.storagecount = row.storagecount
				// this.form.storagetime = row.storagetime
			},
			xskd() {
				this.dialogTableVisible = true;
				this.selectemp();
			},
			debookdel(row) {
				this.showEdit2(row)
				const _this = this
				// this.dialogVisible=true


				this.axios.put("http://localhost:8089/tsm/debookdel", this.form)
				this.axios.get("http://localhost:8089/tsm/findPage2", {
						params: _this.pageInfo
					})
					.then(function(response) {
						_this.pageInfo.total = response.data.total
						_this.tableData = response.data.list
						var rows = _this.tableData
							.filter(d => d.deliveryddetailsId != row.deliveryddetailsId)
						_this.tableData = rows
						_this.pageInfo.total = _this.pageInfo.total - 1

						_this.del = false
					}).catch(function(error) {
						console.log(error)
					})


			},
			debookdel1(row) {
				this.showEdit2(row)
				const _this = this
				// this.dialogVisible=true
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.axios.put("http://localhost:8089/tsm/debookdel", this.form)

					this.axios.get("http://localhost:8089/tsm/findPage2", {
							params: _this.pageInfo
						})
						.then(function(response) {
							console.log(response)
							console.log(response.data.deliveryddetailsId)
							var rows = _this.tableData
								.filter(d => d.deliveryddetailsId != row.deliveryddetailsId)
							_this.pageInfo.total = _this.pageInfo.total - 1
							_this.tableData = rows
							_this.del = false
							_this.dels()
						}).catch(function(error) {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消删除!'
					});
				});
			},
			del() {

				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.debookdel(item)
					});
					this.dels();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			a1() {
				this.ts = true;
				this.selectBook();
			},
			showEdit() {

				var courserecorddetails = {
					form4: {
						bookname: '',
						deliverycount: '',
						booksprice: '',

						receivablemoney: '',
						tota: ''

					},
				};

				courserecorddetails.form4.bookname = this.bookdata.bookname
				courserecorddetails.form4.booksprice = this.bookdata.booksprice
				courserecorddetails.form4.deliverycount = this.form2.form4.deliverycount
				// this.form2.course.deliverycount=1
				courserecorddetails.form4.tota = this.bookdata.booksprice * this.form2.form4.deliverycount
				// this.form1.bookId=this.course.bookId
				// courserecorddetails.course.bookName=this.form1.bookName
				// courserecorddetails.course.bookjprice=this.form1.bookjprice
				// courserecorddetails.course.deliverycount=this.form1.deliverycount
				// courserecorddetails.course.receivablemoney=this.form1.receivablemoney
				this.gridData.push(courserecorddetails);
				this.ts = false

			},
			a() {
				const _this = this

				this.axios.get("http://localhost:8089/tsm/selectBybook/" + this.form2.book.bookId)
					.then(function(response) {
						console.log(response)
						_this.bookdata = response.data

					}).catch(function(error) {
						console.log(error)
					})
			},
			as1() {
				const _this = this

				this.axios.get("http://localhost:8089/tsm/selectemp/" + this.form2.emp.empId)
					.then(function(response) {
						console.log(response)
						_this.empdata = response.data

					}).catch(function(error) {
						console.log(error)
					})
			},
			show() {
				this.form.bookname = this.form1.bookname
				this.form.booksprice = this.form1.booksprice
				this.form.deliverycount = this.form1.deliverycount
				this.form.receivablemoney = this.form1.booksprice * this.form1.deliverycount
				this.show = false
			},
			selectBook() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectbook")
					.then(function(response) {
						console.log(response)
						_this.bookdata = response.data
						console.log(_this.bookdata)
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectemp() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectemp")
					.then(function(response) {
						console.log(response)
						_this.empdata = response.data
						console.log(_this.empdata)
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/findPage2", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.pageInfo.total = response.data.total
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/findPage2", {
						params: this.pageInfo
					})
					.then(function(response) {
						console.log(response.data)
						_this.pageInfo.total = response.data.total
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})

			},
			deleteInfo(index) {
				this.gridData.splice(index, 1);
			},
		},
		created() {
			const _this = this
			// this.axios.get("http://localhost:8089/tsm/selectdel")
			// 	.then(function(response) {
			// 		console.log(response)
			// 		_this.tableData = response.data
			// 	}).catch(function(error) {
			// 		console.log(error)
			// 	})
			this.axios.get("http://localhost:8089/tsm/findPage2", {
					params: this.pageInfo
				})
				.then(function(response) {
					console.log(response.data)
					_this.pageInfo.total = response.data.total
					_this.tableData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})



		},

		computed: {
			// 计算属性的 getter
			price: { // eslint-disable-line no-unused-vars
				get: function() {
					let sum = 0;
					this.gridData.forEach((item) => {
						//遍历prodAllPrice这个字段，并累加
						sum += item.course.receivablemoney;
					})
					return sum
				},
				set: function(value) {
					this.receipts = value; //最后修改了msg    
				}
			}
		},

		// created1() {
		// 	const _this = this

		// }

	})
</script>

<style>
	.el2 {
		width: 90px;
	}

	.el3 {
		margin: 20px 0 0 0;
	}
</style>
