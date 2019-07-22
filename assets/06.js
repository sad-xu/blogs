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
  // spring: 0.35,
  // ease: 0.84,
  // strokeMax: 10,
  chanceToSplit: 0.2, // 分裂率
  num: 50,  // 同时存在数
  max: 1500, // 最大存在数
  // alpha: 1,
  fade: 0.3,
  clear: function (){removeTravelers(), clear(ctx)}
}



// var gui = new dat.GUI();
// gui.add(CONFIG, 'num', 0, 150).step(1);
// gui.add(CONFIG, 'max', 1, 3000).step(1);
// gui.add(CONFIG, 'chanceToSplit', 0, 1);
// // gui.add(CONFIG, 'ease', 0, 1);
// // gui.add(CONFIG, 'alpha', 0, 1);
// // gui.add(CONFIG, 'strokeMax', 1, 50).step(1);
// // gui.add(CONFIG, 'strokeMin', 0, 50).step(1);
// gui.add(CONFIG, 'fade', 0, 1).step(0.1);
// gui.add(CONFIG, 'draw');
// gui.add(CONFIG, 'clear');
// gui.closed = true;

function init() {
  canvas.width = width = window.innerWidth
  canvas.height = height = window.innerHeight
  
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.fillStyle = `rgba(${BG[0]}, ${BG[1]}, ${BG[2]}, ${1})`
  ctx.fill()
}

function animate() {
  if (CONFIG.fade > 0) {
    fade(ctx, CONFIG.fade/10, width, height)
  }
  draw()
  // window.requestAnimationFrame(function(){animate()})
}

function fade(ctx, amt, width, height) {
  ctx.beginPath()
  ctx.rect(0, 0, width, height)
  ctx.fillStyle = `rgba(${BG[0]}, ${BG[1]}, ${BG[2]}, ${amt})`
  ctx.fill()
}

function draw() {
  let traveler
  for (let t in travelers) {
    traveler = travelers[t]
    let ret = traveler.update()
    if (ret === true) {
      traveler.draw()
    } else {
      travelers.splice(travelers.indexOf(status), 1)
      delete ret
    }
  }
  if (travelers.length < CONFIG.num) {
    var a = Math.PI/2
    // var a = angles[Math.floor(Math.random() * angles.length)]
    var s = 3
    var vx = Math.cos(a) * s
    var vy = Math.sin(a) * s
    addTraveler(Math.random()*canvas.width, canvas.height, vx, vy);
  }
}

function addTraveler(x, y, vx, vy){
  travelers.push(new Traveler(ctx, x, y, vx, vy))
}

function Traveler(ctx, x, y, vx, vy) {
  this.ctx = ctx
  // 起点
  this.x = x
  this.y = y
  // 终点
  this.x1 = x
  this.y1 = y
  // 变化值
  this.vx = vx
  this.vy = vy
  // this.p = Math.random() * 0.3 + 0.1
  this.step = 0
  this.active = true
}

Traveler.prototype.draw = function() {
  if (this.active) {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.lineWidth = 0.8
    ctx.strokeStyle = "#000000"
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
  }
}

// 正常更新 - true  抹除 - this
Traveler.prototype.update = function() {
  if (this.active) {
    this.step ++
    if (Math.random() < CONFIG.chanceToSplit && travelers.length < CONFIG.max) {
      let a = angles[Math.floor(Math.random() * angles.length)]
      //var a = Math.atan2(this.vy, this.vx)// + Math.random() * 0.2
      let s = 0.8 + Math.random() * 1.5
      let vx = Math.cos(a + Math.PI/2) * s
      let vy = Math.sin(a + Math.PI/2) * s
      addTraveler(this.x1, this.y1, vx, vy)
    }
    this.x1 = this.x
    this.y1 = this.y
    this.x += this.vx
    this.y += this.vy
    if (this.getColor(this.x, this.y) < 0.7 ){
      this.active = false
      return this
      // this.die()
    } else return true
  } else return this
}

// 获取指定像素点透明度
Traveler.prototype.getColor = function() {
  let pix = ctx.getImageData(x, y, 1, 1).data
  return pix[0] / 255 * pix[1] / 255 * pix[3] / 255
}

function clear(ctx) {
  ctx.beginPath();
  ctx.rect(0, 0, width, height)
  ctx.fillStyle = `rgba(${BG[0]}, ${BG[1]}, ${BG[2]}, ${1})`
  ctx.fill()
}

function removeTravelers() {
  while(travelers.length > 0){
    delete travelers.pop()
  }
}

document.onmousedown = function(e){
  // var a = Math.random() * Math.PI * 2
  var a = angles[Math.floor(Math.random() * angles.length)]
  var s = 3
  var vx = Math.cos(a) * s
  var vy = Math.sin(a) * s
  addTraveler(e.pageX, e.pageY, vx, vy)
}

window.addEventListener('resize', init)
init()

// setInterval(animate, 40)
// window.requestAnimationFrame(animate);
