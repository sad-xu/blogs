const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let width, height

// 背景色 r g b
const BG = [238, 238, 238]

// 角度列表
const numAngles = 6
let angles = Array.from({length: numAngles}).map((v, i) => {
  return Math.PI * 2 / numAngles * i - Math.PI / 2
})

let travelers = []

const CONFIG = {
  speed: 2, // 速度
  chanceToSplit: 0.1, // 分裂率 密度
  num: 10,  // 同时存在数
  max: 1000, // 最大存在数
  fade: 0 // 消失透明度
}

function init() {
  canvas.width = width = window.innerWidth
  canvas.height = height = window.innerHeight
  
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.fillStyle = `rgba(${BG[0]},${BG[1]},${BG[2]},1)`
  ctx.fill()
}

function animate() {
  if (CONFIG.fade > 0) {
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.fillStyle = `rgba(${BG[0]},${BG[1]},${BG[2]},${CONFIG.fade / 10})`
    ctx.fill()
  }
  for (let i = 0; i < travelers.length; i++) {
    let traveler = travelers[i]
    if (traveler.update()) {
      traveler.draw()
    } else {
      travelers.splice(i, 1)
      i--
      delete traveler
    }
  }

  if (travelers.length < CONFIG.num) {
    addTraveler(Math.random() * width, Math.random() * height)
  }

  window.requestAnimationFrame(animate)
}

function addTraveler(x, y){
  let a = angles[Math.floor(Math.random() * angles.length)]
  let vx = Math.cos(a) * CONFIG.speed
  let vy = Math.sin(a) * CONFIG.speed
  travelers.push(new Traveler(x, y, vx, vy))
}

function Traveler(x, y, vx, vy) {
  // 起点
  this.x = x
  this.y = y
  // 终点
  this.x1 = x
  this.y1 = y
  // 变化值
  this.vx = vx
  this.vy = vy
  // this.active = true
}

Traveler.prototype.ctx = ctx

Traveler.prototype.draw = function() {
  const ctx = this.ctx
  ctx.beginPath()
  ctx.lineWidth = 0.8
  ctx.strokeStyle = "#000"
  ctx.moveTo(this.x, this.y)
  ctx.lineTo(this.x1, this.y1)
  ctx.stroke()
}

// 正常更新 - true  抹除 - this
Traveler.prototype.update = function() {
  if (Math.random() < CONFIG.chanceToSplit && travelers.length < CONFIG.max) {
    // let a = angles[Math.floor(Math.random() * angles.length)]
    // let s = 0.8 + Math.random() * 1.5
    // let vx = Math.cos(a + Math.PI/2) * s
    // let vy = Math.sin(a + Math.PI/2) * s
    // travelers.push(new Traveler(this.x, this.y, vx, vy))
    addTraveler(this.x, this.y)
  }
  this.x = this.x1
  this.x1 += this.vx
  this.y = this.y1
  this.y1 += this.vy
  // [this.x, this.x1] = [this.x1, this.x1 + this.vx]
  // [this.y, this.y1] = [this.y1, this.y1 + this.vy]
  if (this.getColor(this.x1, this.y1) < 0.8 ) {
    // this.active = false
    return false
  } else return true
}

// 获取指定像素点透明度
Traveler.prototype.getColor = function(x, y) {
  let pix = ctx.getImageData(x, y, 1, 1).data
  // console.log(pix)
  return pix[0] / 255 * pix[1] / 255
}

document.onmousedown = function(e){
  // var a = Math.random() * Math.PI * 2
  // var a = angles[Math.floor(Math.random() * angles.length)]
  // var s = 3
  // var vx = Math.cos(a) * s
  // var vy = Math.sin(a) * s
  addTraveler(e.pageX, e.pageY)
}

window.addEventListener('resize', init)

init()
animate()
// setInterval(animate, 40)
// window.requestAnimationFrame(animate)



/* test */
// 用同一种颜色在某一区域多次绘制，提取区域内的色值
// ctx.beginPath()
// ctx.rect(0,0,100,100)
// ctx.fillStyle = 'rgba(0,0,0,0.5)'
// ctx.fill()
// ctx.getImageData(1, 1, 1, 1).data


