$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/subscribersAjax.php",
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
        url: "./requiredFiles/ajax/subscribersAjax.php",
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
                if (response.subscribes.length > 0) {
                    let subscribes = "";

                    response.subscribes.forEach((element, index) => {
                        subscribes += `
                        <tr>
                            <th>${index + 1}</th>
                            <th>${element.subscribe_email}</th>
                            <th>${element.createdAt}</th>
                        </tr>
                        `;
                    });

                    $("#subscribes").html(subscribes);

                } else {
                    $("#subscribes").html(`<tr><th colspan="3">No subscribes Yet</th></tr>`);
                }
            }
        }
    });
}