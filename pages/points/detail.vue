<template>
	<div class="transfer_box">
		<div class="navBox">
			<div class="left back">
				<image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
			</div>
			<div class="center">兑换列表</div>
			<div class="right" @tap="toHistoryPage">歷史兌換</div>
		</div>

		<div class="transfer_center">
			<div v-for="(item, index) in list" :key="index">
				<div class="guo_itm">
					<div class="itm_lef">
						<image src="../../static/black/lv.png" />
						<div>{{ item.name }}</div>
						<span>{{ item.blockchainNetwork }}</span>
					</div>
					<div class="itm_rig">
						<div class="lab1">
							<div class="div1">
								價值：<span>{{ item.valuation }}</span>
							</div>
							<div class="div2">
								{{ setTime(item.expireTime) }} <span>後權益過期</span>
							</div>
						</div>
						<div class="lab2" @click="duihuan()">兌換</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import UQRCode from "uqrcodejs";
	export default {
		components: {},
		data() {
			return {
				list: [],
			};
		},
		props: [],
		mounted() {
			this.task();
		},
		methods: {
			toHistoryPage() {
				uni.navigateTo({
					url: "/pages/points/history"
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1, // 默认值是1，表示返回的页面层数
				});
			},
			async task() {
				let res = await this.$request.post("/zhaotoubao-server/user/getIntegralStore", {
					data: {
						base: {},
						param: {
							offset: 1,
							count: 10,
						},
					},
				});
				if (res.data.base.code == "000000") {
					this.list = res.data.data;
				}
			},

			setTime(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, "0");
				const day = date.getDate().toString().padStart(2, "0");
				const hour = date.getHours().toString().padStart(2, "0");
				const minute = date.getMinutes().toString().padStart(2, "0");
				const second = date.getSeconds().toString().padStart(2, "0");
				return `${hour}:${minute}:${second}`;
			},
			duihuan() {},
		},
	};
</script>

<style scoped lang="scss">
	.transfer_box {
		box-sizing: border-box;
		padding-top: 30px;
		min-height: 100vh;
		background: #000;
	}

	.qrcode {
		display: inline-block;
		width: 140px;
		height: 140px;
		background-color: #fff;
		padding: 6px;
		box-sizing: border-box;
	}

	.navBox {
		color: #fff;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 11px 15px;
		background: #000;

		.left {
			justify-self: start;
		}

		.right {
			justify-self: end;
			color: #8b8b8f;
		}

		.center {
			grid-column: 2;
			text-align: center;
			margin: 0 auto;
			font-weight: bold;
		}

		.back {
			image {
				width: 76rpx;
				height: 76rpx;
				display: block;
			}
		}

		span {
			font-weight: 400;
			font-size: 28rpx;
			color: #f0c473;
			line-height: 38rpx;
		}
	}

	.transfer_box {
		position: relative;

		.transfer_center {
			padding: 0 30rpx 20rpx;

			.guo_itm {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: rgba(31, 32, 41, 0.6);
				border-radius: 27rpx;
				padding: 24rpx 16rpx 32rpx 24rpx;

				.itm_lef {
					display: flex;
					align-items: center;

					image {
						width: 45.8rpx;
						height: 45.8rpx;
						margin-right: 8rpx;
					}

					div {
						margin-right: 18rpx;
						font-weight: bold;
						font-size: 29rpx;
						color: #ffffff;
						line-height: 38rpx;
					}

					span {
						padding: 0 10rpx;
						display: block;
						background: rgba(255, 255, 255, 0.4);
						border-radius: 8rpx;
						font-weight: bold;
						font-size: 21rpx;
						color: #000000;
						line-height: 31rpx;
						text-align: left;
					}
				}

				.itm_rig {
					display: flex;
					align-items: center;

					.lab1 {
						text-align: right;

						.div1 {
							font-weight: 400;
							font-size: 23rpx;
							color: rgba(255, 255, 255, 0.4);
							line-height: 31rpx;

							span {
								color: #fff;
							}
						}

						.div2 {
							margin-top: 5rpx;
							font-weight: 400;
							font-size: 23rpx;
							line-height: 31rpx;
							color: rgba(255, 91, 92, 1);

							span {
								margin-left: 4rpx;
								color: rgba(255, 255, 255, 0.4);
							}
						}
					}

					.lab2 {
						padding: 12rpx 30rpx;
						background: rgba(240, 196, 115, 0.8);
						border-radius: 19rpx;
						font-weight: 400;
						font-size: 27rpx;
						color: #000000;
						line-height: 38rpx;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>