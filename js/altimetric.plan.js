
const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;
function generateChart(xValues, yValues) {
    
    const myChart = new Chart("myChart", {
        type:'line',
        options: {
            interaction: {
                intersect: false,
              },
            plugins:{
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
                fill: 'start'
            }]
        }

    }
    ).update();
}
