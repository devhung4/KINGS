export const toPage = (url) => {
  if (!new RegExp(/^\/pages\//).test(url)) return
  uni.navigateTo({ url })
}

export const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length === 0) return
  uni.navigateBack({ delta: 1 })
}
