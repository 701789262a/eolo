
const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;
function generateChart(xValues, yValues) {
    let chartStatus = Chart.getChart("myChart"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    lineofsightz = generateLineOfSight(30,4,xValues, yValues)

    //console.log(xValues, yValues, [xValues[0],xValues[xValues.length -1]])
    console.log(lineofsightz)
    const myChart = new Chart("myChart", {
        type: 'line',
        options: {
            interaction: {
                intersect: false,
            },
            plugins: {
                filler: {
                    propagate: false,
                },
                legend: {
                    display: false
                },
            },
            scales: {
                x: {
                    display: false, // UNCOMMENT to disable x axis in v4 or v3
                    border: {
                        display: false
                    },

                    grid: {
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    }
                },
                y: {
                    display: false, // UNCOMMENT to disable x axis in v4 or v3
                    border: {
                        display: false
                    },

                    grid: {
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    }
                }
            }


        },
        data: {

            labels: xValues,
            datasets: [{
                fill: {
                    target: 'origin',
                    above: 'rgb(255, 0, 0)',   // Area will be red above the origin
                    below: 'rgb(0, 0, 255)'    // And blue below the origin
                },
                data: yValues,
                borderColor: "darkgray",
                backgroundColor: "darkgray",
                pointRadius: 1,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                fill: 'start',

            },{
                //labels: [xValues[0],xValues[xValues.length -1]],
                //data: [yValues[0]+30,yValues[yValues.length -1]+4],
                data:lineofsightz,
                borderColor: "rgba(6, 120, 220, 1)",

            }
        ]
        }

    }
    ).update();
}

function generateLineOfSight(btsheight, observerheight, xvalues, yvalues){
    var lineofsight =[];
    for (let i = 0; i<yvalues.length; i++){
        lineofsight.push( yvalues[0]+btsheight-(0.1*(xvalues[i]-10)*((yvalues[0]+30-yvalues[yvalues.length -1]-4)/yvalues.length)) )
    }
    return lineofsight
}