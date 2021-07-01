<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>教材入库</el-breadcrumb-item>
	</el-breadcrumb><br>
	
			<el-tabs type="border-card">
				<el-tab-pane label="教材入库">
					&nbsp;<a style="font-size: 14px;margin:0 0 0 -600px;" >快速检索 :</a> &nbsp;
					<el-select v-model="pageInfoAll"  class="el2" size="mini" style="width:150px" placeholder="请选择查询的对象">
			
						<el-option label="教材名称" value="1">
						</el-option>
						<el-option label="出版社" value="2">
						</el-option>
					</el-select>
					<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="pageInfo.value" style="width: 150px;">
					</el-input>
			
			
					<div style="float: ; margin: -27px 0 0 350px;">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="selectAll">查询</el-button>
						<el-button type="primary" icon="el-icon-search" size="mini" @click="selectAll1">查询所有</el-button>
						<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="addbs">教材入库</el-button>
						<el-button type="primary" size="mini" icon="el-icon-delete" @click="del()">删除</el-button>
						
					</div>
			
					<el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%" class="el3">
						<el-table-column fixed prop="mbookstorageId" label="编号" width="50">
						</el-table-column>
						<el-table-column prop="sel" type="selection" width="50">
						</el-table-column>
						<el-table-column prop="book.bookname" label="教材名称" width="390">
						</el-table-column>
						<el-table-column prop="book.bookjprice" label="进价" width="80">
						</el-table-column>
						<el-table-column prop="book.booksprice" label="售价" width="80">
						</el-table-column>
						<el-table-column prop="storagecount" label="入库量" width="80">
						</el-table-column>
						<el-table-column prop="book.deliverycount" label="库存量" width="80">
						</el-table-column>
						<el-table-column prop="book.safestock" label="安全库存" width="80">
						</el-table-column>
						<el-table-column prop="book.press" label="出版社" width="120">
						</el-table-column>
						<el-table-column prop="emp.empName" label="入库员" width="100">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="252">
							<template #default="scope" style="width: 150px;">
								
								<el-button type="text" size="medium" style="text-decoration:underline;" @click="showEdit(scope.row)">修改入库</el-button>
								<el-button type="text" size="medium" style="text-decoration:underline;"  @click="deletebookstor1(scope.row)">删除入库</el-button>
							</template>
						</el-table-column>
					</el-table>
					
			
					<el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
						<span>确定要删除吗？</span>
						<template #footer>
							<span class="dialog-footer">
								<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
								<el-button @click="dialogVisible = false">取 消</el-button>
							</span>
						</template>
					</el-dialog>
			
			
			
					<el-dialog title="教材入库" v-model="dialogFormVisible" class="di1">
						<el-form :model="form">
			
							<el-form-item label="教材名称 :" :label-width="formLabelWidth" style="margin: 0px 0 0 230px;" >
								<el-select v-model="form.bookId" placeholder="请选择" autocomplete="off" style="margin:0 0 0 -180px">
									<el-option v-for="item in bookdata" :label="item.bookname" :key="item.bookId" :value="item.bookId">
									</el-option>
									</el-select>
							</el-form-item>
			
			
							<el-form-item label="入库数量 :" :label-width="formLabelWidth" style="margin: 20px 0 0 230px">
								<el-input v-model="form.storagecount" placeholder="请输入入库数量" autocomplete="off" style="width: 220px; margin:0 0 0 -165px"></el-input>
								本
							</el-form-item>
							
							
							<!-- <el-form-item label="入库时间 :" :label-width="formLabelWidth" style="margin: -100px 0 0 399px;">
								<el-date-picker type="date" placeholder="选择日期" v-model="form.storagetime" style="width: 200px;"></el-date-picker>
							</el-form-item>
							
							<el-form-item label="库存数量 :" :label-width="formLabelWidth" style="margin: -40px 0 0 399px">
								<el-input v-model="form.deliverycount" placeholder="请输入库存数量" autocomplete="off" style="width: 200px; margin:0 0 0 15px"></el-input>
								本
							</el-form-item> -->
			
			
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button type="primary" @click="addBook">保 存</el-button>
								<el-button @click="dialogFormVisible  = false">关 闭</el-button>
							</span>
						</template>
					</el-dialog>
					<div class="block" style="margin:20px;display: flex;justify-content: center;">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="pageInfo.currentPage" :page-sizes="[ 6, 8]" :page-size="pageInfo.pagesize"
							layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
						</el-pagination>
					</div>
				
			
			<el-dialog title="修改入库" width="47%" v-model="xgrk">
							<el-form :model="form" label-width="80px" size="mini">
								<el-form-item label="教材名称 :">
									<el-select v-model="form.bookId" placeholder="请选择" autocomplete="off">
										<el-option v-for="item in bookdata"  :key="item.value" :label="item.bookname" :value="item.bookId">
										</el-option>
									</el-select>
									<!-- <el-input style="width: 193px;" v-model="form.mbookstorageId" placeholder="" clearable></el-input> -->
									<b style="font-weight: 100;margin-left: 135px; margin: 0 0 0 70px;">入库数量：</b>
									<el-input style="width: 193px;" v-model="form.storagecount" placeholder="" clearable></el-input>
									<b style="font-weight: 100; ">本</b>
								</el-form-item>
								<el-form-item label="入库时间">
									<el-date-picker v-model="form.storagetime" type="date" placeholder="选择日期" style="width: 200px;">
									</el-date-picker>
								
								
								
								</el-form-item>
								<el-form-item size="large">
									<el-button style="margin-left: -100px; margin: 0 0 0 180px;" @click="updateBookstorage">更新</el-button>
									<el-button @click="xgrk=false">关闭</el-button>
								</el-form-item>
							</el-form>
						</el-dialog>
				</el-tab-pane>
				
				<el-tab-pane label="教材管理">
					<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="book= true">教材新增</el-button>
					<el-table :data="bookdata" border style="width: 100%" class="el3">
						<el-table-column fixed prop="bookId" label="编号" width="50">
						</el-table-column>
						<el-table-column prop="sel" type="selection" width="50">
						</el-table-column>
						<el-table-column prop="bookname" label="教材名称" width="390">
						</el-table-column>
						<el-table-column prop="bookjprice" label="进价" width="80">
						</el-table-column>
						<el-table-column prop="booksprice" label="售价" width="80">
						</el-table-column>
						<el-table-column prop="deliverycount" label="库存量" width="80">
						</el-table-column>
						<el-table-column prop="safestock" label="安全库存" width="80">
						</el-table-column>
						<el-table-column prop="press" label="出版社" width="120">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="252">
							<template #default="scope" style="width: 150px;">
								
								<el-button type="text" size="medium" style="text-decoration:underline;"  @click="deletebookstor1(scope.row)">删除教材</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-dialog title="教材新增" v-model="book" >
						<el-form :model="form1">
						
							<el-form-item label="教材名称 :" :label-width="formLabelWidth" style="margin: 0px 0 0 0px;">
								<el-input v-model="form1.bookname" placeholder="请输入教材名称" autocomplete="off" style="width: 220px; margin:0 0 0 -400px "></el-input>
							</el-form-item>
						
						
							<el-form-item label="教材库存 :" :label-width="formLabelWidth" style="margin: 20px 0 0 0">
								<el-input v-model="form1.deliverycount" placeholder="请输入教材库存" autocomplete="off" style="width: 220px; margin:0 0 0 -382px "></el-input>
								本
							</el-form-item>
							<el-form-item label="教材售价 :" :label-width="formLabelWidth" style="margin: 20px 0 0 0">
								<el-input v-model="form1.booksprice" placeholder="请输入教材售价" autocomplete="off" style="width: 220px; margin:0 0 0 -400px "></el-input>
								
							</el-form-item>
							<el-form-item label="教材进价 :" :label-width="formLabelWidth" style="margin: 20px 0 0 0">
								<el-input v-model="form1.bookjprice" placeholder="请输入教材进价" autocomplete="off" style="width: 220px; margin:0 0 0 -400px "></el-input>
								
							</el-form-item>
							<el-form-item label="安全库存 :" :label-width="formLabelWidth" style="margin: -220px 0 0 399px;">
								<el-input v-model="form1.safestock" placeholder="请输入安全库存" autocomplete="off" style="width: 220px; "></el-input>
							</el-form-item>
							<el-form-item label="出版社 :" :label-width="formLabelWidth" style="margin: -160px 0 0 412px">
								<el-input v-model="form1.press" placeholder="请输入出版社" autocomplete="off" style="width: 220px; "></el-input>
								
							</el-form-item>
							
							
						
						
						</el-form>
						
						<template #footer>
							<span class="dialog-footer">
								<el-button type="primary" @click="addBook1">保 存</el-button>
								<el-button @click="book  = false">关 闭</el-button>
							</span>
						</template>
						
					</el-dialog>
				</el-tab-pane>
			</el-tabs>
		
