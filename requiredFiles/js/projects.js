$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/indexAjax.php",
        data: {
            "way": "getprojects"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.projects.length > 0) {
                    let getprojets = `<div
                                        class="grid row gx-4 gx-xxl-5 feature-slider-one pe-0"
                                        data-aos="fade-up"
                                        data-aos-delay="200"
                                        id="getprojects"
                                    >`;

                    response.projects.forEach((element, index) => {
                        getprojets += `
                        <div class="col-lg-4 col-md-6 grid-item cat3 cat5">
                            <div class="case-item-one mx-0 mb-45">
                                <div class="case-thumb">
                                    <img
                                    class="w-100"
                                    src="./admin/Utils/ProjectImg/${element.project_img}"
                                    alt="img"
                                    />
                                </div>
                                <div class="case-content">
                                    <h3>
                                    <a
                                        class="sect-title-two"
                                        href="${element.project_link}"
                                        target="_blank"
                                        >${element.project_name}</a
                                    >
                                    </h3>
                                    <p>
                                    <b>"${element.project_description}"</b> 
                                    </p>
                                    <a
                                    class="case-btn"
                                    href="${element.project_link}"
                                    target="_blank"
                                    ><i class="bi bi-arrow-up-right"></i
                                    ></a>
                                </div>
                            </div>
                        </div>
                        `;
                    });

                    getprojets += `</div>`;

                    $("#getprojects").html(getprojets);
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