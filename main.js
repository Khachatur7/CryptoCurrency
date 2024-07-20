let data = null;
let months = [
    "Jan",
    "Febr",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Semp",
    "Oct",
    "Nov",
    "Dec",
];
let date = document.getElementById("date");
let wallets = document.getElementById("wallets");
let points = document.getElementById("points");
let doughnut_chart_info = document.getElementById("doughnut_chart_info");
let doughnut_chart_info2 = document.getElementById("doughnut_chart_info2");
let chartsColors = {
    daily_points_data_integrity: "rgba(240, 103, 12)",
    daily_total_wallets: "rgb(34, 93, 204)",
    daily_total_points: "rgb(41, 201, 94)",
    daily_wallets_growth_percent: "rgb(165, 19, 19)",
    daily_points_growth_percent: "rgb(184, 119, 21)",
    daily_new_wallets: "rgb(100, 184, 21)",
    daily_points_basic_stats: ["rgb(41, 201, 94)", "rgba(240, 103, 12)"],
};

fetch("./response.json")
    .then((res) => res.json())
    .then((res) => {
        data = res;
        AppendChartInfo(data);
        CreateLineChart(
            "daily_points_data_integrity",
            data.daily_points_data_integrity
        );
        CreateDonughnutChart(
            "latest_points_categorization",
            data.latest_points_categorization
        );
        CreateDonughnutChart(
            "latest_points_increase_categorization",
            data.latest_points_increase_categorization
        );
        CreateLineChart("daily_total_wallets", data.daily_total_wallets);
        CreateLineChart("daily_total_points", data.daily_total_points);
        CreateLineChart(
            "daily_wallets_growth_percent",
            data.daily_wallets_growth_percent
        );
        CreateLineChart(
            "daily_points_growth_percent",
            data.daily_points_growth_percent
        );
        CreateLineChart("daily_new_wallets", data.daily_new_wallets);
        CreateLineChartWithToLine(
            "daily_points_basic_stats",
            data.daily_points_basic_stats
        );
        CreateTopWallets("wallets_list", data.top_100_wallets_by_daily_points_increase)
    });

// daily_new_wallets
// daily_points_growth_percent
// daily_wallets_growth_percent
// daily_total_wallets
// daily_points_data_integrity
// latest_points_increase_categorization

function AppendChartInfo(data) {
    date.innerHTML = `${data.date.substring(8, 10)} ${months[data.date.substring(6, 7)]
        } ${data.date.substring(0, 4)}`;
    wallets.innerHTML = `Wallets: ${data.total_wallets}`;
    points.innerHTML = `Points: ${Math.ceil(data.total_points)}`;
    let categories = Object.keys(data.latest_points_categorization);
    let categories2 = Object.keys(data.latest_points_increase_categorization);

    for (const key of categories) {
        let child = document.createElement("li");
        child.innerHTML = `${key}: ${data.latest_points_categorization[key]}`;
        doughnut_chart_info.appendChild(child);

    }
    for (const key of categories2) {
        let child2 = document.createElement("li");
        child2.innerHTML = `${key}: ${data.latest_points_increase_categorization[key]}`;
        doughnut_chart_info2.appendChild(child2);
    }
}

