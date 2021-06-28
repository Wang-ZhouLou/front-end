<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>登录限制</el-breadcrumb-item>
	</el-breadcrumb><br>
	<div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="已限制用户" name="first">
				<el-button style="background-color: red;color: white;width: 60px;" type="text" size="mini"
					@click="pldele()"><i class="el-icon-remove-outline"></i>删除
				</el-button>
				<div class="zxdj">
					<el-table :data="YxzData" border style="width: 100%">
						<el-table-column type="selection" width="55" align="center">
						</el-table-column>
						<el-table-column fixed prop="date" label="编号" width="50" align="center">
						</el-table-column>
						<el-table-column prop="name" label="姓名" width="100" align="center">
						</el-table-column>
						<el-table-column prop="province" label="部门" width="200" align="center">
						</el-table-column>
						<el-table-column prop="city" label="职位" width="200" align="center">
						</el-table-column>
						<el-table-column prop="address" label="移动电话" width="210" align="center">
						</el-table-column>
						<el-table-column prop="zip" label="办公电话" width="100" align="center">
						</el-table-column>
						<el-table-column fixed="right" label="Email地址" align="center">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
								<el-button type="text" size="small">回访</el-button>
							</template>
						</el-table-column>
					</el-table>&nbsp;
				</div>
			</el-tab-pane>

			<el-tab-pane label="未限制用户" name="second">
				<el-button style="background-color: #009688;color: white;width: 60px;" type="text" size="mini"
					@click="pldele()"><i class="el-icon-circle-plus-outline"></i>添加限制
				</el-button>
				<div class="zxdj">
					<el-table :data="WxzData" border style="width: 100%" @selection-change="handleSelectionChange"
						ref="multipleTable">
						<el-table-column type="selection" width="55" align="center">
						</el-table-column>
						<el-table-column fixed prop="date" label="编号" width="50" align="center">
						</el-table-column>
						<el-table-column prop="name" label="姓名" width="100" align="center">
						</el-table-column>
						<el-table-column prop="province" label="部门" width="200" align="center">
						</el-table-column>
						<el-table-column prop="city" label="职位" width="200" align="center">
						</el-table-column>
						<el-table-column prop="address" label="移动电话" width="210" align="center">
						</el-table-column>
						<el-table-column prop="zip" label="办公电话" width="100" align="center">
						</el-table-column>
						<el-table-column fixed="right" label="Email地址" align="center">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
								<el-button type="text" size="small">回访</el-button>
							</template>
						</el-table-column>
					</el-table>&nbsp;
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>

</template>

<script>
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			//全选复选框
			SAll() {
				this.$refs.multipleTable.toggleAllSelection();
			},
			//取消选中的复选框
			NSel() {
				this.$refs.multipleTable.clearSelection();
			},
			//批量删除按钮
			pldele() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld();
				} else {
					this.multipleSelection.forEach(item => {
						this.delete1(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
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
				activeName: 'second',
				YxzData: [{
					date: '2',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海市弄',
					zip: 200333
				}],
				WxzData: [{
					date: '2',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					address: '上海市弄',
					zip: 200333
				}]
			}
		}
	}
</script>

<style>
</style>
