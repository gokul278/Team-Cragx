$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/indexAjax.php",
        data: {
            "way": "getServices"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.services.length > 0) {
                    let getservices = "";

                    response.services.forEach((element, index) => {
                        getservices += `
                        <div class="col-lg-4 col-md-6" data-aos="fade-up">
                            <div class="feature-style-five mb-45">
                                <div class="icon mb-30">
                                <img src="./admin/Utils/ServiceImg/${element.service_img}" style="width:50px;height:50px" alt="icon" />
                                </div>
                                <h2 class="mb-20">
                                <a class="sect-title-two" href="services.html"
                                    >${element.service_name}</a
                                >
                                </h2>
                                <p style="text-align: justify">
                                ${element.service_description}
                                </p>
                            </div>
                        </div>
                        `;
                    });

                    $("#getservices").html(getservices);
                }

            }
        }
    });
});

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
            }else if (response.status == "error"){
                swal(subscribeemail, "You Already Subscribed Buddy!", "success");
                $("#subscribeemail").val('');
            }
        }
    });

});