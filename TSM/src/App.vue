<template>
		<router-view></router-view>
</template>

<script>
</script>
<style>
	@import "./assets/css/main.css";
	@import "./assets/css/color-dark.css";
	.el-header,
	.el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		text-align: center;
		line-height: 60px;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;


	}

	.el-container {
		margin-bottom: 40px;
		height: 100%;
	}
	.active{
		font-size: 48px;
		background-color: #b4f31f;
	}
	
</style>
