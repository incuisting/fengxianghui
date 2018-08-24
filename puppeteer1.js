let puppeteer = require('puppeteer')
let account = '13958898709@163.com'
let password = '123aa456bb'
;(async () => {
  const browser = await puppeteer.launch({ headless: false }) //打开浏览器
  const page = await browser.newPage() //打开一个空白页
  await page.goto('https://accounts.douban.com/login') //打开豆瓣网站
  await page.type('#email', account, { delay: 100 })
  await page.screenshot({ path: 'email.png' }) //截个图
  await page.type('#password', password, { delay: 100 })
  await page.screenshot({ path: 'password.png' }) //截个图
  await page.click('.btn-submit')
  await page.waitForNavigation({
    waitUntil: 'networkidle2'
  }) //等待页面加载出来，等同于window.onload
  await page.screenshot({ path: 'welcome.png' }) //截个图
  await browser.close() //关掉浏览器
})()
