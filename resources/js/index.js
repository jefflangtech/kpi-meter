const canvas = document.getElementById('kpi-meter')
const height = canvas.height
const width = canvas.width

const myFont = new FontFace('myFont', 'url(https://fonts.gstatic.com/s/nunito/v24/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2)')

myFont.load().then((font) => {
  document.fonts.add(font)
})

const drawChart = function(rotation) {
  if(canvas.getContext) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 400, 300)

    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'rgb(224, 223, 220)'
    ctx.arc(width / 2, height * 0.8, height / 2, 0, Math.PI, true)
    ctx.fill()
  
    ctx.translate(width / 2, height * 0.8)
    ctx.rotate(Math.PI*rotation)
    ctx.beginPath()
    ctx.fillStyle = 'rgb(75, 186, 23)'
    ctx.arc(0, 0, height / 2, 0, Math.PI)
    ctx.fill()
    ctx.restore()
    
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(width / 2, height * 0.8, height / 2 - 10, 0, Math.PI*2, true)
    ctx.fill()

    ctx.save()
    ctx.translate(width / 2, height * 0.8)
    ctx.rotate(Math.PI*1.65)
    ctx.fillStyle = 'rgb(69, 138, 0)'
    ctx.fillRect(height / 2 - 20, 0, 30, 3)
    ctx.restore()
  
    ctx.fillStyle = 'white'
    ctx.fillRect(0, height * 0.8, width, height * 0.2)

    ctx.font = `${height * 0.12}px myFont`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('$250.63', width / 2, height * 0.8 - (height * 0.1))

    ctx.font = `${height * 0.06}px myFont`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('SALES', width / 2, height * 0.8)
    ctx.fillText('$0', width / 2 - (height / 2), height * 0.8 + (height * 0.07))
    ctx.fillText('$300', width / 2 + (height / 2), height * 0.8 + (height * 0.07))

    ctx.save()
    ctx.translate(width / 2, height * 0.8)
    let x = 0 - parseInt((height / 2) * Math.cos(Math.PI*0.65))
    let y = 0 - parseInt((height / 2) * Math.sin(Math.PI*0.65)) - (height * 0.07)
    ctx.font = `${height * 0.06}px myFont`
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