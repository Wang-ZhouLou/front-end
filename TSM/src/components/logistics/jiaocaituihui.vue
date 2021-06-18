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
		<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;" @click="dialogTableVisible  = true">退回开单</el-button>
		<el-button type="primary" size="mini" icon="el-icon-delete" @click="dialogVisible = true">删除</el-button>

	</div>

	<el-table :data="tableData" border style="width: 100%" class="el3">
		<el-table-column fixed prop="date" label="编号" width="50">
		</el-table-column>
		<el-table-column type="selection" width="50">
		</el-table-column>
		<el-table-column prop="xsbh" label="退回编号" width="120">
		</el-table-column>
		<el-table-column prop="thrq" label="退回日期" width="120">
		</el-table-column>
		<el-table-column prop="name" label="教材名称" width="390">
		</el-table-column>
		<el-table-column prop="sl" label="数量" width="80">
		</el-table-column>
		<el-table-column prop="sj" label="售价" width="80">
		</el-table-column>
		<el-table-column prop="zk" label="折扣" width="80">
		</el-table-column>
		<el-table-column prop="thje" label="退回金额	" width="80">
		</el-table-column>
		<el-table-column prop="xq" label="校区" width="140">
		</el-table-column>
		<el-table-column prop="gmz" label="购买者" width="100">
		</el-table-column>
		<el-table-column prop="kcgw" label="课程顾问" width="100">
		</el-table-column>
		<el-table-column prop="lrr" label="录入人" width="100">
		</el-table-column>
	</el-table>
	<el-pagination style="text-align: center; margin: 20px 0 0 0;" background :page-size="5" layout="prev, pager, next" :total="50">
		<!-- 总条数 -->
	</el-pagination>

	<el-dialog title="" v-model="dialogTableVisible" style="margin: -30px 0 0 0; height:100%" width="100%">
		<el-table :data="gridData">
			<el-table-column property="date" label="退回教材" width="650"></el-table-column>
			<el-table-column property="name" label="教材售价" width="160"></el-table-column>
			<el-table-column property="address" label="出售数量" width="160"></el-table-column>
			<el-table-column property="zk" label="折扣数" width="160"></el-table-column>
			<el-table-column property="je" label="应收金额" width="160"></el-table-column>
			<el-table-column property="cz" label="操作"></el-table-column>
		</el-table>
		<div style="margin: 10px 0 0 70px;">
			<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="input2" style="width: 120px; ">
			</el-input>&nbsp;
			<el-button type="primary" size="mini" icon="el-icon-search" style="width: 60px; text-align: center;"></el-button>&nbsp;
			<el-select v-model="value" placeholder="校区" style="width: 290px;" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div style="font-size: 16px; margin: -30px 0 0 660px;">
			<span>￥: </span><span>&nbsp;</span><span>/本</span>
		</div>
		<div style="font-size: 16px; margin: -18px 0 0 830px;">
			<span>2</span>本
		</div>
		<div style="margin: -22px 0 0 960px;">
			<el-select v-model="value" size="mini" placeholder="无折扣" style="width: 90px; ">
				<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" >
				</el-option>
			</el-select>
		</div>
		<div style="margin: -23px 0 0 1145px;">
			<span>￥0.00</span>
		</div>
		<div style="margin: -23px 0 0 1260px;">
			<el-button type="primary" icon="el-icon-circle-plus-outline" style="width: 110px;" size="mini">添加教材</el-button>
		</div>

		<div>
			<div style="margin: 20px 0 0 80px;">
				<a style="font-size: 16px;">单号 :</a> <el-input placeholder="9887677678" v-model="input" :disabled="true" style="width: 170px;">
				</el-input>
				<a style="font-size: 16px; margin: 0 0 0 300px;">退回总额 :</a> <el-input v-model="input2" placeholder="0.00" style="width: 170px;"></el-input>
				<a style="margin: 0 0 0 230px;">退回日期 :</a> <el-date-picker v-model="value1" type="date" placeholder="选择日期">
				</el-date-picker>
				
			</div>
			
			<div style="margin: 20px 0 0 49px;">
				<a style="font-size: 16px;">课程顾问 :</a> <el-select v-model="value" placeholder="校区" style="width: 170px;">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
				<a style="font-size: 16px; margin: 0 0 0 315px;">录入人 :</a> <el-input placeholder="9887677678" v-model="input4" :disabled="true" style="width: 170px;">
				</el-input>
				
				
			</div>

		</div>
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
				tableData: [{
					date: '1',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}, {
					date: '2',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}, {
					date: '3',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}, {
					date: '4',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}, {
					date: '5',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}, {
					date: '6',
					xsbh: '12846194189',
					xsrq: '2020/0109',
					name: '王周楼和梁政',
					sl: '41',
					sj: '22',
					zk: '无',
					hj: '112',
					xq: '清华校区',
					gmz: '梁政',
					kcgw: '王周楼',
					lrr: '王周楼'
				}],

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
