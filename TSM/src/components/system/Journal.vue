<template>
	<el-tabs type="border-card">
		<el-tab-pane label="登录日志">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="登录时间" value="1"></el-option>
								<el-option label="退出时间" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="loginData" border style="width: 1200px">
						<el-table-column type="selection" width="35">
						</el-table-column>
						<el-table-column prop="loginid" label="登录日志编号" width="266">
						</el-table-column>
						<el-table-column prop="empid" label="职员名称" width="266">
						</el-table-column>
						<el-table-column prop="logintime" label="登录时间" width="266">
						</el-table-column>
						<el-table-column prop="exittime" label="退出时间" width="266">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="100">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
								<el-button type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="pageInfo.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="操作日志">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="操作内容" value="1"></el-option>
								<el-option label="操作时间" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="opData" border style="width: 1200px">
						<el-table-column type="selection" width="35">
						</el-table-column>
						<el-table-column prop="opid" label="操作日志编号" width="266">
						</el-table-column>
						<el-table-column prop="empid" label="职员名称" width="266">
						</el-table-column>
						<el-table-column prop="content" label="操作内容" width="266">
						</el-table-column>
						<el-table-column prop="optime" label="操作时间" width="266">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="100">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
								<el-button type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination" style="margin-top: 20px;display:flex;justify-content: center">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="pageInfo.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
					</el-pagination>
				</div>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import {
		defineComponent,
		ref
	} from 'vue'
	export default defineComponent({
		data() {
			return {
				input3: ref(''),
				select: ref(''),
				dialogFormVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				value2: "",
				fileList: [],
				ruleForm: {
					suggest: '',
					title: '',
					type: '',
					starttime: '',
					endtime: '',
					remind: false,
					nature: '',
					name: '',
					remindtime: '',
					address: '',
					anonymous: false,
					upload: ''
				},
				rules: {
					title: [{
							required: true,
							message: '请填写标题',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 11,
							message: '长度在 1 到 11 个字符',
							trigger: 'blur'
						}
					],
					type: [{
						required: true,
						message: '请选择意见箱',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				memorandumData: [],
				pageInfo: {
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				opData: [{
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}, {
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}, {
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}, {
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}, {
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}, {
					opid: '1',
					empid: '1',
					content: '哈哈哈',
					optime: '2021-05-26',
				}],
				loginData: [{
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
				}, {
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
				}, {
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
				}, {
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
				}, {
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
				}, {
					loginid: '1',
					empid: '1',
					logintime: '2021-05-26',
					exittime: '2021-05-26'
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
			}
		},
		methods: {
			test() {
				console.log("111")
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
		}
	});
</script>

<style>
	.el-select .el-input {
		width: 130px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.addcontent {
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
	}

	.addcontent1 {
		width: 100%;
	}

	.addcontent_line {
		width: 100%;
		height: 65px;
	}

	.textarea {
		height: 155px;
	}

	.upload {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>
