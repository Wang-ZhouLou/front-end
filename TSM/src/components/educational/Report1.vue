<template>
	<div class="map" style="display: flex; justify-content: space-between;">
		<div ref="chart" style="width: 600px; height: 400px;"></div>
		<div ref="chart1" style="width: 600px; height: 400px;"></div>
	</div>

</template>
<script>
	import * as echarts from 'echarts'
	export default {
		name: "report",
		data() {
			return {
				ConsultationmodeData: [],
				totals: [],
				Consultationmods: []
			}
		},
		methods: {
			initChart(container, option) {
				const myChart = echarts.init(container);
				myChart.setOption(option);
			},
			myEcharts() {

				let option = {
					title: {
						text: '学员咨询方式统计'
					},
					tooltip: {},
					xAxis: {
						data: [this.Consultationmods[0], this.Consultationmods[1], this.Consultationmods[1], ]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [this.totals[0], this.totals[1], this.totals[2]]
					}]
				}
				this.initChart(this.$refs.chart, option);
				let option1 = {
					tooltip: {},
					xAxis: {
						type: 'category',
						data: []
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						data: [this.totals[0], this.totals[1], this.totals[2]],
						type: 'line'
					}]
				}

				this.initChart(this.$refs.chart1, option1)
			},
			sum() {
				const _this = this
				this.axios.get("http://localhost:8089/tsm/ConsultationmodeStatistics", {
						headers: {
							'content-type': 'application/json',
							'jwtAuth': _this.$store.getters.token
						}
					})
					.then(function(response) {
						_this.ConsultationmodeData = response.data.data;
						console.log(response + "==================")
						console.log(response.data.data)
						console.log(_this.ConsultationmodeData);
						_this.ConsultationmodeData.forEach((item) => {
							_this.totals.push(item.total)
							_this.Consultationmods.push(item.Consultationmode)
						})
						console.log(_this.totals)
						console.log(_this.Consultationmods)
						_this.myEcharts()
					}).catch(function(error) {
						console.log(error)
					})
			}
		},
		mounted() {
			this.sum()
		},
		created() {

		}

	};
</script>

<style>

</style>
