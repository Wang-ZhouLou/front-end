<template>
	<el-tabs type="border-card" @tab-click="anTypeClick">
		<el-tab-pane label="公告管理">
			<div class="all" style="width: 100%;height: 100%;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="公告主题" value="1"></el-option>
								<el-option label="公告状态" value="2"></el-option>
								<el-option label="公告内容" value="3"></el-option>
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
						<el-table-column fixed="left" prop="theme" label="公告主题" width="213">
						</el-table-column>
						<el-table-column prop="type" label="公告类型" width="213">
						</el-table-column>
						<el-table-column prop="content" label="公告内容" width="213">
						</el-table-column>
						<el-table-column prop="state" label="公告状态" width="213">
						</el-table-column>
						<el-table-column prop="select" label="允许查看人员" width="213">
						</el-table-column>
						<el-table-column prop="addname" label="录入人" width="213">
						</el-table-column>
						<el-table-column prop="addtime" label="录入时间" width="213">
						</el-table-column>
						<el-table-column prop="starttime" label="开始时间" width="213">
						</el-table-column>
						<el-table-column prop="endtime" label="结束时间" width="213">
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

			<el-dialog title="添加公告" v-model="dialogFormVisible" width="950px">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent">
						<div class="addcontent1">
							<div class="addcontent_line">
								<el-form-item label="公告标题" prop="title">
									<el-input v-model="ruleForm.title"></el-input>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="公告类型" prop="type">
									<el-select v-model="ruleForm.type" placeholder="请选择类型">
										<el-option label="企业" value="rengwu"></el-option>
										<el-option label="部门" value="yuehui"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="允许查看人员" prop="select">
									<el-input v-model="ruleForm.select" style="width: 150px;"></el-input>&nbsp;
									<el-button size="small" type="primary" @click="dialogwhoselectVisible=true">选取文件
									</el-button>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="选择附件" prop="upload">
									<el-input v-model="input" style="width: 250px;"></el-input><br /><br />
									<el-button size="small" type="primary" @click="dialogUploadVisible=true">选取文件
									</el-button>
									<el-button style="margin-left: 10px;" size="small" type="success"
										@click="submitUpload">上传
									</el-button>
								</el-form-item>
							</div>
						</div>
						<div class="addcontent2">
							<div class="addcontent_line">
								<el-form-item label="开始时间" required>
									<el-col :span="11">
										<el-form-item prop="starttime">
											<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.starttime"
												style="width: 150px;">
											</el-date-picker>
										</el-form-item>
									</el-col>
								</el-form-item>
							</div>
							<div class="addcontent_line">
								<el-form-item label="结束时间" required>
									<el-col :span="11">
										<el-form-item prop="endtime">
											<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endtime"
												style="width: 150px;">
											</el-date-picker>
										</el-form-item>
									</el-col>
								</el-form-item>
							</div>
							<div class="addcontent_line textarea">
								<el-form-item label="公告内容" prop="content">
									<el-input type="textarea" v-model="ruleForm.content" :rows="7"></el-input>
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

			<el-dialog title="选择允许查看人员" v-model="dialogwhoselectVisible" width="820px">
				<el-tree :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange">
				</el-tree>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogwhoselectVisible = false">关闭</el-button>
						<el-button type="primary" @click="dialogwhoselectVisible = false">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tab-pane>
		<el-tab-pane label="公告类型管理">
			<div class="all" style="width: 100%;height: 550px;">
				<div class="time" style="display: flex;justify-content: center;">
					<el-input placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 500px;">
						<template #prepend>
							<el-select v-model="select" placeholder="请选择">
								<el-option label="编号" value="1"></el-option>
								<el-option label="公告类型名称" value="2"></el-option>
							</el-select>
						</template>
						<template #append>
							<el-button icon="el-icon-search"></el-button>
						</template>
					</el-input>
					<el-button type="primary" @click="addAnTypeVisible = true" style="margin-left: 10px;">
						添加<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"></el-button>
				</div>
				<div class="memorandum" style="margin-top: 20px;display:flex;justify-content: center">
					<el-table :data="anTypeData" border style="width: 1200px">
						<el-table-column type="selection" width="35">
						</el-table-column>
						<el-table-column fixed="left" prop="announcementtypeId" label="编号" width="266">
						</el-table-column>
						<el-table-column prop="announcementtypeName" label="公告类型名称" width="266">
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
								<el-button @click="updateAnTypeOpen(scope.row)" type="text" size="small">编辑
								</el-button>
								<el-button @click="deleteAnTypeOpen(scope.row)" type="text" size="small">删除
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

			<el-dialog title="添加公告类型" v-model="addAnTypeVisible" width="400px" top="27vh">
				<el-form :model="anTypeForm" :rules="rules" ref="anTypeForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;">
						<el-form-item label="公告类型名称">
							<el-input v-model="anTypeForm.announcementtypeName"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="addAnTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="addAnType">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="编辑公告类型" v-model="updateAnTypeVisible" width="400px" top="27vh">
				<el-form :model="anTypeForm" :rules="rules" ref="anTypeForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent_line">
						<el-form-item label="编号">
							<el-input v-model="anTypeForm.announcementtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="公告类型名称">
							<el-input v-model="anTypeForm.announcementtypeName"></el-input>
						</el-form-item>
						<el-form-item label="增加人">
							<el-input v-model="anTypeForm.addname" disabled="true"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="updateAnTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="updateAnType">保存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="确定要删除此条数据吗" v-model="deleteAnTypeVisible" width="400px" top="27vh">
				<el-form :model="anTypeForm" :rules="rules" ref="anTypeForm" label-width="100px" class="demo-ruleForm"
					size="mini" label-position="right">
					<div class="addcontent_line" style="margin-top: 25px;">
						<el-form-item label="编号">
							<el-input v-model="anTypeForm.announcementtypeId" disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="公告类型名称">
							<el-input v-model="anTypeForm.announcementtypeName" disabled="true"></el-input>
						</el-form-item>
					</div>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="deleteAnTypeVisible = false">关闭</el-button>
						<el-button type="primary" @click="deleteAnType">保存</el-button>
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
				updateAnTypeVisible: false,
				deleteAnTypeVisible: false,
				addAnTypeVisible: false,
				dialogwhoselectVisible: false,
				dialogFormVisible: false,
				dialogUploadVisible: false,
				formLabelWidth: '120px',
				value2: "",
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
				ruleForm: {},
				anTypeForm: {
					announcementtypeId: '',
					announcementtypeName: '',
					addname: '',
					addtime: '',
					updatename: '',
					updatetime: '',
					deletename: '',
					deletetime: '',
					timeliness: ''
				},
				anTypeData: []
			}
		},
		methods: {
			anTypeClick() {
				const _this = this
				this.axios.get("http://localhost:8089/team/selectAllAnType").then(function(response) {
					console.log(response)
					_this.anTypeData = response.data
				}).catch(function(error) {
					console.log(error)
				})
			},
			addAnType() {
				const _this = this
				this.axios.post("http://localhost:8089/team/insertAnType", this.anTypeForm).then(function(
					response) {
					console.log(response)
					var anType = response.data
					_this.anTypeData.push(anType)
					_this.addAnTypeVisible = false
					for(var key in _this.anTypeForm){
						delete _this.anTypeForm[key]
					}
				}).catch(function(error) {
					console.log(error)
				})
			},
			updateAnTypeOpen(row) {
				const _this = this
				_this.anTypeForm.announcementtypeId = row.announcementtypeId
				_this.anTypeForm.announcementtypeName = row.announcementtypeName
				_this.anTypeForm.addname = row.addname
				_this.anTypeForm.timeliness = row.timeliness
				_this.updateAnTypeVisible = true
			},
			deleteAnTypeOpen(row) {
				const _this = this
				_this.anTypeForm.announcementtypeId = row.announcementtypeId
				_this.anTypeForm.announcementtypeName = row.announcementtypeName
				_this.anTypeForm.addname = row.addname
				_this.deleteAnTypeVisible = true
			},
			updateAnType() {
				const _this = this
				this.axios.put("http://localhost:8089/team/updateAnTypeName", this.anTypeForm).then(function(
					response) {
					console.log(response)
					var anType = response.data
					var row = _this.anTypeData.filter(a => a.announcementtypeId == anType
						.announcementtypeId)[0]
					row.announcementtypeName = anType.announcementtypeName
					row.updatename = anType.updatename
					row.updatetime = anType.updatetime
					_this.updateAnTypeVisible = false
				}).catch(function(error) {
					console.log(error)
				})
			},
			deleteAnType() {
				const _this = this
				this.axios.put("http://localhost:8089/team/deleteAnType", this.anTypeForm).then(function(
					response) {
					console.log(response)
					// var unitType = response.data
					var rows = _this.anTypeData.filter(a => a.announcementtypeId != _this.anTypeForm
						.announcementtypeId)
					_this.anTypeData = rows
					_this.deleteAnTypeVisible = false
				}).catch(function(error) {
					console.log(error)
				})
			}
		}
	});
</script>

<style>
	.textarea {
		height: 155px;
	}

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
		width: 400px;
	}

	.addcontent2 {
		width: 400px;
	}

	.addcontent_line {
		width: 100%;
		height: 100px;
	}

	.upload {
		display: flex;
		justify-content: center;
	}
</style>