</template>

<script>
	import qs from "qs" // eslint-disable-line no-unused-var

	import {
		ElMessage
	} from 'element-plus'
	export default {
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
				upss() {
					ElMessage({
						showClose: true,
						message: '修改成功!',
						type: 'success'
					});
				},
				bookdata: [],
				form: {
					mbookstorageId: '',
					bookId: '',
					empId: '',
					bookname: '',
					safestock: '',
					bookjprice: '',
					press: '',
					storagecount: '',
					deliverycount: '',
					storagetime: '',
					booksprice: '',
					book:{}
				},
				form1: {
					bookId: '',
					bookname: '',
					deliverycount: '',
					booksprice: '',
					bookjprice: '',
					safestock: '',
					press: ''


				},
				tableData: [],
				tableData1: [],
				
				value: '',
				pageInfoAll:'',
				book: false,
				dialogVisible: false,
				dialogFormVisible: false,

				pageInfo: {
					currentPage: 1, //标识当前页码
					pagesize: 6, //每页多少条数据
					total: 0
				},

				xgrk: false,

			}

		},
		methods: {

			selectAll(){
				const _this = this
				if (this.pageInfoAll == "1") {
					this.axios.get("http://localhost:8089/tsm/selectbookname", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.value = ""
						_this.tableData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				} else if (this.pageInfoAll == "2") {
					this.axios.get("http://localhost:8089/tsm/selectpress", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						},
						params: this.pageInfo
					}).then(function(
						response) {
						console.log(response)
						_this.$message({
							type: 'success',
							message: '查询成功'
						})
						_this.pageInfo.value = ""
						_this.tableData = response.data.list
						_this.pageInfo.total = response.data.total
					}).catch(function(error) {
						console.log(error)
						_this.$message({
							type: 'info',
							message: '查询失败'
						})
					})
				}
			},
			showEdit2(row) {
				this.form.mbookstorageId = row.mbookstorageId
				this.form.bookId = row.bookId
				this.form.bookname = row.bookname
				this.form.storagecount = row.storagecount
				this.form.storagetime = row.storagetime

			},
			del() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.deletebookstor(item)
					});

				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//增加
			addbs(){
				this.dialogFormVisible=true
				this.addbsss()
					},
			addbsss(){
			const _this = this
				this.axios.get("http://localhost:8089/tsm/selectbook" ,{
					headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
				})
					.then(function(response) {
						console.log(response)
						_this.bookdata = response.data
					
					}).catch(function(error) {
						console.log(error)
					})
			},
			
			addBook() {
				const _this = this
				
				this.axios.post("http://localhost:8089/tsm/addBookstorage", this.form, {
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						
					})
					.then(function(response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/findPage1", {
								
								params: _this.pageInfo,
								headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									}
							})
							.then(function(response) {
								_this.tableData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogFormVisible = false
						_this.addss()
						for (var key in _this.form) {
							delete _this.form[key]
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			addBook1() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/insertbook", this.form1, {
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						
					})
					.then(function(response) {
						console.log("111")
						console.log(response)
						var book = response.data
						_this.bookdata.push(book)

						_this.book = false
						_this.addss()
					}).catch(function(error) {
						console.log(error)
					})
			},
			selectAll1(){
				const _this=this
				this.axios.get("http://localhost:8089/tsm/findPage1", {
						
						params: this.pageInfo,
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					.then(function(response) {
						_this.pageInfo.value = ''
						_this.pageInfo.total = response.data.total
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//修改
			showEdit(row) {
				this.form.mbookstorageId = row.mbookstorageId
				this.form.bookId = row.bookId
				this.form.storagecount = row.storagecount
				this.form.storagetime = row.storagetime
				this.form.deliverycount = row.deliverycount
				this.xgrk = true

			},
			updateBookstorage() {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/updateBookstorage", this.form, {
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						
					})
					.then(function(response) {
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/findPage1", {
								
								params: _this.pageInfo,
								headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									}
							})
							.then(function(response) {
								_this.pageInfo.total = response.data.total
								_this.tableData = response.data.list
								var bookstorage = response.data
								var book = response.data
								var row = _this.tableData.filter(t => t.mbookstorageId == bookstorage.mbookstorageId)[0]
								row.bookId = book.bookId
								row.storagecount = bookstorage.storagecount
								row.storagetime = bookstorage.storagetime
								row.deliverycount = bookstorage.deliverycount
							}).catch(function(error) {
								console.log(error)
							})
						_this.xgrk = false
						_this.upss()
						for (var key in _this.form) {
							delete _this.form[key]
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			
				
		
			deletebookstor(row) {
				this.showEdit2(row)
				const _this = this
				// this.dialogVisible=true

				
				this.axios.put("http://localhost:8089/tsm/delectbookstor", this.form, {
					headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					
				})

				this.axios.get("http://localhost:8089/tsm/findPage1", {
						
						params: this.pageInfo,
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					.then(function(response) {
						console.log(response)
						console.log(response.data.mbookstorageId)
						var rows = _this.tableData
							.filter(d => d.mbookstorageId != row.mbookstorageId)
						_this.tableData = rows
						_this.pageInfo.total = _this.pageInfo.total - 1

						_this.dialogFormVisible2 = false
						_this.dels()
					}).catch(function(error) {
						console.log(error)
					})

			},
			
			deletebookstor1(row) {
				this.showEdit2(row)
				const _this = this
				// this.dialogVisible=true

				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.put("http://localhost:8089/tsm/delectbookstor", this.form, {
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						
					})
					this.axios.get("http://localhost:8089/tsm/findPage1", {
							
							params: this.pageInfo,
							headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
						})
						.then(function(response) {
							console.log(response)
							console.log(response.data.mbookstorageId)
							var rows = _this.tableData
								.filter(d => d.mbookstorageId != row.mbookstorageId)
							_this.tableData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
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
			
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo)
				console.log(ps)
				this.axios.get("http://localhost:8089/tsm/findPage1", {
						
						params: this.pageInfo,
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					.then(function(response) {
						console.log(response.data)
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/findPage1", {
						
						params: this.pageInfo,
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					.then(function(response) {
						console.log(response.data)
						_this.tableData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectbook" ,{
				headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
			})
				.then(function(response) {
					console.log(response)
					_this.bookdata = response.data
				
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/findPage1", {
					
					params: this.pageInfo,
					headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
				})
				.then(function(response) {
			
					_this.pageInfo.total = response.data.total
					_this.tableData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})
				

		}


	}
</script>

<style>
	.el2 {
		width: 90px;
	}

	.el3 {
		margin: 20px 0 0 0;
	}
</style>