function CreateDonughnutChart(canvasId, chartName) {
    let doughnutColors = [
        "rgb(19, 139, 25)",
        "rgb(54, 162, 235",
        "rgb(216, 96, 17)",
        "rgb(216, 31, 31)",
        "rgb(45, 61, 107)",
        "rgb(89, 33, 141)",
        "rgb(55, 252, 98)",
        "rgb(45, 61, 107)",
        "rgb(252, 193, 55)",
    ];
    let ChartDataX = [];
    let ChartDataY = Object.keys(chartName);

    for (const el in chartName) {
        ChartDataY.push(chartName[el]);
    }

    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext("2d");

    let data = {
        labels: ChartDataX,
        datasets: [
            {
                label: "",
                data: ChartDataY,
                backgroundColor: doughnutColors,
                borderColor: doughnutColors,
                borderRadius: 30,
                fill: true,
                borderWidth: 2,
                cutout: "85%",
            },
        ],
    };
    let config = {
        type: "doughnut",
        data: data,
        options: {
            plugins: {
                tooltip: {
                    titleFont: {
                        weight: 200,
                    },
                    footerFont: {
                        weight: 100,
                    },
                    caretPadding: 5,
                    footerColor: "#b5b5b5",
                    label: false,
                    displayColors: false,
                    backgroundColor: "rgb(92, 92, 97)",
                    callbacks: {
                        title: function (context) {
                            console.log(context);
                            return `Grafic name  ${context[0].raw}`;

                        },
                        label: function (context) {
                            return ``;
                        },
                        footer: function (context) {
                            return `${context[0].label}`;
                        },
                    },
                }
            }
        }
    };
    new Chart(context, config);
}

function CreateLineChart(canvasId, chartName) {
    let ChartDataX = [];
    let ChartDataY = [];
    for (const d of Object.keys(chartName)) {
        ChartDataX.push(`${d.substring(8, 10)} ${months[d.substring(6, 7)]}`);
    }
    for (const el in chartName) {
        ChartDataY.push(chartName[el]);
    }

    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext("2d");
    if (canvasId != "daily_points_data_integrity") {
        context.canvas.width = window.innerWidth - 200;
        context.canvas.height = 450;
    }
    else {
        context.canvas.width = window.innerWidth - 550;
        context.canvas.height = 450;
    }
    gradient = context.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, `${chartsColors[canvasId].replace(/.$/, ",")} 0.2)`);
    gradient.addColorStop(
        1,
        `${chartsColors[canvasId].replace(/.$/, ",")} 0.02)`
    );
    let data = {
        labels: ChartDataX,
        datasets: [
            {
                label: "",
                pointRadius: 0.1,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: "rgb(252, 176, 35)",
                hoverBorderWidth: "4",
                hoverBorderColor: "#fff",
                data: ChartDataY,
                backgroundColor: gradient,
                borderColor: chartsColors[canvasId],
                fill: true,
                borderWidth: 2,
                lineTension: 0.65,
                capBezierPoints: true,
            },
        ],
    };

    let config = {
        type: "line",
        data: data,
        options: {
            plugins: {
                tooltip: {
                    titleFont: {
                        weight: 200,
                    },
                    footerFont: {
                        weight: 100,
                    },
                    caretPadding: 5,
                    footerColor: "#b5b5b5",
                    label: false,
                    displayColors: false,
                    backgroundColor: "rgb(92, 92, 97)",
                    callbacks: {
                        title: function (context) {
                            return `Grafic name  ${context[0].raw}`;
                        },
                        label: function (context) {
                            return ``;
                        },
                        footer: function (context) {
                            return `${context[0].label} 2024`;
                        },
                    },
                },
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    min: 0,
                    max: 50,
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        color: "#b5b5b5",
                        font: { size: 12 },
                        callback: function (value, index, values) {
                            if (values.length - 1 > 4) {
                                if (index === 0) {
                                    return "";
                                } else if (index === values.length - 1) {
                                    return "";
                                } else {
                                    return this.getLabelForValue(value);
                                }
                            }
                        },
                    },
                },
                y: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    };
    new Chart(context, config);
}

