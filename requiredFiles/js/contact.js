$("#subscribeform").submit(function (e) {
    e.preventDefault();
    const subscribeemail = $("#subscribeemail").val();

    party.confetti(this, {
        count: party.variation.range(50, 50),
        size: party.variation.range(0.8, 1.2),
    });

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/indexAjax.php",
        data: {
            "way": "subscribeemail",
            "subscribeemail": subscribeemail
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {
                swal(subscribeemail, "Thank You For Subscribe!", "success");
                $("#subscribeemail").val('');
            } else if (response.status == "error") {
                swal(subscribeemail, "You Already Subscribed Buddy!", "success");
                $("#subscribeemail").val('');
            }
        }
    });

});


$("#contactform").submit(function (e) {
    e.preventDefault();

    party.confetti(this, {
        count: party.variation.range(50, 50),
        size: party.variation.range(0.8, 1.2),
    });

    var frm = $("#contactform")[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/indexAjax.php",
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
                swal($("#contactname").val(), "Thank You For Contacting Us!", "success");
                document.getElementById("contactform").reset();
            }
        }
    });

});