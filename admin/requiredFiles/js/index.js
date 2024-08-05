$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: "./requiredFiles/ajax/dashboardAjax.php",
    data: {
      "way": "checktoken"
    },
    success: function (res) {
      var response = JSON.parse(res);

      if (response.status == "success") {
        location.replace("./dashboard.html")
      }
    }
  });
});

const checkinput = () => {
  $("#errormessage").html("");
};

const submitlogin = () => {
  $("#submitbtn").prop("disabled", true);
  $("#submitbtn").html(`Loading&nbsp;<div class="loader">
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
</div>`);
  const email = $("#email").val();
  const password = $("#password").val();
  const loggedin = $("#flexSwitchCheckChecked").prop("checked");

  if (email.length > 0 && password.length > 0) {
    $.ajax({
      type: "post",
      url: "./requiredFiles/ajax/indexAjax.php",
      data: {
        way: "login",
        useremail: email,
        password: password,
        loggedin: loggedin,
      },
      success: function (res) {
        const response = JSON.parse(res);
        if (response.status === "success") {
          location.replace("./dashboard.html");
        } else if (response.status === "failed") {
          $("#submitbtn").prop("disabled", false);
          $("#submitbtn").html("Login");
          $("#errormessage").html(`<div
                          style="
                            background-color: #BF3131;
                            width: 100%;
                            font-size: 16px;
                            font-weight: 600;
                            padding: 4px;
                            border-radius: 5px;
                          "
                          align="center"
                        >
                          ${response.message}
                        </div>`);
        }
      },
    });
  } else {
    $("#submitbtn").html("Login");
    $("#submitbtn").prop("disabled", false);
    $("#errormessage").html(`<div
                          style="
                            background-color: #BF3131;
                            width: 100%;
                            font-size: 16px;
                            font-weight: 600;
                            padding: 4px;
                            border-radius: 5px;
                          "
                          align="center"
                        >
                          Enter Email & Password
                        </div>`);
  }
};
