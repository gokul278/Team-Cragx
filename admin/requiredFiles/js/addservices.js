$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/addservicesAjax.php",
        data: {
            "way": "checktoken"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            }
        }
    });
});

$("#addservice").submit(function (e) {
    e.preventDefault();

    $("#uploadbtn").prop("disabled", true);
    $("#uploadbtn").html(`Loading &nbsp;<div class="loader">
                        <div class="bar1"></div>
                        <div class="bar2"></div>
                        <div class="bar3"></div>
                        <div class="bar4"></div>
                        <div class="bar5"></div>
                        <div class="bar6"></div>
                        <div class="bar7"></div>
                        <div class="bar8"></div>
                        <div class="bar9"></div>
                        <div class="bar10"></div>
                        <div class="bar11"></div>
                        <div class="bar12"></div>
                      </div>`)

    var frm = $("#addservice")[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/addservicesAjax.php",
        data: frmdata,
        processData: false,
        contentType: false,
        cache: false,
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {
                new Notify({
                    status: 'success',
                    title: 'Service',
                    text: 'Successfully Service Added!',
                    effect: 'fade',
                    speed: 300,
                    customClass: '',
                    customIcon: '<i class="fa-solid fa-upload"></i>',
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 2000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                    customWrapper: '',
                })

                $("#uploadbtn").prop("disabled", false);
                $("#uploadbtn").html(` <i class="material-icons-outlined" style="font-size: 32px"
                >cloud_upload</i
              >
              Upload`);
                document.getElementById("addservice").reset();
            }
        }
    });
});