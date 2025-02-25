module.exports = {
	devServer:{
		// port:'8080',
		// disableHostCheck:true,
		proxy:{
			'/zhaotoubao-server':{
				target:'https://api.8.top',
				changeOrigin:true,
				secure:false,
				pathRewrite: { // 重写路径
					'^/zhaotoubao-server': '/zhaotoubao-server'
				},
			}
		}
	}
}