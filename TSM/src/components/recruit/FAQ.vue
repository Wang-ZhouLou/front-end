<template>
	&nbsp;<a style="font-size: 14px;">快速检索 :</a> &nbsp;
	<el-select v-model="value" placeholder="问题" class="el2" size="mini">

		<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
		</el-option>
	</el-select>
	<el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="input2" style="width: 150px;">
	</el-input>
	<div style="margin: -27px 0 0 400px;">
		<el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
		<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" style="width: 110px;"
			@click="dialogFormVisible = true">增加</el-button>
		<el-button type="primary" size="mini" icon="el-icon-delete">删除</el-button>
	</div>

	<div>
		<el-collapse :data="faqData" :key="item.label" v-model="activeNames" @change="handleChange"
			v-for="item in faqData">
			<div>

				<el-collapse-item :title="item.problem" name="1">
					<div>{{item.answer}}</div>
				</el-collapse-item>
			</div>
		</el-collapse>
	</div>
	<el-dialog title="新增FAQ信息" v-model="dialogFormVisible" class="di1">
		<el-form :model="form">
			<el-form-item label="FAQ问题 :" :label-width="formLabelWidth">
				&nbsp;<el-input v-model="form.problem" autocomplete="off" style="width: 530px;"></el-input>
			</el-form-item>
			<el-input v-model="form.answer" autocomplete="off" style="width: 530px; margin: 0 0 0 120px;"
				type="textarea" :rows="9"></el-input>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addFaq">保 存</el-button>
				<el-button @click="dialogFormVisible = false">关 闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				options: [{
					value: '选项1',
					label: '问题'
				}],
				value: '',
				faqData: [],
				checked: false,

				dialogFormVisible: false,
				form: {
					problem: '',
					answer: ''
				},
				formLabelWidth: '120px'

			}

		},
		methods: {
			addFaq() {
				const _this = this
				this.axios.post("http://localhost:8089/tsm/Addfaq", this.form, {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						console.log(response)
						var faqQuestions = response.data
						_this.faqData.push(faqQuestions)
						_this.dialogFormVisible = false
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		created() {
			const _this = this
			this.axios.get("http://localhost:8089/tsm/findAll", {
					headers: {
						'content-type': 'application/json',
						'jwtAuth': _this.$store.getters.token
					}
				})
				.then(function(response) {
					console.log(response)
					_this.faqData = response.data
				}).catch(function(error) {
					console.log(error)
				})

		}
	}
</script>

<style>
	.el2 {
		width: 80px;
	}
</style>
