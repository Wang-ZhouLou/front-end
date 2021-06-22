<template>
	<div>
		<div class="db1">
			<font class="ksjs1" style="font-size: 13px;">快速检索:</font>&nbsp;
			<el-input v-model="pageInfo.flag" placeholder="请输入关键字" style="width: 140px;" size="mini">
			</el-input>&nbsp;
			<el-date-picker v-model="value1" size="mini" style="width: 200px;" type="daterange" range-separator="至"
				start-placeholder="开始日期" end-placeholder="结束日期">
			</el-date-picker>&nbsp;
			<el-button style="background-color: #009688;color: white; width: 50px;" size="mini" @click="selall">查询
			</el-button>
			<el-button style="background-color: #5FB878;color: white;width: 50px;" type="text" size="mini"
				@click="dialogFormVisible = true">增加
			</el-button>
			<el-button style="background-color: #FF5722;color: white; width: 50px;" size="mini" type="text"
				@click="del()">删除
			</el-button>

			<el-dialog title="新增咨询登记信息" v-model="dialogFormVisible">
				<el-form :model="form">
					<el-form-item>
						<div style="margin: 0 0 0 45px;">
							接待人: <el-select v-model="form.empVo" style="margin-right: 142px; width: 190px;">
								<el-option v-for="items in empData" :key="items.empId" :label="items.empName"
									:value="items"></el-option>
							</el-select>
							咨询方式: <el-select style="width: 190px;" v-model="form.returnvisitId">
								<el-option v-for="items in returnvisitdate" :key="items.returnvisitId"
									:label="items.returnvisitmode" :value="items.returnvisitId"></el-option>
							</el-select>
						</div>
						<div style="margin: 16px 0 0 30px;">
							信息渠道: <el-select v-model="form.sourceId" style="margin-right: 160px; width: 190px;">
								<el-option v-for="items in sourceData" :key="items.sourceId" :label="items.sourceName"
									:value="items.sourceId"></el-option>
							</el-select>
							咨询人: <el-input v-model="form.consultant" style="width: 190px;margin-bottom: 10px;">
							</el-input>
						</div>
						<div style="margin: 9px 0 0 30px;">
							咨询课程: <el-select v-model="form.courseId" style="margin-right: 142px;">
								<el-option v-for="items in courseData" :key="items.courseId" :label="items.courseName"
									:value="items.courseId"></el-option>
							</el-select>
							联系电话: <el-input v-model="form.phone" style="width: 190px;"></el-input>
						</div>
						<div style="margin: 16px 0 0 57px ;">
							性别: &nbsp; <el-radio v-model="form.sex" default label="男">男</el-radio>
							<el-radio v-model="form.sex" label="女" style="margin-right: 195px;">女</el-radio>
						</div>
						<div style="margin: 0 0 0 34px;">咨询内容:<el-input style="margin-bottom: 10px;" type="textarea"
								:rows="2" placeholder="请输入内容" v-model="form.consultcontent">
							</el-input>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close()">关闭</el-button>
						<el-button type="primary" @click="addregister">保 存</el-button>
					</span>
				</template>
			</el-dialog>

			<el-dialog title="修改咨询登记信息" v-model="dialogFormVisible2">
				<el-form :model="form">
					<el-form-item>
						<div style="margin: 0 0 0 45px;">
							接待人: <el-select v-model="form.empVo" style="margin-right: 142px; width: 190px;">
								<el-option v-for="items in empData" :key="items.empId" :label="items.empName"
									:value="items"></el-option>
							</el-select>
							咨询方式: <el-select style="width: 190px;" v-model="form.returnvisitId">
								<el-option v-for="items in returnvisitdate" :key="items.returnvisitId"
									:label="items.returnvisitmode" :value="items.returnvisitId"></el-option>
							</el-select>
						</div>
						<div style="margin: 16px 0 0 30px;">
							生源渠道: <el-select v-model="form.sourceId" style="margin-right: 160px; width: 190px;">
								<el-option v-for="items in sourceData" :key="items.sourceId" :label="items.sourceName"
									:value="items.sourceId"></el-option>
							</el-select>
							咨询人: <el-input v-model="form.consultant" style="width: 190px;margin-bottom: 10px;">
							</el-input>
						</div>
						<div style="margin: 9px 0 0 30px;">
							咨询课程: <el-select v-model="form.courseId" style="margin-right: 142px;">
								<el-option v-for="items in courseData" :key="items.courseId" :label="items.courseName"
									:value="items.courseId"></el-option>
							</el-select>
							联系电话: <el-input v-model="form.phone" style="width: 190px;"></el-input>
						</div>
						<div style="margin: 16px 0 0 30px ;">
							咨询日期: <el-input v-model="form.addtime" disabled style="width: 190px;margin-right: 175px;">
							</el-input>
							性别: &nbsp; <el-radio v-model="form.sex" default label="男">男</el-radio>
							<el-radio v-model="form.sex" label="女">女</el-radio>
						</div>
						<div style="margin: 0 0 0 34px;">咨询内容:<el-input style="margin-bottom: 10px;" type="textarea"
								:rows="2" placeholder="请输入内容" v-model="form.consultcontent">
							</el-input>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close()">关闭</el-button>
						<el-button type="primary" @click="updregister">保 存</el-button>
					</span>
				</template>
			</el-dialog>




			<el-dialog title="客户回访" v-model="dialogFormVisible3">
				<el-form :model="form1">
					<el-form-item>
						<div style="margin: -40px 0 0 45px;">
							<font style="font-size: 13px;">接待人: </font>
							<el-input v-model="form1.empVo.empName" disabled style="width: 190px;margin-right: 144px;"
								size=mini>
							</el-input>
							<font style="font-size: 13px;">联系电话: </font>
							<el-input v-model="form1.phone" style="width: 190px;" disabled size=mini></el-input>
						</div>
						<div style="margin: 0 0 0 30px;">
							<font style="font-size: 13px;">生源渠道: </font>
							<el-input v-model="form1.sourceVo.sourceName" disabled
								style="width: 190px;margin-right: 158px;" size=mini>
							</el-input>
							<font style="font-size: 13px;">咨询人: </font>
							<el-input v-model="form1.consultant" disabled style="width: 190px;margin-bottom: 10px;"
								size=mini>
							</el-input>
						</div>
						<div style="margin: 0 0 0 30px;">
							<font style="font-size: 13px;">咨询课程: </font>
							<el-input v-model="form1.courseVo.courseName" disabled style="width: 190px;" size=mini>
							</el-input>
							<font style="font-size: 13px; margin-left: 170px;">性别: </font>
							<el-input v-model="form1.sex" style="width: 190px;" disabled size=mini></el-input>
						</div>
						<div style="margin: 0 0 0 30px ;">
							<font style="font-size: 13px;">咨询日期: </font>
							<el-input size=mini v-model="form1.addtime" disabled
								style="width: 190px;margin-right: 145px;">
							</el-input>
							<font style="font-size: 13px;">咨询内容: </font>
							<el-input size=mini style="margin-bottom: 10px; width:190px;" disabled placeholder="请输入内容"
								v-model="form1.consultcontent">
							</el-input>
						</div>
						<div style="margin: 0 0 0 30px ;">
							<font style="font-size: 13px;">回访次数: {{num}}</font>
						</div>

						<div>
							<font>回访登记</font>
							<el-button style="background-color: #FF5722;color: white; width: 50px; margin-left: 610px;"
								size="mini" type="text" @click="de2()">删除
							</el-button>
							<el-table :data="returnvisitdate" border style="width: 100%" size=mini
								@selection-change="handleSelectionChange2" ref="multipleTable2">
								<el-table-column type="selection" width="55" align="center">
								</el-table-column>
								<el-table-column prop="returnvisitId" label="编号" width="50" align="center">
								</el-table-column>
								<el-table-column prop="returnvisitdate" label="回访日期" width="100" align="center">
								</el-table-column>
								<el-table-column prop="returnvisitmode" label="回访方式" width="100" align="center">
								</el-table-column>
								<el-table-column prop="empVo.empId" label="回访人" width="80" align="center">
								</el-table-column>
								<el-table-column prop="returnvisitback" label="回访反馈" align="center">
								</el-table-column>
							</el-table>
							<!-- 新增 -->
							<div>
								<font style="font-size: 13px;margin-left: 34px;">回访方式: &nbsp; </font>
								<el-radio v-model="form1.returnvisitmode" default label="电话咨询">电话咨询</el-radio>
								<el-radio v-model="form1.returnvisitmode" label="QQ微信回访">QQ微信回访</el-radio>
								<font style="font-size: 13px;margin-left: 70px;">回访反馈: </font>
								<el-input v-model="form1.returncontent" style="width: 190px;" size=mini></el-input><br>
								<font style="font-size: 13px;margin-left: 34px;">回访内容: </font>
								<el-input size=mini style="margin-bottom: 10px; width: 566px;" placeholder="请输入内容"
									v-model="form1.returnvisitback">
								</el-input>
								<el-button @click="addreturnvisits" size=mini>保存</el-button>
							</div>
						</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="close1()">关闭</el-button>
						<el-button type="primary" @click="addreturnvisits">保 存</el-button>
					</span>
				</template>
			</el-dialog>


		</div>&nbsp;
		<div class="zxdj">
			<el-table :data="registerData" border style="width: 100%" @selection-change="handleSelectionChange"
				ref="multipleTable">
				<!-- ref 被用来给元素或子组件注册引用信息 引用信息将会注册在父组件的$refs对象上-->
				<el-table-column type="selection" width="55" align="center">
				</el-table-column>
				<el-table-column prop="registerId" label="编号" width="50" align="center">
				</el-table-column>
				<el-table-column prop="addtime" label="咨询日期" width="100" align="center">
				</el-table-column>
				<el-table-column prop="consultant" label="咨询人" width="80" align="center">
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="60" align="center">
				</el-table-column>
				<el-table-column prop="consultcontent" label="咨询内容" width="150" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="联系电话" width="110" align="center">
				</el-table-column>
				<el-table-column prop="courseVo.courseName" label="咨询课程" width="80" align="center">
				</el-table-column>
				<el-table-column prop="sourceVo.sourceName" label="生源渠道" width="90" align="center">
				</el-table-column>
				<el-table-column prop="empVo.empName" label="接待人" width="100" align="center">
				</el-table-column>
				<el-table-column prop="attentstate" label="状态" width="50" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.attentstate==0||slot.row.attentstate==1"><i class="el-icon-user-solid"></i>
						</p>
						<p v-if="slot.row.attentstate==2"><i class="el-icon-check"></i></p>
					</template>
				</el-table-column>
				<el-table-column prop="paystate" label="缴费状态" width="100" align="center">
					<template v-slot="slot">
						<p v-if="slot.row.paystate==0">未缴费</p>
						<p v-if="slot.row.paystate==1">待缴费</p>
						<p v-if="slot.row.paystate==2">已缴费</p>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template #default="scope">
						<el-button @click="showEdit(scope.row)" type="text" size="small">编辑</el-button>
						<el-button type="text" size="small" @click="huif(scope.row)">回访</el-button>
						<el-button type="text" size="small" @click="upPayState(scope.row)">审核通过</el-button>
						<el-button type="text" size="small" @click="deleteregister(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
	<!-- 分页 -->
	<div class="block" style="display: flex;justify-content: center;margin-top: 10px;">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="pageInfo.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pageInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>
	</div>

