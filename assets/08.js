// https://api.highcharts.com/highcharts/series.treemap.data
// https://api.highcharts.com.cn/highcharts#series%3Ctreemap%3E.data

// https://zhuanlan.zhihu.com/p/57873460

let chartData = Array.from({length: 26}).map((item, index) => {
  let val = (10 + Math.round(index)) * (index % 2 ? -1 : 1)
  return {
    name: val,
    value: Math.abs(val),
    truthName: String.fromCharCode(index + 65),
    color: val > 0 ?  `rgba(244,67,54,${val / 40})` : `rgba(103,58,183,${Math.abs(val / 40)})`
  }
})


Highcharts.seriesTypes.treemap.prototype.myCustomAlgorithm = function(parent, children) {
  let type = true
  let list = []
  let k = 0
  let l = children.length - 1
  let obj = {
    x: parent.x,
    y: parent.y,
    parent
  }
  let group = new this.algorithmGroup(parent.height, parent.width, parent.direction, obj)
  children.sort((a, b) => b.name - a.name)
  children.forEach(child => {
    group.addElement(child.val / parent.val * parent.height * parent.width)
    if (group.lP.nR > group.lP.lR) this.algorithmCalcPoints(type, false, group, list, obj)
    if (k === l) this.algorithmCalcPoints(type, true, group, list, obj)
    k++
  })
  return list
}


// sliceAndDice stripes squarified  strip
Highcharts.chart('treemap-chart', {
  title: {
    text: '矩形树图'
  },
  credits: {
    enabled: false
  },
  exporting: {
    enabled: false
  },
  tooltip: {
    pointFormatter: function() {
      return `<b>${this.truthName}</b>：${this.name}`
    }
  },
  series: [{
    type: 'treemap',
    layoutAlgorithm: 'myCustomAlgorithm',
    dataLabels: {
      formatter: function() {
        return this.point.truthName
      }
    },
    data: chartData
  }]
})