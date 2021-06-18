<template>
	&nbsp;<a style="font-size: 14px;">快速检索 :</a> &nbsp;
	<el-select v-model="value" placeholder="校区" class="el2" size="mini">

		<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
		</el-option>
	</el-select>
	<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="input2" style="width: 150px;">
	</el-input>


	<div style="margin: -27px 0 0 400px;">
		<el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
		<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="dialogTableVisible  = true">销售开单</el-button>
		<el-button type="primary" size="mini" icon="el-icon-delete" @click="dialogVisible = true">删除</el-button>

	</div>

	<el-table :data="tableData" border style="width: 100%" class="el3">
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
		<el-table-column prop="zk" label="折扣" width="80">
		</el-table-column>
		<el-table-column prop="bookdelivery.tota" label="合计	" width="80">
		</el-table-column>
		<el-table-column prop="student.studentName" label="购买者" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="课程顾问" width="100">
		</el-table-column>
		<el-table-column prop="emp.empName" label="录入人" width="143">
		</el-table-column>
	</el-table>
	<el-pagination style="text-align: center; margin: 20px 0 0 0;" background :page-size="5" layout="prev, pager, next"
	:total="50">
		<!-- 总条数 -->
	</el-pagination>

	<el-dialog title="" v-model="dialogTableVisible" style="margin: -30px 0 0 0; height:100%" width="100%">
		
		<el-table :data="gridData">
			<el-table-column property="bookName" label="出售教材" width="650"></el-table-column>
			<el-table-column property="book.booksprice" label="教材售价" width="160"></el-table-column>
			<el-table-column property="deliverycount" label="出售数量" width="160"></el-table-column>
			<el-table-column property="zk" label="折扣数" width="160"></el-table-column>
			<el-table-column property="bookdelivery.tota" label="应收金额" width="160"></el-table-column>
			<el-table-column property="cz" label="操作">
				<el-button type="text" size="medium" style="text-decoration:underline;" >删除</el-button>
			</el-table-column>
		</el-table>
		<el-form :model="form" >
		<el-form :model="form1" >
		<div style="margin: 10px 0 0 70px;">
			<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="input2" style="width: 120px; ">
			</el-input>&nbsp;
			<el-button type="primary" size="mini" icon="el-icon-search" style="width: 60px; text-align: center;"></el-button>&nbsp;
		
			<el-select v-model="form1.bookId"  autocomplete="off" size="mini" style="width: 180px;">
				<el-option v-for="item in bookdata" :label="item.bookname" :key="item.bookId" :value="item.bookId">
				</el-option>
				</el-select>

		</div>
		<div style="font-size: 16px; margin: -26px 0 0 620px;">
			<span>￥: </span>&nbsp;
			<el-input type="text" style="width: 60px;" size="mini" v-model="input12" ></el-input> <span>/本</span>
			
		</div>
		<div style="font-size: 16px; margin: -25px 0 0 816px;">
			<el-input type="text"  style="width: 50px;" size="mini" v-model="input13" ></el-input> 本
		</div>
		<div style="margin: -28px 0 0 960px;">
			<el-select v-model="value" size="mini" placeholder="无折扣" style="width: 90px; ">
				<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div style="margin: -26px 0 0 1145px;">
			<el-input type="text" style="width: 60px;" size="mini" v-model="input14" ></el-input>
		</div>
		<div style="margin: -30px 0 0 1260px;">
			<el-button type="primary" icon="el-icon-circle-plus-outline" style="width: 110px;" size="mini">添加教材</el-button>
		</div>
		</el-form>
		<div>
			<div style="margin: 20px 0 0 370px;">
				<a style="font-size: 16px;">单号 :</a>
				<el-input placeholder="9887677678" v-model="input" :disabled="true" style="width: 170px;">
				</el-input>
				<a style="font-size: 16px; margin: 0 0 0 300px;">合计总额 :</a>
				<el-input v-model="input2" placeholder="0.00" style="width: 170px;"></el-input>



			</div>

			<div style="margin: 20px 0 0 339px;">
				<a style="font-size: 16px;">支付方式 :</a>
				<el-select v-model="value" placeholder="现金支付" style="width: 170px;">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<a style="font-size: 16px; margin: 0 0 0 300px;">课程顾问 :</a>
				<el-select v-model="value" placeholder="TSM管理员" style="width: 170px; ">
					<el-option v-for="item in optionss" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>


			</div>
			<div style="margin: 20px 0 0 355px;">
				<a style="font-size: 16px;">经办人 :</a>
				<el-input placeholder="TSM管理员" v-model="input5" :disabled="false" style="width: 170px;">
				</el-input>
				<a style="font-size: 16px; margin: 0 0 0 315px;">购买者 :</a>
				<el-input v-model="input6" placeholder="" style="width: 170px;"></el-input>



			</div>

			<el-button type="primary" style="margin: 20px 0 0 650px;">确 定</el-button>
			<el-button>取 消</el-button>

		</div>
		</el-form>
	</el-dialog>


	<el-dialog title="提示" v-model="dialogVisible" width="30%" :before-close="handleClose">
		<span>确定要删除吗？</span>
		<template #footer>
			<span class="dialog-footer">

				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
			</span>
		</template>
	</el-dialog>





</template>

<script>
	import {
		defineComponent,
		ref
	} from 'vue'

	export default defineComponent({

		data() {
			return {
				input1: ref(''),
				input: ref(''),
				input4: ref(''),
				input3: ref(''),
				input12: ref(''),
				input13: ref(''),
				input14: ref(''),
				tableData: [],
				bookdata:[],
				form: {
					bookdeliveryId: '',
					salenumber: '',
					deliverytime: '',
					bookname: '',
					deliverycount: '',
					booksprice: '',
					zk: '',
					tota: '',
					studentName: '',
					empName: '',


				},
				form1:{
					bookId:'',
					bookName:'',
					booksprice:'',
					deliverycount:'',
					zk:'',
					tota:''
				},
				options: [{
					value: '1',
					label: '现金支付'
				}, {
					value: '2',
					label: '刷卡支付'
				}, {
					value: '3',
					label: '现金+刷卡'
				}, ],
				value: '',

				options1: [{
					value: '1',
					label: '校区'
				}, {
					value: '2',
					label: '教材名'
				}, {
					value: '3',
					label: '课程顾问'
				}, {
					value: '4',
					label: '购买者'
				}, ],


				dialogVisible: false,


				gridData: [{
					date: '',
					name: '',
					address: '',
					zk: '',
					je: '',
					cz: '',
				}],
				dialogTableVisible: false,
				
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
			a(){
				const _this = this
				_this.form1.bookId
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectdel")
				.then(function(response) {
					console.log(response)
					_this.tableData = response.data
				}).catch(function(error) {
					console.log(error)
				})
				this.axios.get("http://localhost:8089/tsm/selectbook")
					.then(function(response) {
						console.log(response)
						_this.bookdata = response.data
						console.log(_this.bookdata)
					}).catch(function(error) {
						console.log(error)
					})
			this.axios.get("http://localhost:8089/tsm/selectBybook")
				.then(function(response) {
					console.log(response)
					_this.input12 = response.data
					console.log(_this.input12)
				}).catch(function(error) {
					console.log(error)
				})

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
