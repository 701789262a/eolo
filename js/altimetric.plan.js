
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
    fresnelPoints = generateFresnelPoints(xValues, yValues)
    fresnelupline = generateBorderFresnelSight(fresnelPoints,lineofsightz,1)
    fresneldownline = generateBorderFresnelSight(fresnelPoints,lineofsightz,-1)

    //console.log(xValues, yValues, [xValues[0],xValues[xValues.length -1]])
    console.log(lineofsightz)
    const myChart = new Chart("myChart", {
        type: 'line',
        options: {
            interaction: {
                intersect: false,
            },
            plugins: {
                decimation:{
                    enabled: true,
                    algorithm: 'lttb',
                    samples:100,
                    threshold:100
                },
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
                pointRadius: 0,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                fill: 'start',

            },{
                //labels: [xValues[0],xValues[xValues.length -1]],
                //data: [yValues[0]+30,yValues[yValues.length -1]+4],
                //pointBorderWidth:0,
                pointRadius: 1,
                data:fresnelupline,
                borderColor: "rgba(120, 255, 220, 1)",

            },
            {
                //labels: [xValues[0],xValues[xValues.length -1]],
                //data: [yValues[0]+30,yValues[yValues.length -1]+4],
                //pointBorderWidth:0,
                pointRadius: 0.1,
                data:fresneldownline,
                borderColor: "rgba(120, 255, 220, 1)",

            },
            {
                //labels: [xValues[0],xValues[xValues.length -1]],
                //data: [yValues[0]+30,yValues[yValues.length -1]+4],
                //pointBorderWidth:0,
                pointRadius: 1,
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

function generateFresnelPoints(xvalues, yvalues){
    var len = xvalues.length
    var maxdis = xvalues.slice(-1)[0]
    var fresnelradius =[]
    // 0.2 = 1/ghz = 1/5 (prova)
    for (let i=0; i< len; i+=1){
        var Fn_i = 17.32*Math.sqrt((0.2*(xvalues[i]/1000)*((maxdis - xvalues[i])/1000))/(maxdis/1000))
        //console.log(Fn_i)
        fresnelradius.push(Fn_i)
    }
    console.log(fresnelradius)
    return fresnelradius
}
function generateBorderFresnelSight(fresnelpoints,lineofsight,up_down){
    var newline =[]
    for (let i = 0;i<lineofsight.length;i+=1){
        var newpoint = lineofsight[i]+((1*up_down)*fresnelpoints[i])
        console.log(newpoint)
        newline.push(newpoint)
    }
    console.log(newline)
    return newline
}