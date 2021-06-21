<template>
	<el-tabs type="border-card" @tab-click="systemTypeClick">
		<el-tab-pane label="规章制度管理">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="制度主题" value="1"></el-option>
								<el-option label="制度状态" value="2"></el-option>
								<el-option label="制度内容" value="3"></el-option>
								<el-option label="制度类型" value="4"></el-option>
								<el-option label="发文单位" value="5"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="dialogFormVisible = true" style="margin-left: 10px;">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;">
						发布<i class="el-icon-s-promotion el-icon--right"></i>
					</el-button>
					<el-button type="primary" style="margin-left: 10px;">
						暂停<i class="el-icon-warning el-icon--right"></i>
					</el-button>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="tableData" border style="width: 1200px">
						<el-table-column type="selection" width="35">
						</el-table-column>
						<el-table-column fixed="left" prop="theme" label="制度主题" width="213">
						</el-table-column>
						<el-table-column prop="type" label="制度类型" width="213">
						</el-table-column>
						<el-table-column prop="content" label="制度内容" width="213">
						</el-table-column>
						<el-table-column prop="state" label="制度状态" width="213">
						</el-table-column>
						<el-table-column prop="dept" label="发文单位" width="213">
						</el-table-column>
						<el-table-column prop="addname" label="录入人" width="213">
						</el-table-column>
						<el-table-column prop="addtime" label="录入时间" width="213">
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
						:current-page="pageInfo1.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo1.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="添加规章制度" v-model="dialogFormVisible" width="950px">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="制度标题" prop="title">
									<el-input v-model="ruleForm.title"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="制度类型" prop="type">
									<el-select v-model="ruleForm.type" placeholder="请选择类型">
										<el-option label="国家政策" value="guojia"></el-option>
										<el-option label="集团规章" value="jituan"></el-option>
										<el-option label="员工守则" value="yuangong"></el-option>
										<el-option label="岗位规范" value="gangwei"></el-option>
										<el-option label="物业服务指南" value="wuye"></el-option>
										<el-option label="装修申请指南" value="zhuangxiu"></el-option>
										<el-option label="单位制度" value="danwei"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="发文单位" prop="dept">
									<el-select v-model="ruleForm.dept" placeholder="请选择单位">
										<el-option label="教务部" value="rengwu"></el-option>
										<el-option label="行政部" value="yuehui"></el-option>
										<el-option label="招生部" value="laifang"></el-option>
										<el-option label="财务部" value="huiyi"></el-option>
										<el-option label="技术部" value="dianhua"></el-option>
										<el-option label="后勤部" value="jiaqi"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line textarea">
								<el-form-item label="制度内容" prop="content">
									<el-input type="textarea" v-model="ruleForm.content" :rows="7"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line" style="margin-top: 10px;">
								<el-form-item label="选择附件" prop="upload">
									<el-input v-model="input" style="width: 450px;"></el-input>&nbsp;
									<el-button size="small" type="primary" @click="dialogUploadVisible=true">选取文件
									</el-button>
									<el-button style="margin-left: 10px;" size="small" type="success"
										@click="submitUpload">上传</el-button>
								</el-form-item>
							</div>
						</div>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogFormVisible = false">关闭</el-button>
						<el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog title="选择附件" v-model="dialogUploadVisible" width="820px">
				<div class="upload">
					<el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogUploadVisible = false">关闭</el-button>
						<el-button type="primary" @click="dialogUploadVisible = false">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>
		<el-tab-pane label="规章制度类型管理">
			<div class="all" style="width: 100%;height: 550px;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="编号" value="1"></el-option>
								<el-option label="规章制度类型名称" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addSystemTypeVisible = true" style="margin-left: 10px;">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="systemTypeData" border style="width: 1200px">
						<el-table-column type="selection" width="35">
						</el-table-column>
						<el-table-column fixed="left" prop="systemtypeId" label="编号" width="266">
						</el-table-column>
						<el-table-column prop="systemtypeName" label="规章制度类型名称" width="266">
						</el-table-column>
						<el-table-column prop="addname" label="增加人" width="266">
						</el-table-column>
						<el-table-column prop="addtime" label="增加时间" width="266">
						</el-table-column>
						<el-table-column prop="updatename" label="最后修改人" width="266">
						</el-table-column>
						<el-table-column prop="updatetime" label="最后修改时间" width="266">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="100">
							<template #default="scope">
								<el-button @click="updateSystemTypeOpen(scope.row)" type="text" size="small">编辑
								</el-button>
								<el-button @click="deleteSystemTypeOpen(scope.row)" type="text" size="small">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination"
					style="margin-top: 30px;display:flex;justify-content: center;position: absolute;width: 100%;">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="pageInfo2.currentPage" :page-sizes="[3, 6]" :page-size="pageInfo2.pagesize"
						layout="total, sizes, prev, pager, next, jumper" :total="pageInfo2.total">
					</el-pagination>
				</div>
			</div>

			<el-dialog title="添加单位类型" v-model="addSystemTypeVisible" width="400px" top="27vh">
				<el-form :model="systemTypeForm" :rules="rules" ref="sytstemTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;">
						<el-form-item label="单位名称">
							<el-input v-model="systemTypeForm.systemtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="addSystemTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="addSystemType">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑单位类型" v-model="updateSystemTypeVisible" width="400px" top="27vh">
				<el-form :model="systemTypeForm" :rules="rules" ref="systemTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line">
						<el-form-item label="编号">
							<el-input v-model="systemTypeForm.systemtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="单位名称">
							<el-input v-model="systemTypeForm.systemtypeName"></el-input>
						</el-form-item>
						<el-form-item label="单位增加人">
							<el-input v-model="systemTypeForm.addname" disabled="true"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="updateSystemTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="updateSystemType">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="确定要删除此条数据吗" v-model="deleteSystemTypeVisible" width="400px" top="27vh">
				<el-form :model="systemTypeForm" :rules="rules" ref="systemTypeForm" label-width="100px"
					class="demo-ruleForm" size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;">
						<el-form-item label="编号">
							<el-input v-model="systemTypeForm.systemtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="单位名称">
							<el-input v-model="systemTypeForm.systemtypeName" disabled="true"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="deleteSystemTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="deleteSystemType">保存</el-button>
					</span>
				</template>
			</el-dialog>
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
				props: {
					label: 'name',
					children: 'zones'
				},
				count: 1,
				input3: ref(''),
				select: ref(''),

				addSystemTypeVisible: false,
				updateSystemTypeVisible: false,
				deleteSystemTypeVisible: false,
				dialogwhoselectVisible: false,
				dialogFormVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				value2: "",
				ruleForm: {
					theme: '',
					type: '',
					content: '',
					state: '',
					dept: '',
					addtime: '',
					addname: ''
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
					starttime: [{
						type: 'date',
						required: true,
						message: '请选择开始日期',
						trigger: 'change'
					}],
					endtime: [{
						type: 'date',
						required: true,
						message: '请选择结束日期',
						trigger: 'change'
					}],
					type: [{
						required: true,
						message: '请选择意见箱',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				systemTypeData: [],
				systemTypeForm: {
					systemtypeId: '',
					systemtypeName: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					deletename: '',
					deletetime: '',
					timeliness: ''
				},
				pageInfo1: {
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				pageInfo2: {
					currentPage: 1,
					pagesize: 6,
					total: 0
				},
				tableData: [{
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '123456789098765432123',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
				}, {
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '123456789098765432123',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
				}, {
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '123456789098765432123',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
				}, {
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '1234567890987654321',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
				}, {
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '123456789098765432123',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
				}, {
					theme: '关于暑假课程安排',
					type: '课程安排',
					content: '12345678909876543212',
					state: '未发布',
					dept: '行政部',
					addtime: '2021-05-20',
					addname: '大帅哥'
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
			systemTypeClick() {
				const _this = this
				this.axios.get("http://localhost:8089/team/selectAllSystemType").then(function(response) {
					console.log(response)
					_this.systemTypeData = response.data
				}).catch(function(error) {
					console.log(error)
				})
			},
			addSystemType() {
				const _this = this
				this.axios.post("http://localhost:8089/team/insertSystemType", this.systemTypeForm).then(function(
					response) {
					console.log(response)
					var systemType = response.data
					_this.systemTypeData.push(systemType)
					_this.addSystemTypeVisible = false
					for(var key in _this.systemTypeForm){
						delete _this.systemTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			updateSystemTypeOpen(row) {
				const _this = this
				_this.systemTypeForm.systemtypeId = row.systemtypeId
				_this.systemTypeForm.systemtypeName = row.systemtypeName
				_this.systemTypeForm.addname = row.addname
				_this.systemTypeForm.timeliness = row.timeliness
				_this.updateSystemTypeVisible = true
			},
			deleteSystemTypeOpen(row) {
				const _this = this
				_this.systemTypeForm.systemtypeId = row.systemtypeId
				_this.systemTypeForm.systemtypeName = row.systemtypeName
				_this.systemTypeForm.addname = row.addname
				_this.deleteSystemTypeVisible = true
			},
			updateSystemType() {
				const _this = this
				this.axios.put("http://localhost:8089/team/updateSystemTypeName", this.systemTypeForm).then(function(
					response) {
					console.log(response)
					var systemType = response.data
					var row = _this.systemTypeData.filter(a => a.systemtypeId == systemType
						.systemtypeId)[0]
					row.systemtypeName = systemType.systemtypeName
					row.updatename = systemType.updatename
					row.updatetime = systemType.updatetime
					_this.updateSystemTypeVisible = false
				}).catch(function(error) {
					console.log(error)
				})
			},
			deleteSystemType() {
				const _this = this
				this.axios.put("http://localhost:8089/team/deleteSystemType", this.systemTypeForm).then(function(
					response) {
					console.log(response)
					var rows = _this.systemTypeData.filter(a => a.systemtypeId != _this.systemTypeForm
						.systemtypeId)
					_this.systemTypeData = rows
					_this.deleteSystemTypeVisible = false
				}).catch(function(error) {
					console.log(error)
				})
			}
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
		height: 100px;
		;
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
