$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: "./requiredFiles/ajax/quotationhistoryAjax.php",
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

  $("#quotationhistory").html(`<tr>
                      <th colspan="7">
                        <div style="display: flex; justify-content: center">
                          Loading &nbsp;
                          <div class="loader">
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
                          </div>
                        </div>
                      </th>
                    </tr>`);

  $.ajax({
    type: "POST",
    url: "./requiredFiles/ajax/quotationhistoryAjax.php",
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

        if (response.quotation.length > 0) {
          let data = "";
          response.quotation.forEach((element) => {
            data += `
                        <tr>
                        <td>${element.quotation_id}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.company_name}</td>
                        <td>${element.company_address}</td>
                        <td align="start" style="color: #ffc107;">
                          Email: <b style="color: #fff;">${element.company_email}</b> <br />
                          Phone no: <b style="color: #fff;">${element.company_phoneno}</b>
                        </td>
                        <td style="color: #ffc107;">Rs ${element.estimatedval}</td>
                        <td align="center">
                            <button class="btn btn-grd btn-grd-primary px-2" onClick="downloadQuotation(${element.quotation_id})">
                            <i class="fa-solid fa-download"></i>
                            Quoatation
                            </button>
                          <br />
                          <button
                            id="uploadbtn"
                            type="submit"
                            class="btn btn-danger mt-4"
                            style="padding: 5px 25px; font-size: 16px"
                            onClick="deleteQuotation(${element.quotation_id})"
                          >
                            <i class="fa-solid fa-trash"></i>&nbsp;
                            Delete
                          </button>
                        </td>
                      </tr>
                      `;
          });

          $("#quotationhistory").html(data);

        } else {
          $("#quotationhistory").html(`<tr>
                        <th colspan="7">
                          <div style="display: flex; justify-content: center">
                            No Quotation Found
                          </div>
                        </th>
                      </tr>`);
        }

      }
    }
  });
}


const downloadQuotation = (id) => {

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "./quotation.php";
  form.target = "_blank";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "quotation_id";
  input.value = id;

  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();

  document.body.removeChild(form);
}


const deleteQuotation = (quotation_id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this Data!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          type: "POST",
          url: "./requiredFiles/ajax/quotationhistoryAjax.php",
          data: {
            "way": "deletequotation",
            "quotation_id": quotation_id
          },
          success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

              location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

              location.replace("unauth_login.php");

            } else if (response.status == "success") {

              new Notify({
                status: 'success',
                title: 'Quotation',
                text: 'Successfully Quotation Removed!',
                effect: 'fade',
                speed: 300,
                customClass: '',
                customIcon: '<i class="fa-solid fa-trash"></i>',
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

              return getData();
            }
          }
        });
      }
    });
}