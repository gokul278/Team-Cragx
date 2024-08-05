$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/editservicesAjax.php",
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
        url: "./requiredFiles/ajax/editservicesAjax.php",
        data: {
            "way": "getData"
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.services.length > 0) {

                    let services = "";

                    response.services.forEach((element, index) => {

                        services += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                            <img
                                src="./Utils/ServiceImg/${element.service_img}"
                                style="width:100px;height:100px"
                            />
                            </td>
                            <td>${element.service_name}</td>
                            <td>
                            <div class="col">
                                <button
                                type="button"
                                class="btn btn-grd btn-grd-branding px-4"
                                data-bs-toggle="modal"
                                data-bs-target="#FormModal${element.service_id}"
                                >
                                Edit
                                </button>
                                <button
                                id="deletebtn${element.service_id}"
                                type="button"
                                class="btn btn-danger px-4"
                                onClick="deleteservice('${element.service_id}')"
                                >
                                Delete
                                </button>
                            </div>
                            <div class="modal fade" id="FormModal${element.service_id}">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                    <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                        <h5 class="modal-title">Services Edit</h5>
                                        <a
                                        href="javascript:;"
                                        class="primaery-menu-close"
                                        data-bs-dismiss="modal"
                                        >
                                        <i class="material-icons-outlined">close</i>
                                        </a>
                                    </div>
                                    <div class="modal-body">
                                    <div class="form-body">
                                    <form class="row g-3" id="updateservice${element.service_id}" align="start">
                                        <div class="mb-3" style="margin-bottom: 15px; min-width: 300px">
                                        <label
                                            for="formFileMultiple"
                                            style="font-weight: bold; color: #fff"
                                            >Upload Image</label
                                        >
                                        <div
                                            style="
                                            background-color: #000;
                                            border: 1px solid #ccc;
                                            border-radius: 5px;
                                            padding: 10px;
                                            "
                                        >
                                            <input
                                            class="form-control mt-2"
                                            type="file"
                                            id="formFileMultiple"
                                            name="service_img"
                                            accept="image/*"
                                            />
                                        </div>
                                        </div>
                                        <div class="col-md-12">
                                        <label for="services" class="form-label">Service Name</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="service_name"
                                            id="services"
                                            value="${element.service_name}"
                                            placeholder="Enter Service Name"
                                        />
                                        </div>
                                        <div class="col-md-12">
                                        <label for="description" class="form-label"
                                            >Service Description</label
                                        >
                                        <input type="hidden" name="service_id" value="${element.service_id}" />
                                        <input type="hidden" name="way" value="updateservice" />
                                        <input type="hidden" id="service_img${element.service_id}" name="service_img" value="${element.service_img}" />
                                        <textarea
                                            class="form-control"
                                            id="description"
                                            name="service_description"
                                            placeholder="Enter Description"
                                            rows="5"
                                        >${element.service_description}</textarea>
                                        </div>

                                        <div class="col-md-12">
                                        <div class="d-md-flex d-grid align-items-center gap-3">
                                            <button
                                            id="updatebtn${element.service_id}"
                                            type="submit"
                                            class="btn btn-grd-danger px-4"
                                            onClick="updateservice('${element.service_id}')"
                                            >
                                            Update
                                            </button>
                                        </div>
                                        </div>
                                    </form>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            </td>
                        </tr>
                        `;

                    });

                    $("#servicedata").html(services)

                } else {
                    $("#servicedata").html(`<tr><th colspan="4">No Services Found</th></tr>`)
                }

            }
        }
    })
};

const updateservice = (id) => {
    $("#updateservice" + id).submit(function (e) {
        e.preventDefault();

        $("#updatebtn"+id).html(`<div style="display:flex">
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
                          </div>`);
        $("#updatebtn"+id).prop("disbaled", true);

        var frm = $("#updateservice" + id)[0];
        var frmdata = new FormData(frm);

        $.ajax({
            type: "POST",
            url: "./requiredFiles/ajax/editservicesAjax.php",
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
                        text: 'Successfully Service Updated!',
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

                    $("#FormModal" + id).modal('hide');
                    return getData();
                }
            }
        });

    });
}

const deleteservice = (id) => {
    const service_img = $("#service_img" + id).val();

    $("#deletebtn"+id).html(`<div style="display:flex">
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
                      </div>`);
    $("#deletebtn"+id).prop("disbaled", true);

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    type: "POST",
                    url: "./requiredFiles/ajax/editservicesAjax.php",
                    data: {
                        "way": "deleteservice",
                        "service_id": id,
                        "service_img": service_img
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
                                title: 'Service',
                                text: 'Successfully Service Deleted!',
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
                            return getData();
                        }
                    }
                });
            }else{
                $("#deletebtn"+id).html(`Delete`);
                $("#deletebtn"+id).prop("disbaled", false);
            }
        });
}