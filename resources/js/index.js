const canvas = document.getElementById('kpi-meter')
const height = canvas.height
const width = canvas.width
let xCoord = 0
let yCoord = 0

// GLOBALS for demo purposes
const DAILYSALES = 10000

// FONT LOADING - Lato Font
const myFont = new FontFace('myFont', 'url(https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXg.woff2)')
myFont.load().then((font) => {
  document.fonts.add(font)
})

// FORMAT SALES VALUES FOR CURRENCY PRINTING
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function getCurrentDayInMonth() {
  const date = new Date()
  return date.getDate()
}
const date = new Date()
const currentYear = date.getFullYear()
const currentMonth = date.getMonth() + 1

// Variables needed for calculating sales goals
const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth)
const currentDayOfMonth = getCurrentDayInMonth()
const currentRadOfDay = currentDayOfMonth / daysInCurrentMonth

let salesTotal = 0
const parseData = function(data) {
  salesByDay = []
  data.forEach(elem => {
    let { day, sales } = {...elem}
    salesByDay.push(sales)
  })
  salesTotal = salesByDay.reduce((a, b) => a + b)
}

async function getSalesData() {
  const response = await fetch('./data.json')
  const data = await response.json()
  parseData(data)
}

getSalesData()

const drawChart = function(rotation) {
  if(canvas.getContext) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)

    // Draw a white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // Draw the grey arc
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'rgb(224, 223, 220)'
    ctx.arc(width / 2, height * 0.8, height / 2 - 10, 0, Math.PI, true)
    ctx.fill()

    // Draw the red arc
    let redArcRot = rotation
    if(redArcRot > currentRadOfDay) {
      redArcRot = currentRadOfDay
    }
    ctx.translate(width / 2, height * 0.8)
    ctx.rotate(Math.PI*redArcRot)
    ctx.beginPath()
    ctx.fillStyle = 'rgba(240, 0, 0, 0.5)'
    ctx.arc(0, 0, height / 2 - 10, 0, Math.PI)
    ctx.fill()
    ctx.restore()
  
    // Draw the green arc
    let greenArcRot = rotation
    if(greenArcRot > salesTotal / (daysInCurrentMonth * DAILYSALES)) {
      greenArcRot = salesTotal / (daysInCurrentMonth * DAILYSALES)
    }
    ctx.save()
    ctx.translate(width / 2, height * 0.8)
    ctx.rotate(Math.PI*greenArcRot)
    ctx.beginPath()
    ctx.fillStyle = 'rgb(75, 186, 23)'
    ctx.arc(0, 0, height / 2 - 10, 0, Math.PI)
    ctx.fill()
    ctx.restore()
    
    // Draw the white circle in the center so we only see an arc
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(width / 2, height * 0.8, height / 2 - 20, 0, Math.PI*2, true)
    ctx.fill()

    // Draw the current forecast indicator line on the curve
    ctx.save()
    ctx.translate(width / 2, height * 0.8)
    ctx.rotate(Math.PI*(1+currentRadOfDay))
    if(salesTotal < (currentDayOfMonth * DAILYSALES)) {
      markerColor = 'rgba(240, 0, 0, 0.5)'
    } else {
      markerColor = 'rgb(69, 138, 0)'
    }
    ctx.fillStyle = markerColor
    ctx.fillRect(height / 2 - 30, 0, 30, 3)
    ctx.restore()
  
    // Draw a white rectangle a bottom of canvas to cover up below chart
    ctx.fillStyle = 'white'
    ctx.fillRect(0, height * 0.8, width, height * 0.2)

    // Draw the total current sales in $
    ctx.font = `${height * 0.12}px myFont`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText(`${formatter.format(salesTotal)}`, width / 2, height * 0.8 - (height * 0.1))

    // Draw SALES, begin month $ and end month $
    ctx.font = `${height * 0.06}px myFont`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'left'
    ctx.fillText('0', width / 2 - (height / 2) + 10, height * 0.8 + (height * 0.07))
    ctx.textAlign = 'center'
    ctx.fillText('SALES', width / 2, height * 0.8)
    let monthSalesGoal = daysInCurrentMonth * DAILYSALES
    if(monthSalesGoal / 1000 > 1) {
      monthSalesGoal = Math.floor(monthSalesGoal / 1000)
      ctx.fillText(`${monthSalesGoal}K`, width / 2 + (height / 2) - 10, height * 0.8 + (height * 0.07))
    } else {
      ctx.fillText(`${daysInCurrentMonth * DAILYSALES}`, width / 2 + (height / 2), height * 0.8 + (height * 0.07))
    }

    // Draw current forecast $ above the chart
    ctx.save()
    ctx.translate(width / 2, height * 0.8)
    let x = 0 - parseInt((height / 2) * Math.cos(Math.PI*currentRadOfDay))
    let y = 0 - parseInt((height / 2) * Math.sin(Math.PI*currentRadOfDay)) - (height * 0.07)
    // Adjust the x position based on current rotation so it does not
    // overlap the chart
    let xAdjust = 15 * (8 * (currentRadOfDay - 0.5) ** 3)
    x = x + xAdjust
    ctx.font = `${height * 0.06}px myFont`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    let salesForecast = currentDayOfMonth * DAILYSALES
    if(salesForecast / 1000 > 1) {
      salesForecast = Math.floor(salesForecast / 1000)
      ctx.fillText(`${salesForecast}K`, x, y)
    } else {
      ctx.fillText(`${salesForecast}`, x, y)
    }
    ctx.restore()

    // UNUSED - to display x,y coords of the mouse
    // ctx.font = `${height * 0.06}px myFont`
    // ctx.fillStyle = 'black'
    // ctx.textAlign = 'left'
    // ctx.fillText(`(${xCoord}, ${yCoord})`, 20, 20)
  }
}

// Can be used to create additional features within the canvas
canvas.addEventListener('mousemove', function(e) {
  xCoord = e.offsetX
  yCoord = e.offsetY
})

// Start drawing at 60fps
let rotation = 0
const intervalID = setInterval(function() {
  rotation += 0.02
  if(rotation >=1) {
    // clearInterval(intervalID)
    rotation = 1
  }
  drawChart(rotation)
}, 16)