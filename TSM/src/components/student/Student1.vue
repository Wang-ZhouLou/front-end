<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>学员档案</el-breadcrumb-item>
	</el-breadcrumb><br>
	<!-- <div>
		<el-button size="mini" @click="dialogFormVisible = true">新增</el-button>
		<el-button size="mini">审批通过</el-button>
	</div> -->

	<el-dialog title="新增学员" v-model="dialogFormVisible">
		<el-form :model="form">
			<el-form-item>
				<div style="margin: 0 0 0 35px;">
					生源渠道: <el-select v-model="form.source" style="margin-right: 160px; width: 180px;">
						<el-option v-for="items in SourceData" :key="items.sourceId" :label="items.sourceName"
							:value="items">
						</el-option>
					</el-select>
					联系地址: <el-input v-model="form.address" style="width: 190px;margin-right: 10px;"></el-input>
				</div>
				<div style="margin: 16px 0 0 35px;">
					学生姓名: <el-input v-model="form.studentName"
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					学生电话: <el-input v-model="form.studentPhone" style="width: 190px;margin-right: 10px;"></el-input>
				</div>
				<div style="margin: 16px 0 0 35px;">
					家长姓名: <el-input v-model="form.parentname"
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					家长电话: <el-input v-model="form.parentphone" style="width: 190px;margin-bottom: 10px;"></el-input>
				</div>
				<div style="margin: 10px 0 0 58px;">
					性别: &nbsp; <el-radio v-model="form.sex" default label="男">男</el-radio>
					<el-radio v-model="form.sex" label="女" style="margin-right: 225px;">女</el-radio>
				</div>
				<div style="margin: 0 0 0 34px;">
					入学备注:<el-input style="margin-bottom: 10px;" type="textarea" :rows="2" placeholder="请输入内容"
						v-model="form.entrance">
					</el-input>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close()">取 消</el-button>
				<el-button type="primary" @click="add()">确 定</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="学员编辑" v-model="dialogFormVisible2">
		<el-form :model="form">
			<el-form-item>
				<div style="margin: 0 0 0 35px;">
					学号: <el-input v-model="form.studentId" disabled style="width: 190px;margin-left: 20px;"></el-input>
					<br />
					生源渠道: <el-select v-model="form.source.sourceId"
						style="margin-right: 160px;margin-top: 20px; width: 180px;">
						<el-option v-for="items in SourceData" :key="items.sourceId" :label="items.sourceName"
							:value="items.sourceId">
						</el-option>
					</el-select>
					联系地址: <el-input v-model="form.address" style="width: 190px;margin-right: 10px;"></el-input>
				</div>
				<div style="margin: 16px 0 0 35px;">
					学生姓名: <el-input v-model="form.studentName"
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					学生电话: <el-input v-model="form.studentPhone" style="width: 190px;margin-right: 10px;"></el-input>
				</div>
				<div style="margin: 16px 0 0 35px;">
					家长姓名: <el-input v-model="form.parentname"
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					家长电话: <el-input v-model="form.parentphone" style="width: 190px;margin-bottom: 10px;"></el-input>
				</div>
				<div style="margin: 10px 0 0 58px;">
					性别: &nbsp; <el-radio v-model="form.sex" default label="男">男</el-radio>
					<el-radio v-model="form.sex" label="女" style="margin-right: 225px;">女</el-radio>
				</div>
				<div style="margin: 0 0 0 34px;">
					入学备注:<el-input style="margin-bottom: 10px;" type="textarea" :rows="2" placeholder="请输入内容"
						v-model="form.entrance">
					</el-input>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close()">取 消</el-button>
				<el-button type="primary" @click="update()">确 定</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="学员分班信息" v-model="dialogFormVisible11">
		<el-form :model="form11">
			&nbsp;
			班级名称：
			<el-select v-model="form11" :index='index' size=mini style="width: 120px;">
				<el-option v-for="(items,index) in  ClassesData" v-on:click.enter="cha12(index)" :key="items.classesId"
					:label="items.classesName" :value="items.classesId"></el-option>
			</el-select>
			<el-form-item label="课程名称" width="120">
				<el-input v-model="form11.courseName" autocomplete="off" width="90" disabled></el-input>
			</el-form-item>
			<el-form-item label="班级人数" width="120">
				<el-input v-model="form11.classesSize" type="text" autocomplete="off" disabled></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible11 = false">取 消</el-button>
				<el-button type="primary" @click="addClassesId(row)">确 定</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="查看学员详细信息" v-model="dialogFormVisible10">
		<el-form :model="form">
			<el-form-item>
				<div style="margin: 16px 0 0 35px;">
					学号: <el-input v-model="form.studentId" disabled
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					生源渠道: <el-input v-model="form.source.sourceName" style="width: 190px;margin-bottom: 10px;" disabled>
					</el-input>
				</div>
				<div style="margin: 16px 0 0 35px;">
					性别: <el-input v-model="form.sex" disabled
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					联系地址: <el-input v-model="form.address" style="width: 190px;margin-bottom: 10px;" disabled>
					</el-input>
				</div>
				<div style="margin: 16px 0 0 10px;">
					学生姓名: <el-input v-model="form.studentName"
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;" disabled>
					</el-input>
					学生电话: <el-input v-model="form.studentPhone" style="width: 190px;margin-right: 10px;" disabled>
					</el-input>
				</div>
				<div style="margin: 16px 0 0 10px;">
					家长姓名: <el-input v-model="form.parentname" disabled
						style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
					</el-input>
					家长电话: <el-input v-model="form.parentphone" style="width: 190px;margin-bottom: 10px;" disabled>
					</el-input>
				</div>
				<div style="margin: 16px 0 0 10px;">
					入学备注:<el-input style="margin-bottom: 10px;" type="textarea" :rows="2" disabled
						v-model="form.entrance">
					</el-input>
				</div>
			</el-form-item>
			<hr />
			<hr />
			<hr />
			<el-table border :data="CourseRecorddetailsData2" style="margin-top: 20px;">
				<el-table-column label="" align="center" prop="courserecorddetailsId">
				</el-table-column>
				<el-table-column label="班级名称" align="center" prop="classesVo.classesName">
					<template v-slot="scope">
						{{ scope.row.classesVo.classesName || '暂未分班' }}
					</template>
				</el-table-column>
				<el-table-column label="报课日期" align="center" prop="courserecordVo.addtime">
				</el-table-column>
				<el-table-column label="报读课程" align="center" prop="courseVo.courseName">
				</el-table-column>
				<el-table-column label="应收" align="center" prop="courseVo.courseMoney">
				</el-table-column>
				<el-table-column label="状态" align="center" prop="learningstate">
					<template v-slot="scope">
						<p v-if="scope.row.learningstate==0">未分班</p>
						<p v-if="scope.row.learningstate==1">分班审核中</p>
						<p v-if="scope.row.learningstate==2">学习中</p>
						<p v-if="scope.row.learningstate==3">停课审核中</p>
						<p v-if="scope.row.learningstate==4">停课中</p>
						<p v-if="scope.row.learningstate==5">退学审核中</p>
						<p v-if="scope.row.learningstate==6">已退学</p>
						<p v-if="scope.row.learningstate==7">复课审核中</p>
						<p v-if="scope.row.learningstate==8">转班审核中</p>
						<p v-if="scope.row.learningstate==9">已转班</p>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center" prop="remarks">
				</el-table-column>
				<el-table-column label="操作" align="center" width="320">
					<template v-slot="scope">
						<div style="display:flex;justify-content:center">
							<el-button v-if="scope.row.learningstate== 0" size="mini" type="info"
								@click="cha11(scope.row)">分班</el-button>
							<el-button size="mini" type="info" @click="updateLearningstate3(scope.row)">停课</el-button>
							<el-button type="info" size="mini" @click="updateLearningstate7(scope.row)">复课</el-button>
							<el-button size="mini" type="info" @click="updateLearningstate8(scope.row)">转班</el-button>
							<el-button type="info" size="mini" @click="updateLearningstate5(scope.row)">退学</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close2()">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible10 = false">确 定</el-button>
			</span>
		</template>
	</el-dialog>


	<el-dialog title="课程预报" v-model="dialogFormVisible3">
		<el-form :model="form1">
			<el-form-item>
				<div style="margin: -25px 0 0 25px ;font-size: 13px;">
					学号: {{form.studentId}}
					&nbsp;
					姓名: {{form.studentName}}
				</div>
				<div class="qdwh">
					<p style="text-align: center; font-size: 13px;">预报课程</p>
					<el-table border style="width: 100%" size=mini :data="CourserecorddetailsData">
						<el-table-column prop="course.courseName" label="课程名称" width="150" align="center">
						</el-table-column>
						<el-table-column prop="course.classhours" label="课时数" width="120" align="center">
						</el-table-column>
						<el-table-column prop="course.courseMoney" label="课程费用" width="120" align="center">
						</el-table-column>
						<el-table-column prop="remarks" label="备注" align="center">
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template #default="scope">
								<el-button type="text" size="small" @click="delCourserecorddetails(scope.row)">
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>


				<p style="text-align: center; font-size: 13px;">预报信息</p>
				<div>
					<div style="margin: 0 0 0 30px;">
						课时数: <el-input v-model="form2.course.classhours" disabled size=mini
							style="width: 180px;margin-right: 170px;">
						</el-input>
						课类选择: <el-select id="aa" v-model="form2.classtype.classtypeId" size=mini style="width: 90px;">
							<el-option v-for="item in ClasstypesData" :key="item.classtypeId" v-on:click.enter="cha1()"
								:label="item.classtypeName" :value="item.classtypeId"></el-option>
						</el-select>
						&nbsp;
						<el-select v-model="form2.course.courseId" :index='index' size=mini style="width: 90px;">
							<el-option v-for="(items,index) in CourseData" v-on:click.enter="cha2(index)"
								:key="items.courseId" :label="items.courseName" :value="items.courseId"></el-option>
						</el-select>
					</div>
					<div style="margin: 0 0 0 30px;">
						费用: <el-input v-model="form2.course.courseMoney" disabled size=mini
							style="width: 184px;margin-right: 195px;"></el-input>
						备注: <el-input style="width: 200px;" v-model="form2.course.remarks" size=mini>
						</el-input>
					</div>
					<el-button size=mini @click="yubao()" style="margin-left: 584px;">添加预报</el-button>
				</div>
				<hr>
				费用总额: <el-input v-model="receipts" size=mini style="width: 180px;margin-right: 180px;">
				</el-input>
				录入人: <el-input v-model="person" size=mini style="width: 180px;">
				</el-input><br>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close()">关闭</el-button>
				<el-button type="primary" @click="addSource">保 存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="学员退学" v-model="dialogFormVisible12">
		<el-form :model="form13">
			<el-form-item>
				<!-- <div style="margin: 16px 0 0 35px;">
			  	学号: <el-input v-model="form13.studentId" style="width: 190px;margin-bottom: 10px;" readonly="true">
			  	</el-input>
				退学学员: <el-input v-model="form13.studentName" readonly="true"
					style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
				</el-input>
			  </div> -->
				<!-- <div style="margin: 16px 0 0 35px;">
			  	报读课程编号: <el-input v-model="form13.courserecorddetailsId" style="width: 190px;margin-bottom: 10px;">
			  	</el-input>
			  </div> -->
				<div style="margin: 16px 0 0 10px;">
					退学理由:<el-input style="margin-bottom: 10px;" type="textarea" :rows="2" v-model="form13.dropReason">
					</el-input>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible12=false">关闭</el-button>
				<el-button type="primary" @click="addDrop(row)">保 存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="学员停课" v-model="dialogFormVisible22">
		<el-form :model="form23">
			<el-form-item>
				<!-- <div style="margin: 16px 0 0 35px;">
			  	学号: <el-input v-model="form13.studentId" style="width: 190px;margin-bottom: 10px;" readonly="true">
			  	</el-input>
				退学学员: <el-input v-model="form13.studentName" readonly="true"
					style="width: 190px;margin-bottom: 10px;margin-right: 140px;">
				</el-input>
			  </div> -->
				<!-- <div style="margin: 16px 0 0 35px;">
			  	报读课程编号: <el-input v-model="form13.courserecorddetailsId" style="width: 190px;margin-bottom: 10px;">
			  	</el-input>
			  </div> -->
				<div style="margin: 16px 0 0 10px;">
					停课理由:<el-input style="margin-bottom: 10px;" type="textarea" :rows="2"
						v-model="form23.suspendReason">
					</el-input>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible22=false">关闭</el-button>
				<el-button type="primary" @click="addSuspend(row)">保 存</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog title="学员复课" v-model="dialogFormVisible32">
		<el-form :model="form33">
			<el-form-item>
				<div style="margin: 16px 0 0 35px;">
					缺课节数: <el-input v-model="form33.absent" style="width: 90px;margin-bottom: 10px;">
					</el-input>
					<br />

					<!-- 请选择复课意向:<el-select  size=mini v-model="form33.intention">
						<el-option value="0" label="跟班"></option>
						<el-option value="1" label="转班"></option>
					</el-select> -->
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible42=false">关闭</el-button>
				<el-button type="primary" @click="addBack(row)">保 存</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog title="学员转班" v-model="dialogFormVisible42">
		<el-form :model="form43">
			<el-form-item>
				<div style="margin: 16px 0 0 35px;">
					原班级:<el-input v-model="form43.oldclass" style="width: 90px;"></el-input>

					意向班级:<el-select v-model="form43.classesId" :index='index' size=mini style="width: 90px;">
						<el-option v-for="(items,index) in ClassesData" :key="items.classesId"
							:label="items.classesName" :value="items.classesId"></el-option>
					</el-select>
					转班理由：<el-input v-model="form43.shiftReason" style="width: 90px;"></el-input>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogFormVisible42=false">关闭</el-button>
				<el-button type="primary" @click="addShift(row)">保 存</el-button>
			</span>
		</template>
	</el-dialog>


	<el-table border @selection-change="handleSelectionChange" :data="StudentData" style="margin-top: 20px;">
		<el-table-column type="selection" align="center" width="55">
		</el-table-column>
		<el-table-column label="编号" align="center" prop="studentId">
		</el-table-column>
		<el-table-column label="报名日期" align="center" prop="studytime">
		</el-table-column>
		<el-table-column label="姓名" align="center" prop="studentName">
		</el-table-column>
		<el-table-column label="联系地址" align="center" prop="address">
		</el-table-column>
		<el-table-column label="联系电话" align="center" prop="studentPhone">
		</el-table-column>
		<el-table-column label="状态" align="center" prop="">
			<template v-slot="slot">
				<p v-if="slot.row.attentstate==0||slot.row.attentstate==1"><i class="el-icon-user-solid"></i>
				</p>
				<p v-if="slot.row.attentstate==2"><i class="el-icon-check"></i></p>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center" width="250">
			<template v-slot="scope">
				<div style="display:flex;justify-content:center">
					<el-button size="mini" type="info" @click="showEdit2(scope.row)">补报</el-button>
					<el-button size="mini" type="info" @click="showEdit(scope.row)">编辑</el-button>
					<el-button type="info" size="mini" @click="selectAllCourseRecorddetails(scope.row)">详情</el-button>
					<el-button type="info" size="mini" @click="delete1(scope.row)">删除</el-button>
				</div>
			</template>
		</el-table-column>
	</el-table>
	<!-- 分页 -->
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo1.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo1.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo1.total">
		</el-pagination>
	</div>
