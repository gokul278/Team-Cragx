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

const getData = () =>{
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
                
                if(response.totalsubscribe > 0){
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
                }else{
                    $("#totalsubscribe").html("No Subscribers Yet");
                }

                if(response.totalcontactus > 0){
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
                }else{
                    $("#totalcontactus").html("No Request Yet");
                }

            }
        }
    });
}