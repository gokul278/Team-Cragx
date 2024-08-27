let myChart;

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/dashboardAjax.php",
        data: {
            "way": "checktoken"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {
                return getData();
            }
        }
    });
});

const getData = () => {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/dashboardAjax.php",
        data: {
            "way": "getdata"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                const start = 2024;

                const end = new Date().getFullYear();

                const yeardata = [];

                for (let i = end; i >= start; i--) {
                    yeardata.push(i);
                }

                let year = '';

                yeardata.forEach((element, index) => {
                    year += `<option ${index === 0 ? "selected" : null} value="${element}">${element}</option>`;
                });

                $("#optionsdata").html(year)


                getChart();

                if (response.totalsubscribe > 0) {
                    $("#totalsubscribe").html(`
                        Subscribers <span
                      style="
                        color: white;
                        background-color: red;
                        padding-top: 1px;
                        padding-bottom: 1px;
                        padding-left: 9px;
                        padding-right: 9px;
                        border-radius: 100%;
                      "
                      >${response.totalsubscribe}</span
                    >
                    `);
                } else {
                    $("#totalsubscribe").html("No Subscribers Yet");
                }

                if (response.totalcontactus > 0) {
                    $("#totalcontactus").html(`
                        <span
                      style="
                        color: white;
                        background-color: red;
                        padding-top: 1px;
                        padding-bottom: 1px;
                        padding-left: 9px;
                        padding-right: 9px;
                        border-radius: 100%;
                      "
                      >${response.totalcontactus}</span
                    >
                    Request
                    `);
                } else {
                    $("#totalcontactus").html("No Request Yet");
                }

            }
        }
    });
}

const getChart = () => {

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/dashboardAjax.php",
        data: {
            "way": "checkgraph",
            "year": $("#optionsdata").val()
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {
                location.replace("time_expried.php");
            } else if (response.status == "auth_failed") {
                location.replace("unauth_login.php");
            } else if (response.status == "success") {
                const ctx = document.getElementById("myChart").getContext('2d');

                // Check if a chart instance already exists and destroy it
                if (myChart) {
                    myChart.destroy();
                }

                // Re-set the canvas size to prevent resizing issues
                ctx.canvas.width = ctx.canvas.clientWidth;
                ctx.canvas.height = ctx.canvas.clientHeight;

                // Create a new chart instance
                myChart = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                        ],
                        datasets: [
                            {
                                label: "Total Revenue",
                                data: response.data,
                                borderWidth: 1.8,
                                fill: false,
                                borderColor: "#50b498",
                                backgroundColor: '#50b498',
                                tension: 0.2,
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,  // Ensure consistent width and height
                        scales: {
                            y: {
                                beginAtZero: true,  // Ensure the y-axis starts from zero
                                min: 0,  // Set minimum y-axis value
                                max: response.maxval+10000,  // Set maximum y-axis value to prevent dynamic scaling
                                ticks: {
                                    color: '#fff',  // Customize tick label color if needed
                                },
                            }, x: {
                                // Set maximum y-axis value to prevent dynamic scaling
                                ticks: {
                                    color: '#fff',  // Customize tick label color if needed
                                },
                            },
                        },
                    },
                });
            }
        }
    });
}