</template>

<script>
	import {
		ref
	} from 'vue'
	import qs from 'qs'
	import {
		ElMessage
	} from 'element-plus'
	export default {
		computed: {
			num: function() {
				return this.returnvisitdate.length
			}
		},
		methods: {
			//回访记录的删除
			//全选复选框
			SAll2() {
				this.$refs.multipleTable2.toggleAllSelection();
			},
			//取消选中的复选框
			NSel2() {
				this.$refs.multipleTable2.clearSelection();
			},
			//批量删除按钮
			de2() {
				console.log(this.multipleSelection.length)
				if (this.multipleSelection.length === 0) {
					this.deld(); //调用请选择要删除的内容
				} else {
					this.multipleSelection.forEach(item => {
						this.delete2(item)
					});
					this.dels();
				}
			},
			//总复选框的全选和取消全选
			handleSelectionChange2(val) {
				this.multipleSelection = val;
			},
			//批量删除
			delete2(row) {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/dereturnvisit", row)
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/Wjxsreturnvisit?registerId=" + row.registerId)
							.then(function(response) {
								_this.returnvisitdate = response.data
								console.log(response)
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			//回访传咨询登记的id到后台,并根据id显示回访记录
			huif(row) {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/Wjxsreturnvisit?registerId=" + row.registerId)
					.then(function(response) {
						_this.returnvisitdate = response.data
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
				this.form1.registerId = row.registerId
				this.form1.empId = row.empId
				this.hfxs(row)
			},
			//回访按钮显示
			hfxs(row) {
				const _this = this
				if (row.attentstate == 0 || row.attentstate == 1) {
					this.form1.empName = row.empName
					this.form1.empVo = row.empVo
					this.form1.sourceVo = row.sourceVo
					this.form1.detailcourseId = row.detailcourseId
					this.form1.courseVo = row.courseVo
					this.form1.phone = row.phone
					this.form1.consultant = row.consultant
					this.form1.sex = row.sex
					this.form1.consultcontent = row.consultcontent
					this.form1.addtime = row.addtime
					this.form1.returnvisitVo = row.returnvisitVo

					this.axios.get("http://localhost:8089/tsm/selectAllwjSources")
						.then(function(response) {
							_this.sourceData = response.data
							console.log(response)
						}).catch(function(error) {
							console.log(error)
						})
					this.dialogFormVisible3 = true
				} else {
					this.open2()
				}
			},

			/* 回访表新增 */
			addreturnvisits() {
				const _this = this
				//this.form1.empId = this.form1.empVo.empId
				this.axios.post("http://localhost:8089/tsm/addreturnvisit", this.form1)
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/Wjselectreturnvisit")
							.then(function(response) {
								_this.returnvisitdate = response.data
							}).catch(function(error) {
								console.log(error)
							}),
							_this.dialogFormVisible3 = false
						for (var key in _this.form1) {
							delete _this.form1[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			close1() {
				var _this = this
				for (var key in _this.form1) {
					delete _this.form1[key];
				}
				_this.dialogFormVisible3 = false
			},
			open2() {
				ElMessage({
					showClose: true,
					message: '该客户已成功转为正式学员，无需再回访！',
					type: 'success'
				});
			},
			//咨询登记模糊查询
			selall() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.registerData = response.data.list
						_this.pageInfo.total = response.data.total
						console.log(response)
					}).catch(function(error) {
						console.log(error)
					})
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
			del() {
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
			//批量删除
			delete1(row) {
				const _this = this
				this.axios.put("http://localhost:8089/tsm/deleteRegister", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.registerData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					}).catch(function(error) {
						console.log(error)
					})
			},
			//单个删除
			deleteregister(row) {
				const _this = this
				var flag = true // eslint-disable-line no-unused-vars
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row);
					_this.axios.put("http://localhost:8089/tsm/deleteRegister", row, {
							headers: {
								'content-type': 'application/json',
								'jwtAuth': _this.$store.getters.token
							}
						})
						.then(function(response) {
							console.log(response)
							var rows = _this.registerData
								.filter(d => d.sourceId != row.sourceId)
							_this.registerData = rows
							_this.pageInfo.total = _this.pageInfo.total - 1
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
			//修改缴费状态
			upPayState(row) {
				const _this = this
				row.paystate = 1
				this.axios.put("http://localhost:8089/tsm/upPayState", row, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.registerData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
					})
				this.form2.registerId = row.registerId
				this.form2.courseId = row.courseId
				this.form2.course = row.course //新增一条报班缴费数据
				this.axios.post("http://localhost:8089/tsm/addentryfees", this.form2, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						console.log(response)
						for (var key in _this.form2) {
							delete _this.form2[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			//修改
			updregister() {
				const _this = this
				this.form.empId = this.form.empVo.empId
				this.axios.put("http://localhost:8089/tsm/updateregister", this.form)
					.then(function(response) { // eslint-disable-line no-unused-vars
						_this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.registerData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						_this.dialogFormVisible2 = false
						for (var key in _this.form) {
							delete _this.form[key];
						}
					}).catch(function(error) {
						console.log(error)
					})
			},
			showEdit(row) { //自动获取值并填入到form表单中
				this.form.registerId = row.registerId
				this.form.sourceId = row.sourceId
				this.form.detailcourseId = row.detailcourseId
				this.form.courseId = row.courseId
				this.form.phone = row.phone
				this.form.consultant = row.consultant
				this.form.sex = row.sex
				this.form.consultcontent = row.consultcontent
				this.form.addtime = row.addtime
				this.form.empVo = row.empVo
				this.form.returnvisitdate = row.returnvisitdate
				this.dialogFormVisible2 = true
			},
			//新增咨询登记
			addregister() {
				const _this = this
				this.form.empId = this.form.empVo.empId
				this.axios.post("http://localhost:8089/tsm/addregister", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) { // eslint-disable-line no-unused-vars
						console.log(response)
						_this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
								params: _this.pageInfo,
								headers: {
									'content-type': 'application/json',
									'jwtAuth': _this.$store.getters.token
								}
							})
							.then(function(response) {
								_this.registerData = response.data.list
								_this.pageInfo.total = response.data.total
							}).catch(function(error) {
								console.log(error)
							})
						for (var key in _this.form) {
							delete _this.form[key];
						}
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			},
			close() {
				var _this = this
				for (var key in _this.form) {
					delete _this.form[key];
				}
				_this.dialogFormVisible = false
				_this.dialogFormVisible2 = false
			},
			//分页大小
			handleSizeChange(pagesize) {
				var _this = this
				this.pageInfo.pagesize = pagesize
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				console.log(ps) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response.data)
						_this.registerData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			//当前页数
			handleCurrentChange(currentPage) {
				var _this = this
				this.pageInfo.currentPage = currentPage
				var ps = qs.stringify(this.pageInfo) // eslint-disable-line no-unused-vars
				this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
						params: this.pageInfo,
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.registerData = response.data.list
					}).catch(function(error) {
						console.log(error)
					})
			},
			open() {
				this.$confirm('确定要执行删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
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
				pageInfo: {
					currentPage: 1, //当前页数，由用户指定
					pagesize: 3, //每页显示的条数
					total: 0, //总记录条数，数据库查出来的
					flag: ""
				},
				textarea: ref(''),
				dialogFormVisible: false,
				dialogFormVisible2: false,
				dialogFormVisible3: false,
				form: {
					paystate: '',
					sex: '',
					region: '',
					phone: '',
					consultant: '',
					registerId: '',
					type: [],
					courseVo: {},
					returnvisitVo: {},
					/* 					returnvisitId: {}, */
					empVo: {}, //外键用数组来包含实体类里面所有字段
					source: [],
					consultcontent: '',
					detailcourseId: ''
				},
				form1: { //回访
					empVo: {},
					emp: {},
					courseVo: {},
					returnvisitVo: {},
					consultant: '',
					returnvisitback: '',
					returnvisitmode: '',
					addname: 'admin',
					phone: '',
					source: [],
				},
				form2: {
					receipts: '',
					registerId: '',
					courseId: '',
					entryfeesVo: {},
					course: '',
				},
				input: ref(''),
				value: '',
				registerData: [],
				sourceData: [],
				courseData: [],
				returnvisitdate: [],
				empData: [],
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
				value1: ''
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/wjselectAllEmp")
				.then(function(response) {
					_this.empData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/Wjselectreturnvisit")
				.then(function(response) {
					_this.returnvisitdate = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/selectAllwjSources")
				.then(function(response) {
					_this.sourceData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/WJselAllcourse")
				.then(function(response) {
					console.log(response.data)
					_this.courseData = response.data
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				}),
				this.axios.get("http://localhost:8089/tsm/selectregisterAll", {
					params: this.pageInfo,
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					_this.registerData = response.data.list
					_this.pageInfo.total = response.data.total
					console.log(response)
				}).catch(function(error) {
					console.log(error)
				})
		}
	}
</script>

<style>
</style>