</template>

<script>
	import qs from "qs"
	import {
		ElMessage
	} from 'element-plus'
	export default {
		methods: {
			addShift(row) {
				const _this = this
				this.form43.shiftHandler= this.$store.state.userInfo.userName;
				this.axios.post("http://localhost:8089/tsm/addShift", this.form43, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				}).then(function(response) {
					
					if(response.data.code==200){
						ElMessage.success({
							message: response.data.data,
							type: 'success'
						});
					}else if(response.data.code==600){
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});
						_this.$router.push({path: '/login'})
					}else if(response.data.code=='601'){
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});
					}else {
						ElMessage.error({
							message: response.data.message,
							type: 'success'
						});
					}
					//console.log(response)
					//_this.dialogFormVisible42 = false
				}).catch(function(error) {
					console.log(error)
				})

			},
			updateLearningstate8(row) {

				const _this = this
				this.form43.oldclass = row.classesVo.classesName
				this.form43.courserecorddetailsId=row.courserecorddetailsId
				console.log(this.form43.oldclasses)
				this.$confirm('此操作将会将提交停课申请, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					
					



					_this.axios.put("http://localhost:8089/tsm/updateLearningstate8", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(response) {
							//_this.form43 = row

						})
						.catch(function(error) {
							console.log(error)
						})
						
						_this.dialogFormVisible42 = true
						
						this.form43.shiftHandler = this.$store.state.userInfo.userName

				}).catch(() => {
					this.$message({
						type: 'error',
						message: '取消操作!'
					})
			})
	},
	addBack(row) {
			const _this = this
			this.form33.addname = this.$store.state.userInfo.userName;
			console.log("_____________++++++++++++")
			console.log(_this.form33)
			this.axios.post("http://localhost:8089/tsm/addBack", this.form33, {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.dialogFormVisible32 = false
			}).catch(function(error) {
				console.log(error)
			})

		},
		updateLearningstate7(row) {
			const _this = this

			this.$confirm('此操作将会将提交停课申请, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {

				_this.axios.put("http://localhost:8089/tsm/updateLearningstate7", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(function(response) {
						_this.form33 = row
						_this.dialogFormVisible32 = true
					})
					.catch(function(error) {
						console.log(error)
					})
			}).catch(() => {
				this.$message({
					type: 'error',
					message: '取消操作!'
				});
			});
		},

		addDrop(row) {
			const _this = this
			console.log("_____________++++++++++++")
			console.log(_this.form13)
			this.form13.addname = this.$store.state.userInfo.userName;
			this.axios.post("http://localhost:8089/tsm/addDrop", this.form13, {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.dialogFormVisible12 = false
			}).catch(function(error) {
				console.log(error)
			})
		},
		// .then(function(response) {
		// _this.axios.put("http://localhost:8089/tsm/updateLearningstateE", row, {
		// 		headers: {
		// 			'content-type': 'application/json',
		// 			'jwtAuth': _this.$store.getters.token
		// 		}
		// 	})

		// }),
		// .then(function(response) {
		// this.axios.get("http://localhost:8089/tsm/selectAllCourseRecorddetailss?studentId=" + row
		// 			.studentId, {
		// 				headers: {
		// 					'content-type': 'application/json',
		// 					'jwtAuth': _this.$store.getters.token
		// 				}
		// 			})
		// 			})
		// 		.then(function(response) {
		// 			for (var key in response.data) {
		// 				console.log(key + ":")
		// 				console.log(response.data[key])

		// 				for (var i = 0; i < response.data[key].length; i++) {
		// 					_this.CourseRecorddetailsData2.push(response.data[key][i])
		// 				}
		// 			}
		// 			console.log(response.data)
		// 		})
		// 		
		updateLearningstate5(row) {
			const _this = this

			this.$confirm('此操作将会将提交退学申请, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {

				_this.axios.put("http://localhost:8089/tsm/updateLearningstateE", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(function(response) {
						_this.form13 = row
						_this.dialogFormVisible12 = true
					})
					.catch(function(error) {
						console.log(error)
					})
			}).catch(() => {
				this.$message({
					type: 'error',
					message: '取消操作!'
				});
			});
		},
		addSuspend(row) {
			const _this = this
			console.log("_____________++++++++++++")
			console.log(_this.form23)
			this.axios.post("http://localhost:8089/tsm/addSuspend", this.form23, {
				headers: {
					'content-type': 'application/json',
					'jwtAuth': _this.$store.getters.token
				}
			}).then(function(response) {
				console.log(response)
				_this.dialogFormVisible22 = false
			}).catch(function(error) {
				console.log(error)
			})

		},
		updateLearningstate3(row) {
			const _this = this

			this.$confirm('此操作将会将提交停课申请, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {

				_this.axios.put("http://localhost:8089/tsm/updateLearningstate3", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(function(response) {
						_this.form23 = row
						_this.dialogFormVisible22 = true
					})
					.catch(function(error) {
						console.log(error)
					})
			}).catch(() => {
				this.$message({
					type: 'error',
					message: '取消操作!'
				});
			});
		},
		handleSizeChange(pagesize) {
			var _this = this
			this.pageInfo1.pagesize = pagesize
			var ps = qs.stringify(this.pageInfo1)
			console.log(ps)
			this.axios.get("http://localhost:8089/tsm/selectAllpage", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				})
				.then(function(response) {
					console.log(response.data)
					_this.StudentData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})
		},
		handleCurrentChange(currentPage) {
			var _this = this
			this.pageInfo1.currentPage = currentPage
			var ps = qs.stringify(this.pageInfo1) // eslint-disable-line no-unused-vars
			this.axios.get("http://localhost:8089/tsm/selectAllpage", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1
				})
				.then(function(response) {
					_this.StudentData = response.data.list
				}).catch(function(error) {
					console.log(error)
				})
		},

		addClassesId(row) {
			const _this = this
			console.log("_____________________________________SSSS")
			console.log(this.form11.classesId)
			console.log(this.form11.courserecorddetailsId)
			this.axios.delete("http://localhost:8089/tsm/updateclassesId", {
					params: {
						"courserecorddetailsId": this.form11.courserecorddetailsId,
						"classesId": this.form11.classesId
					},
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.axios.put("http://localhost:8089/tsm/updateLearningstate2", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}).then(function(response) {
						_this.CourseRecorddetailsData2 = response.data
						_this.dialogFormVisible11 = false
					}).catch(function(error) {
						console.log(error)
					})
				}).catch(function(error) {
					console.log(error)
				})
		},
		//新增预报
		addSource() {
			const _this = this
			this.courserecord.studentId = this.form.studentId
			this.courserecord.addname = this.$store.state.userInfo.userName; //获取当前登记人员名称
			this.axios.post("http://localhost:8089/tsm/addcourserecord", this.courserecord, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) { // eslint-disable-line no-unused-vars
					var c = response.data.data
					console.log(c.courserecordId)
					_this.courserecordId = c.courserecordId
					_this.CourserecorddetailsData.forEach((item) => {
						//遍历courserecordId这个字段，并累加
						console.log(_this.courserecordId);
						item.courserecordId = _this.courserecordId
					})
					_this.axios.post("http://localhost:8089/tsm/addcourserecorddetails", _this
						.CourserecorddetailsData, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						}).then(function(response) { // eslint-disable-line no-unused-vars
						_this.refund.courseId = _this.form2.course.courseId
						console.log(_this.form2.course.courseId)
						_this.refund.registerId = _this.form.registerId
						console.log(_this.form.registerId)
						_this.refund.addname = _this.$store.state.userInfo.userName;
						_this.axios.post("http://localhost:8089/tsm/addentryfees", _this.refund, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						_this.dialogFormVisible3 = false
					}).catch(function(error) {
						console.log(error)
					})
				}).catch(function(error) {
					console.log(error)
				})
		},
		delCourserecorddetails(row) {
			this.CourserecorddetailsData.splice(this.CourserecorddetailsData.indexOf(row), 1)
		},
		//预报上显
		yubao() {
			var courserecorddetails = {
				course: {
					classhours: 0,
					courseMoney: 0,
					courseName: "",
				},
				remarks: ""
			};
			courserecorddetails.course.classhours = this.form2.course.classhours
			courserecorddetails.course.courseMoney = this.form2.course.courseMoney
			courserecorddetails.course.courseName = this.form2.course.courseName
			courserecorddetails.remarks = this.form2.course.remarks
			courserecorddetails.courseId = this.form2.course.courseId
			this.CourserecorddetailsData.push(courserecorddetails)


			refund.courseId = this.form2.course.courseId
			this.refunData.push(refund);

		},
		//?
		cha2(index) {
			this.form2.course.courseMoney = this.CourseData[index].courseMoney
			this.form2.course.classhours = this.CourseData[index].classhours
			this.form2.course.courseName = this.CourseData[index].courseName
			this.form2.course.courseId = this.CourseData[index].courseId
		},
		cha1() {
			var _this = this
			this.axios.get("http://localhost:8089/tsm/selcoursebyclasstypeid?classtypeid=" +
					this.form2.classtype.classtypeId, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}
				)
				.then(function(response) {
					_this.CourseData = response.data

				}).catch(function(error) {
					console.log(error)
				})
		},
		cha11(row) {
			var _this = this
			_this.form11.classesId = row.classesId
			_this.form11.courserecorddetailsId = row.courserecorddetailsId
			this.dialogFormVisible11 = true
			this.axios.get("http://localhost:8089/tsm/selClasses2?courseId=" +
					row.courseId, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					}
				)
				.then(function(response) {
					_this.ClassesData = response.data
					_this.form11.empId = _this.ClassesData[0].empId
					_this.form11.teacherId = _this.ClassesData[0].teacherId
					_this.form11.classesSize = _this.ClassesData[0].classesSize
					_this.form11.classesId = _this.ClassesData[0].classesId
					_this.form11.courseName = _this.ClassesData[0].course.courseName
				}).catch(function(error) {
					console.log(error)
				})

		},
		cha12(index) {
			console.log(index)
			const fo = {
				classesSize: 0,
				classesId: 0,
				courseName: ""
			}
			fo.classesSize = this.ClassesData[index].classesSize
			fo.classesId = this.ClassesData[index].classesId
			fo.courseName = this.ClassesData[index].course.courseName
			this.form11 = fo
		},
		close() {
			for (var key in this.form) {
				delete this.form[key];
			}
			this.dialogFormVisible = false
			this.dialogFormVisible2 = false
			this.dialogFormVisible3 = false
			this.dialogFormVisible10 = false
			this.dialogFormVisible11 = false
			this.dialogFormVisible12 = false
		},
		close2() {
			for (var key in this.CourseRecorddetailsData2) {
				delete this.CourseRecorddetailsData2[key];
			}
			this.dialogFormVisible10 = false
		},
		Allclose() {
			for (var key in this.form) {
				delete this.form[key];
			}
		},
		//修改
		showEdit(row) {
			this.form.studentId = row.studentId
			this.form.studentName = row.studentName
			this.form.studentPhone = row.studentPhone
			this.form.parentname = row.parentname
			this.form.parentphone = row.parentphone
			this.form.sex = row.sex
			this.form.entrance = row.entrance
			this.form.Entrance = row.Entrance
			this.form.address = row.address
			this.form.source = row.source
			this.form.Address = row.Address
			this.dialogFormVisible2 = true
		},
		//补报
		showEdit2(row) {
			this.form.registerId = row.register.registerId //新增报课获取咨询id
			this.form.studentId = row.studentId
			this.form.studentName = row.studentName
			this.dialogFormVisible3 = true
		},

		selectAllCourseRecorddetails(row) {
			this.showEdit10(row)
			const _this = this
			this.axios.get("http://localhost:8089/tsm/selectAllCourseRecorddetailss?studentId=" + row
					.studentId, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
				.then(function(response) {
					for (var key in response.data) {
						console.log(key + ":")
						console.log(response.data[key])

						for (var i = 0; i < response.data[key].length; i++) {
							_this.CourseRecorddetailsData2.push(response.data[key][i])
						}
					}

					console.log(response.data)
				}).catch(function(error) {
					console.log(error)
				})

		},


		//学员详情
		showEdit10(row) {
			this.form.studentId = row.studentId
			this.form.studentName = row.studentName
			this.form.studentPhone = row.studentPhone
			this.form.parentname = row.parentname
			this.form.parentphone = row.parentphone
			this.form.sex = row.sex
			this.form.entrance = row.entrance
			this.form.Entrance = row.Entrance
			this.form.address = row.address
			this.form.source = row.source
			this.form.Address = row.Address
			this.dialogFormVisible10 = true


		},
		add() {
			const _this = this

			this.axios.post("http://localhost:8089/tsm/addstudent", this.form, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) { // eslint-disable-line no-unused-vars
					_this.axios.get("http://localhost:8089/tsm/selbystudentName", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo
						})
						.then(function(response) {
							_this.StudentData = response.data.list
							_this.pageInfo.total = response.data.total
						}).catch(function(error) {
							console.log(error)
						})
					_this.dialogFormVisible = false
					for (var key in _this.form) {
						delete _this.form[key];
					}
				}).catch(function(error) {
					console.log(error)
				})
		},
		update() {
			const _this = this
			this.axios.put("http://localhost:8089/tsm/updatestudent", this.form, {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) { // eslint-disable-line no-unused-vars
					_this.axios.get("http://localhost:8089/tsm/selbystudentName", {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							},
							params: _this.pageInfo
						})
						.then(function(response) {
							_this.StudentData = response.data.list
							_this.pageInfo.total = response.data.total
							//console.log(_this.EnterpriseData[0])
						}).catch(function(error) {
							console.log(error)
						})
					_this.dialogFormVisible2 = false
				}).catch(function(error) {
					console.log(error)
				})
		}

	},
	created() {

			const _this = this
			_this.person = _this.$store.state.userInfo.userName
			this.axios.get("http://localhost:8089/tsm/selbystudentName", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					},
					params: this.pageInfo1

				})
				.then(function(response) {
					_this.StudentData = response.data.list
					_this.pageInfo1.total = response.data.total
				}).catch(function(error) {
					console.log(error)
				})

			this.axios.get("http://localhost:8089/tsm/selectClasstypes", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.ClasstypesData = response.data
				}).catch(function(error) {
					console.log(error)
				})
			this.axios.get("http://localhost:8089/tsm/WJselAllclasses", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {

					_this.ClassesData = response.data
					console.log("--------------------------------")
					console.log(_this.ClassesData)
				}).catch(function(error) {
					console.log(error)
				})
			// this.axios.get("http://localhost:8089/tsm/selectAllCourseRecorddetails")
			// 	.then(function(response) {
			// 		_this.CourseRecorddetailsData2 = response.data
			// 	}).catch(function(error) {
			// 		console.log(error)
			// 	})
			this.axios.get("http://localhost:8089/tsm/selectAllwjSources", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.SourceData = response.data
				}).catch(function(error) {
					console.log(error)
				})

		},
		data() {
			return {
				//补报信息
				form2: {
					classtype: {},
					course: {}
				},
				form11: {
					classesId: ""
				},
				form13: {
					addname: ""
				},
				form23: {
					addname: ""
				},
				form33: {
					addname: ""
				},
				form43: {
					classesId: '',
					addname: ""
				},
				person: "",
				dialogFormVisible: false,
				dialogFormVisible2: false,
				dialogFormVisible3: false,
				dialogFormVisible10: false,
				dialogFormVisible11: false,
				dialogFormVisible12: false,
				dialogFormVisible22: false,
				dialogFormVisible32: false,
				dialogFormVisible42: false,
				StudentData: [],
				SourceData: [],
				CourseData: [],
				ClasstypesData: [],
				ClassesData: [],
				CourseRecorddetailsData: [],
				CourserecorddetailsData: [],
				refunData: [],
				CourseRecorddetailsData2: [],
				//报课总表信息
				courserecord: {
					studentId: 0,
					receipts: 0,
					empId: 1,
					addname: ""
				},
				courserecorddetails: {
					course: {
						classhours: 0,
						courseMoney: 0,
						courseName: "",

					},
					remarks: ""
				},
				//报课
				refund: {
					registerId: '',
					courseId: '',
					addname: ""
				},
				//学生信息
				form: {
					register: '',
					registerId: '',
					courseId: '',
					studentId: 0,
					studentName: "",
					studentPhone: "",
					parentname: "",
					parentphone: "",
					sex: "",
					entrance: "",
					address: "",
					source: {}
				},
				formLabelWidth: '120px',
				pageInfo1: {
					currentPage: 1,
					pagesize: 10,
					total: 0,
					flag: ""
				},
				courserecordId: 0
			}
		},
		computed: {
			receipts: {
				get: function() {
					let sum = 0;
					this.CourserecorddetailsData.forEach((item) => {
						//遍历prodAllPrice这个字段，并累加
						sum += item.course.courseMoney;
					})
					return sum
				},
				set: function(value) {
					this.receipts = value; //最后修改了msg    
				}
			}
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
