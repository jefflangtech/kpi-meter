const canvas = document.getElementById('kpi-meter')

// console.dir(canvas)

const myFont = new FontFace('myFont', 'url(https://fonts.gstatic.com/s/nunito/v24/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2)')

myFont.load().then((font) => {
  document.fonts.add(font)
})

const drawChart = function(rotation) {
  if(canvas.getContext) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 300, 200)

    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'rgb(224, 223, 220)'
    ctx.arc(150, 150, 100, 0, Math.PI, true)
    ctx.fill()
  
    ctx.translate(150, 150)
    ctx.rotate(Math.PI*rotation)
    ctx.beginPath()
    ctx.fillStyle = 'rgb(75, 186, 23)'
    ctx.arc(0, 0, 100, 0, Math.PI)
    ctx.fill()
    ctx.restore()
    
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(150, 150, 90, 0, Math.PI*2, true)
    ctx.fill()

    ctx.save()
    ctx.translate(150, 150)
    ctx.rotate(Math.PI*1.65)
    ctx.fillStyle = 'rgb(69, 138, 0)'
    ctx.fillRect(80, 0, 30, 3)
    ctx.restore()
  
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 150, 300, 50)

    ctx.font = '24px myFont'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('$250.63', 150, 130)

    ctx.font = '12px myFont'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('SALES', 150, 150)
    ctx.fillText('$0', 55, 163)
    ctx.fillText('$300', 245, 163)

    ctx.save()
    ctx.translate(150, 150)
    let x = 0 - parseInt(110 * Math.cos(Math.PI*0.65))
    let y = 0 - parseInt(110 * Math.sin(Math.PI*0.65)) - 10
    ctx.font = '12px myFont'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('$240', x, y)
    ctx.restore()

  }
}

let rotation = 0
const intervalID = setInterval(function() {
  rotation += 0.01
  if(rotation > 0.75) {
    clearInterval(intervalID)
  }
  drawChart(rotation)
}, 10)

// let x = 100 * Math.cos(0.35)
// x = parseInt(x + 150)
// console.log(x)
// let y = 100 * Math.sin(0.35)
// y = 150 - y
// console.log(y)
