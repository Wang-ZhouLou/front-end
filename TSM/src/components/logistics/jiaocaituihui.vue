<template>
	&nbsp;<a style="font-size: 14px;margin:0 0 0 -500px;">快速检索 :</a> &nbsp;
	
	<el-input placeholder="请输入教材名称" size="mini" prefix-icon="el-icon-search" v-model="pageInfo.value" style="width: 150px;">
	</el-input>


	<div style="margin: -27px 0 0 400px;">
		<el-button type="primary" size="mini" icon="el-icon-search" @click="selectAll">查询</el-button>
		<el-button type="primary" size="mini" icon="el-icon-search" @click="selectAll1">查询所有</el-button>
		<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="selectstudent">退回开单</el-button>
		<el-button type="primary" size="mini" icon="el-icon-delete" @click="del()">删除</el-button>

	</div>

	<el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%" class="el3">
		<el-table-column fixed prop="bookbackId" label="编号" width="50">
		</el-table-column>
		<el-table-column type="selection" width="50">
		</el-table-column>
		
		<el-table-column prop="storagetime" label="退回日期" width="120">
		</el-table-column>
		<el-table-column prop="book.bookname" label="教材名称" width="390">
		</el-table-column>
		<el-table-column prop="backSl" label="数量" width="80"> 
		</el-table-column>
		<el-table-column prop="book.booksprice" label="售价" width="80">
		</el-table-column>
		<el-table-column prop="backSprice" label="退回金额	" width="80">
		</el-table-column>
		<el-table-column prop="student.studentName" label="购买者" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="课程顾问" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="录入人" width="100">
		</el-table-column>
		<el-table-column fixed="right" label="操作" width="152">
			<template #default="scope" style="width: 100%;">
				<el-button type="text" size="medium" style="text-decoration:underline;"  @click="deleteback1(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	

	<el-dialog title="" v-model="dialogTableVisible" style="margin: -30px 0 0 0; height:100%" width="100%">
		<el-form :model="form">
		<el-table :data="gridData">
			<el-table-column property="form4.bookname" label="退回教材" width="650"></el-table-column>
			<el-table-column property="form4.booksprice" label="教材售价" width="160"></el-table-column>
			<el-table-column property="form4.backSl" label="出售数量" width="160"></el-table-column>
			<el-table-column property="form4.backSprice" label="应收金额" width="260"></el-table-column>
			<el-table-column property="cz" label="操作">
				<template #default="" style="width: 100%;">
					<el-button type="text" size="medium" style="text-decoration:underline;"  @click="delform2(index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<div style="margin: 3px 0 0 1260px;">
			<el-button type="primary" icon="el-icon-circle-plus-outline" style="width: 110px;" size="mini" @click="a1()">添加教材</el-button>
		</div>

		<div>
			<div style="margin: 20px 0 0 80px;">
				<a style="font-size: 16px; margin: 0 0 0 -400px;">购买者 :</a>&nbsp;
				<el-select v-model="form2.student.studentId" autocomplete="off"  style="width: 170px;" @change="aa1" placeholder="请选择退回人">
					<el-option v-for="item in studentdata" :label="item.studentName" :key="item.studentId" :value="item.studentId">
					</el-option>
				</el-select>
				<!-- <a style="font-size: 16px; margin: 0 0 0 -390px;">退回总额 :</a> <el-input v-model="form4.backSprice" placeholder="0.00" style="width: 170px;"></el-input> -->
				<!-- <a style="margin: 0 0 0 200px;">退回日期 :</a> <el-date-picker v-model="form.storagetime" type="date" placeholder="选择日期">
				</el-date-picker> -->
				
			</div>
			
			<div style="margin: -38px 0 0 -251px;">
				
				<a style="font-size: 16px; margin: 0 0 0 1215px;">录入人 :</a> <el-input placeholder="谭静"  v-model="form.empName" :disabled="true" style="width: 170px;">
				</el-input>
				
				
			</div>

		</div>
		<el-button type="primary" style="margin: 20px 0 0 650px;" @click="addback()">确 定</el-button>
		<el-button @click="dialogTableVisible=false">取 消</el-button>
		</el-form>
	</el-dialog>
	<el-dialog title="" v-model="tss" style="margin: -30px 0 0 0; height:100%" width="100%">
				<div style="margin: 10px 0 0 70px;">
			
			
				<el-select v-model="form2.book.bookId" autocomplete="off" size="mini" style="width: 180px;" @change="a">
					<el-option v-for="item in bookdata" :label="item.bookname" :key="item.bookId" :value="item.bookId">
					</el-option>
				</el-select>
			
			</div>
			<div style="font-size: 16px; margin: -26px 0 0 620px;">
				<span>￥: </span>&nbsp;
				<el-input type="text" style="width: 60px;" size="mini" v-model="bookdata.booksprice"></el-input> <span>/本</span>
			
			</div>
			<div style="font-size: 16px; margin: -25px 0 0 816px;">
				<el-input type="text" style="width: 50px;" size="mini" v-model="form2.form4.backSl"></el-input> 本
			</div>
			<el-button type="primary" style="margin: 20px 0 0 650px;" @click="showEdit">确 定</el-button>
			<el-button @click="tss=false">取 消</el-button>
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
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.currentPage"
		:page-sizes="[ 6, 8]" :page-size="pageInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
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
				addss(){
					ElMessage({
						showClose: true,
						message: '新增成功!',
						type: 'success'
					});
				},
				input1: ref(''),
				input: ref(''),
				input2: ref(''),
				input3: ref(''),
				tableData: [],
				studentdata:[],
				bookdata:[],
				options: [{
					value: '1',
					label: '校区'
				}, {
					value: '2',
					label: '教材名'
				}, {
					value: '3',
					label: '课程顾问'
				}, {
					value: '3',
					label: '购买者'
				}],
				value: '',

				dialogVisible: false,
				tss: false,
				form:{
					bookId:'',
					bookbackId:'',
					storagetime:'',
					bookname:'',
					booksprice:'',
					backSl:'',
					backSprice:'',
					studentName:'',
					studentId:'',
					empName:''
					
				},
				form2:{
					book:{},
					form4:{},
					student:{}
				},
				gridData: [],
				dialogTableVisible: false,

				pageInfo: {
					currentPage: 1, //标识当前页码
					pagesize: 6, //每页多少条数据
					total: 0,
					value:""
				},
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
			methods:{
				selectAll() {
					const _this = this
					console.log("----------------")
					this.axios.get("http://localhost:8089/tsm/selectbackfy", {
							params: this.pageInfo,
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							
							_this.tableData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
				},
				selectAll1(){
					const _this=this
					this.axios.get("http://localhost:8089/tsm/findPage3", {
							params: this.pageInfo,
							headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
						})
						.then(function(response) {
							console.log(response.data)
							_this.pageInfo.total = response.data.total
							_this.tableData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})				
				},
				selectstudent() {
					const _this = this
					this.dialogTableVisible=true
					this.axios.get("http://localhost:8089/tsm/selectstudent",{
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
						.then(function(response) {
							console.log(response)
							_this.studentdata = response.data
							console.log(_this.studentdata)
						}).catch(function(error) {
							console.log(error)
						})
				},
				aa1() {
					const _this = this
				
					this.axios.get("http://localhost:8089/tsm/selectBystudent?studentId=" + this.form2.student.studentId,{
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
						.then(function(response) {
							console.log(response)
							_this.studendata = response.data
				
						}).catch(function(error) {
							console.log(error)
						})
				},
				addback() {
					const _this = this
					
					this.form.backSl=this.form2.form4.backSl
					this.form.backSprice=this.bookdata.booksprice * this.form2.form4.backSl
					this.form.bookId=this.form2.book.bookId
					this.form.studentId=this.form2.student.studentId
					this.axios.post("http://localhost:8089/tsm/insertback", this.form,{
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					.then(function(response) {
						

						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/findPage3", {
								params: _this.pageInfo,
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
										_this.dialogTableVisible = false
										_this.addss()
						for (var key in _this.form) {
								delete _this.form[key]
							}
						}).catch(function(error) {
							console.log(error)
						})
						
				},
				del() {
					console.log(this.multipleSelection.length)
					if (this.multipleSelection.length === 0) {
						this.deld();
					} else {
						this.multipleSelection.forEach(item => {
							this.deleteback1(item)
						});
						
					}
				},
				handleSelectionChange(val) {
					this.multipleSelection = val;
				},
				showEdit2(row) {
					this.form.bookbackId = row.bookbackId
					this.form.bookId = row.bookId
					this.form.bookname = row.bookname
					this.form.backSl = row.backSl 
					this.form.storagetime = row.storagetime
				},
				
				deleteback1(row) {
					this.showEdit2(row)
					const _this = this
					this.dialogVisible=true
					
					this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
					this.axios.put("http://localhost:8089/tsm/delectback", this.form,{
						headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
					})
					this.axios.get("http://localhost:8089/tsm/findPage3", {
							params: this.pageInfo,
							headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
						})
						.then(function(response) {
							console.log(response)
							console.log(response.data.bookbackId)
							var rows = _this.tableData
								.filter(d => d.bookbackId != row.bookbackId)
							_this.tableData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
				
							_this.dialogFormVisible2 = false
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
				a() {
					const _this = this
				
					this.axios.get("http://localhost:8089/tsm/selectBybook?bookId=" + this.form2.book.bookId,{
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
				showEdit() {
					
					var courserecorddetails = {
						form4: {
							bookName:'',
							backSl:'',
							backSprice: '',
							booksprice: '',
							studentName:''
							
							
						},
					};
					
					courserecorddetails.form4.bookname = this.bookdata.bookname
					courserecorddetails.form4.studentName = this.studentdata.studentName
					courserecorddetails.form4.booksprice = this.bookdata.booksprice
					courserecorddetails.form4.backSl = this.form2.form4.backSl
					// this.form2.course.deliverycount=1
					courserecorddetails.form4.backSprice = this.bookdata.booksprice * this.form2.form4.backSl
					// this.form1.bookId=this.course.bookId
					// courserecorddetails.course.bookName=this.form1.bookName
					// courserecorddetails.course.bookjprice=this.form1.bookjprice
					// courserecorddetails.course.deliverycount=this.form1.deliverycount
					// courserecorddetails.course.receivablemoney=this.form1.receivablemoney
					this.gridData.push(courserecorddetails);
					this.tss = false 
					
				},
				delform2(index){
					this.gridData.splice(index, 1);
				},
				a1() {
					this.tss = true;
					this.selectBook();
				},
				handleCurrentChange(currentPage) {
					var _this = this
					this.pageInfo.currentPage = currentPage
					var ps = qs.stringify(this.pageInfo)
					console.log(ps)
					this.axios.get("http://localhost:8089/tsm/findPage3", {
							params: this.pageInfo,
							headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
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
					var ps = qs.stringify(this.pageInfo)// eslint-disable-line no-unused-vars
					this.axios.get("http://localhost:8089/tsm/findPage3", {
							params: this.pageInfo,
								headers: {
										'content-type': 'application/json',
										'jwtAuth': _this.$store.getters.token
									}
							
						})
						.then(function(response) {
							console.log(response.data)
							_this.pageInfo.total = response.data.total
							_this.tableData = response.data.list
						}).catch(function(error) {
							console.log(error)
						})
				
				},
			},
			
			

		
		created(){
			const _this = this
			
			
			this.axios.get("http://localhost:8089/tsm/findPage3", {
					params: this.pageInfo,
					headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
				})
				.then(function(response) {
					console.log(response.data)
					_this.pageInfo.total = response.data.total
					_this.tableData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})
				
				
		
		
		
		},

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