function CreateLineChartWithToLine(canvasId, chartName) {
    let ChartDataX = [];
    let FirstChartDataY = [];
    let SecondChartDataY = [];
    for (const d of Object.keys(chartName)) {
        ChartDataX.push(`${d.substring(8, 10)} ${months[d.substring(6, 7)]}`);
    }

    for (const el in chartName) {
        FirstChartDataY.push(chartName[el].average);
        SecondChartDataY.push(chartName[el].median);
    }

    let canvas = document.getElementById(canvasId);
    let context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth - 200;
    context.canvas.height = 450;
    let gradientForFirst = context.createLinearGradient(0, 0, 0, 100);
    gradientForFirst.addColorStop(
        0,
        `${chartsColors[canvasId][0].replace(/.$/, ",")} 0.2)`
    );
    gradientForFirst.addColorStop(
        1,
        `${chartsColors[canvasId][0].replace(/.$/, ",")} 0.02)`
    );
    let gradientForSecond = context.createLinearGradient(0, 0, 0, 100);
    gradientForSecond.addColorStop(
        0,
        `${chartsColors[canvasId][1].replace(/.$/, ",")} 0.2)`
    );
    gradientForSecond.addColorStop(
        1,
        `${chartsColors[canvasId][1].replace(/.$/, ",")} 0.02)`
    );

    let data = {
        labels: ChartDataX,
        datasets: [
            {
                label: "",
                pointRadius: 0,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: "rgb(252, 176, 35)",
                hoverBorderWidth: "4",
                hoverBorderColor: "#fff",
                data: FirstChartDataY,
                backgroundColor: gradientForFirst,
                borderColor: chartsColors[canvasId][0],
                fill: true,
                borderWidth: 2,
                lineTension: 0.65,
            },
            {
                label: "",
                pointRadius: 0,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: "rgb(252, 176, 35)",
                hoverBorderWidth: "4",
                hoverBorderColor: "#fff",
                data: SecondChartDataY,
                backgroundColor: gradientForSecond,
                borderColor: chartsColors[canvasId][1],
                fill: true,
                borderWidth: 2,
                lineTension: 0.65,
            },
        ],
    };

    let config = {
        type: "line",
        data: data,
        options: {
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    min: 0,
                    max: 50,
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6,
                        color: "#b5b5b5",
                        font: { size: 12 },
                        callback: function (value, index, values) {
                            if (index === 0) {
                                return "";
                            } else if (index === values.length - 1) {
                                return "";
                            } else {
                                return this.getLabelForValue(value);
                            }
                        },
                    },
                },
                y: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
            plugins: {
                tooltip: {
                    titleFont: {
                        weight: 200,
                    },
                    footerFont: {
                        weight: 100,
                    },
                    caretPadding: 5,
                    footerColor: "#b5b5b5",
                    label: false,
                    displayColors: false,
                    backgroundColor: "rgb(92, 92, 97)",
                    callbacks: {
                        title: function (context) {
                            return `Grafic name  ${context[0].raw}`;
                        },
                        label: function (context) {
                            return ``;
                        },
                        footer: function (context) {
                            return `${context[0].label} 2024`;
                        },
                    },
                },
                legend: {
                    display: false,
                },
            },
        },
    };
    new Chart(context, config);
}


function CreateTopWallets(parentId, top_wallets) {
   
    let parent = document.getElementById(parentId)
    for (const w in top_wallets) {
        
        let wallet = document.createElement("div")
        let address = document.createElement("div")
        let wallets_num = document.createElement("span")
        let address_link = document.createElement("span")
        let point_info = document.createElement("div")
        let point_text = document.createElement("span")
        let point_num = document.createElement("span")
        wallet.className = "wallet"
        address.className = "address"
        wallets_num.className = "waletts_num"
        point_info.className = "point_increase"
        point_num.className = "point"
        wallets_num.innerHTML = `${Number(w) + 1}.`
        address_link.innerHTML = top_wallets[w].address
        point_text.innerHTML = "Point: "
        point_num.innerHTML = top_wallets[w].points_increase
        console.log(wallets_num);
        address.appendChild(wallets_num)
        address.appendChild(address_link)
        point_info.appendChild(point_text)
        point_info.appendChild(point_num)
        wallet.appendChild(address)
        wallet.appendChild(point_info)
        parent.appendChild(wallet)
    }

}