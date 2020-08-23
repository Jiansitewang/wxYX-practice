//mpvue默认自带的两个函数
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

//------请求的封装-------
const host = "http://localhost:5656/wak"

function request (url,method,data,header={}){
  wx.showLoading({
    title: "加载中"
  })
  return new Promise((resolve,reject)=>{
    wx.request({
      url: host + url,
      data: data,
      header: {
        "content-type": "application/json"
      },
      success: (res)=>{
        wx.hideLoading()
        resolve(res.data)
      },
      fail(error){
        wx.hideLoading()
        reject(false)
      },
      complete(){
        wx.hideLoading()
      }
    })
  })
}

function get(url,data) {
  return request(url,'GET',data)
}
function post(url,data) {
  return request(url,'POST',data)
}

export {host,request,get,post}
export default {
  formatNumber,
  formatTime, //格式化时间
  request,
  get,
  post
}
