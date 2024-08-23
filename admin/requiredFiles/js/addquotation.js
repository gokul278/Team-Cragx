$(document).ready(function () {
  $.ajax({
    type: "POST",
    url: "./requiredFiles/ajax/addquotationAjax.php",
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

        let initalArray = [{ id: 1, description: '', price: '' }];

        localStorage.setItem('quotation', JSON.stringify(initalArray));
      }
    }
  });

});

const addquotationdata = () => {
  let quotation = JSON.parse(localStorage.getItem('quotation'));
  let id = quotation.length > 0 ? quotation[quotation.length - 1].id + 1 : 1;
  console.log(id)
  let initalArray = { id: id, description: '', price: '' };
  quotation.push(initalArray);

  localStorage.setItem('quotation', JSON.stringify(quotation));

  $("#quotaationtable").append(`
        <tr id="${id}">
                      <td style="width: 48%">
                        <input
                          class="form-control"
                          list="datalistOptions"
                          name="description[]"
                          id="description${id}"
                          oninput="decriptioninput(${id})"
                          required
                        />
                      </td>
                      <td style="width: 48%">
                        <input
                          class="form-control"
                          list="datalistOptions"
                          name="price[]"
                          type="number"
                          id="price${id}"
                          oninput="priceinput(${id})"
                          required
                        />
                      </td>
                      <td style="width: 4%">
                        <button class="btn btn-grd btn-grd-primary px-2" onClick="removequotation(${id})">
                          <i class="material-icons-outlined" >delete</i>
                        </button>
                      </td>
                    </tr>`);
}

const removequotation = (id) => {
  let quotation = JSON.parse(localStorage.getItem('quotation'));
  quotation = quotation.filter(item => item.id !== id);
  localStorage.setItem('quotation', JSON.stringify(quotation));
  $(`#${id}`).remove();
  let totalprice = 0;

  quotation.forEach(element => {
    totalprice += element.price.length > 0 ? parseInt(element.price) : 0
  });

  $("#totalprice").html(parseInt(totalprice) + " Rs");
}

const decriptioninput = (id) => {
  let descriptionValue = $("#description" + id).val();
  let quotation = JSON.parse(localStorage.getItem('quotation'));
  quotation = quotation.map(item => {
    if (item.id === id) {
      return { ...item, description: descriptionValue };
    }
    return item;
  });
  localStorage.setItem('quotation', JSON.stringify(quotation));
}

const priceinput = (id) => {
  let priceValue = $("#price" + id).val();
  let quotation = JSON.parse(localStorage.getItem('quotation'));
  quotation = quotation.map(item => {
    if (item.id === id) {
      return { ...item, price: priceValue };
    }
    return item;
  });
  localStorage.setItem('quotation', JSON.stringify(quotation));
  let totalprice = 0;

  quotation.forEach(element => {
    totalprice += element.price.length > 0 ? parseInt(element.price) : 0
  });

  $("#totalprice").html(parseInt(totalprice).toLocaleString() + " Rs");
}


$("#createquotation").submit(function (e) {
  e.preventDefault();

  var frm = $("#createquotation")[0];
  var frmdata = new FormData(frm);

  $.ajax({
    type: "POST",
    url: "./requiredFiles/ajax/addquotationAjax.php",
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
          title: 'Quotation',
          text: 'Successfully Quotation Created!',
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

        document.getElementById("createquotation").reset();

        $("#quotaationtable").html(`
          <tr id="1">
          <td style="width: 48%">
            <input
              class="form-control"
              list="datalistOptions"
              name="description[]"
              id="description1"
              oninput="decriptioninput(1)"
              required
            />
          </td>
          <td style="width: 48%">
            <input
              class="form-control"
              list="datalistOptions"
              type="number"
              name="price[]"
              id="price1"
              oninput="priceinput(1)"
              required
            />
          </td>
          <td style="width: 4%"></td>
        </tr>`);

        $("#totalprice").html("0 Rs");

      }
    }
  });

});