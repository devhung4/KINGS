export const toPage = (url) => {
  if (!new RegExp(/^\/pages\//).test(url)) return
  uni.navigateTo({ url })
}
