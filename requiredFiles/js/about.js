$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/indexAjax.php",
        data: {
            "way": "getusers"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.users.length > 0) {
                    let getprojects = "";

                    response.users.forEach((element, index) => {
                        
                        getprojects += `
                        <div
                            class="col-lg-4 col-md-6"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <div class="team-style-two text-center mb-45">
                                <div class="team-thumb">
                                    <img src="./admin/Utils/ProfileImg/${element.user_profileimg}" alt="img" />
                                    <div class="team-social-two">
                                        <a href="${element.user_linkedinlink}" target="_blank">
                                            <i class="fab fa-linkedin-in"></i>
                                        </a>
                                        <a href="https://wa.me/${element.user_whatsapplink}" target="_blank">
                                            <i class="fab fa-whatsapp"></i>
                                        </a>
                                        ${element.user_xlink !== null ?
                                `<a href="${element.user_xlink}" target="_blank">
                                            <i class="fab fa-twitter"></i>
                                        </a>` : ""}
                                        <a href="${element.user_instalink}" target="_blank">
                                            <i class="fab fa-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="team-content">
                                    <p><b>${element.user_role}</b></p>
                                    <h3
                                    style="
                                        font-family: 'Times New Roman', Times, serif;
                                        color: black;
                                    "
                                    class="sect-title-two"
                                    >
                                    ${element.user_name}
                                    </h3>
                                </div>
                            </div>
                        </div>                        
                        `;
                    });

                    $("#getprojects").html(getprojects);
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
            } else if (response.status == "error") {
                swal(subscribeemail, "You Already Subscribed Buddy!", "success");
                $("#subscribeemail").val('');
            }
        }
    });

});