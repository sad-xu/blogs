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

let lines = []

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
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let updateStatus = line.update()
    if (updateStatus.branch) {
      let {x, y} = updateStatus.branch
      addLine(x, y)
    }
    if (updateStatus.flag) {
      line.draw()
    } else {
      lines.splice(i, 1)
      i--
      delete line
    }
  }

  if (lines.length < CONFIG.num) {
    addLine(Math.random() * width, Math.random() * height)
  }

  window.requestAnimationFrame(animate)
}

function addLine(x, y){
  let a = angles[Math.floor(Math.random() * angles.length)]
  let vx = Math.cos(a) * CONFIG.speed
  let vy = Math.sin(a) * CONFIG.speed
  lines.push(new Line(x, y, vx, vy))
}

function Line(x, y, vx, vy) {
  // 起点
  this.x = x
  this.y = y
  // 终点
  this.x1 = x
  this.y1 = y
  // 变化值
  this.vx = vx
  this.vy = vy
}

Line.prototype.ctx = ctx

Line.prototype.draw = function() {
  const ctx = this.ctx
  ctx.beginPath()
  ctx.lineWidth = 0.8
  ctx.strokeStyle = "#000"
  ctx.moveTo(this.x, this.y)
  ctx.lineTo(this.x1, this.y1)
  ctx.stroke()
}

// { flag: Boolean, branch: {x, y} }
Line.prototype.update = function() {
  let updateStatus = {}
  if (Math.random() < CONFIG.chanceToSplit && lines.length < CONFIG.max) {
    updateStatus.branch = {
      x: this.x,
      y: this.y
    }
  }

  this.x = this.x1
  this.x1 += Math.abs(this.vx < 0.0001) ? Math.random() - 1 : this.vx * Math.random()
  this.y = this.y1
  this.y1 += Math.abs(this.vy < 0.0001) ? Math.random() - 1 : this.vy * Math.random()

  updateStatus.flag = this.ctx.getImageData(this.x1, this.y1, 1, 1).data[0] >= 138
  return updateStatus
}

// 获取指定像素点透明度
// Line.prototype.getColor = function(x, y) {
//   let pix = ctx.getImageData(x, y, 1, 1).data
//   return pix[0] // 255
// }

document.onmousedown = function(e){
  addLine(e.pageX, e.pageY)
}

window.addEventListener('resize', init)

init()
animate()


/* test */
// 用同一种颜色在某一区域多次绘制，提取区域内的色值
// ctx.beginPath()
// ctx.rect(0,0,100,100)
// ctx.fillStyle = 'rgba(0,0,0,0.5)'
// ctx.fill()
// ctx.getImageData(1, 1, 1, 1).data


