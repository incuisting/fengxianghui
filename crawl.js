let axios = require('axios')
let cheerio = require('cheerio')
let options = {
  headers: {
    Host: 'house.0577home.net',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9'
  }
}
function fetchSinglePage(url) {
  return axios.get(url, {
    ...options
  })
}
function getFloor(text) {
  let execData = /((\d+)\/(\d+))/g.exec(text)
  return execData ? execData[1] : '无信息'
}
function getAddress(text) {
  // console.log(text)
  // console.log(/\[(.+)\]/gm.exec(text))
  let execData = /\[(.+)\]/g.exec(text)
  return execData ? execData[1] : '无信息'
}
function parseHtml(arr) {
  let houseInfo = []
  let $ = cheerio.load(arr)
  let info = $('#housesearchlist li')
  for (let i = 0; i < info.length; i++) {
    let dom = info.eq(i)
    houseInfo.push({
      title: dom.find('.text.text_title a').text(),
      area: dom.find('.number.area').text(),
      houseType: `${dom.find('.number.room').text()}室${dom
        .find('.number.hall')
        .text()}厅${dom.find('.number.toilet').text()}卫`,
      unitPrice: dom.find('.number.price_unit').text(),
      floor: getFloor(
        dom
          .find('.text.text_moreinfo')
          .eq(0)
          .text()
      ),
      address: getAddress(
        dom
          .find('.text.text_moreinfo')
          .eq(1)
          .text()
      ),
      biotope: dom.find('.text.text_moreinfo>.cBlue').text(),
      total: `${dom.find('.price.div_left .number.price.hot_price').text()}万`
    })
  }
  return houseInfo
}
async function init(page) {
  let promiseArray = []
  let data
  for (let i = 1; i <= page; i++) {
    promiseArray.push(
      fetchSinglePage(`https://house.0577home.net/search/page/${i}.html`)
    )
  }
  try {
    let resArray = await Promise.all(promiseArray)
    data = resArray.map(item => {
      return parseHtml(item.data)
    })
  } catch (e) {
    console.log(e)
  }
  console.log('data', data)
  return data
}

init(1)
