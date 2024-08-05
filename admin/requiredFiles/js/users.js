$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/usersAjax.php",
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
        url: "./requiredFiles/ajax/usersAjax.php",
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
                if (response.Users.length > 0) {
                    let usersdata = "";

                    response.Users.forEach((element, index) => {
                        usersdata += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${element.user_name}</td>
                                <td>
                                    <img
                                        src="./Utils/ProfileImg/${element.user_profileimg}"
                                        alt="${element.user_profileimg}"
                                        style="width:200px;height:200px"
                                    />
                                </td>
                                <td>
                                    <div class="col">
                                        <button
                                            type="button"
                                            class="btn btn-grd btn-grd-branding px-4"
                                            data-bs-toggle="modal"
                                            data-bs-target="#updateuser${index}"
                                        >
                                            Edit
                                        </button>
                                        <input type="hidden" id="deleteuserimg${element.userid}" value="${element.user_profileimg}" />
                                         <button
                                            id="deletebtn${element.userid}"
                                            type="button"
                                            class="btn btn-danger  px-4"
                                            onClick="deleteUser('${element.userid}')"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div class="modal fade" class="updatemodalform" id="updateuser${index}" tabindex="-1" aria-labelledby="updateuser${index}Label" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                            <h5 class="modal-title">Update Users Form</h5>
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
                                                <form class="row g-3" id="myFormupdate${index}" align="start">
                                                    <div class="mb-3" style="margin-bottom: 15px; min-width: 300px">
                                                        <label for="formFileMultiple" style="font-weight: bold; color: #fff">
                                                            Upload Image
                                                        </label>
                                                        <div style="background-color: #000; border: 1px solid #ccc; border-radius: 5px; padding: 10px;">
                                                            <input
                                                                class="form-control"
                                                                type="file"
                                                                id="profileimg${index}"
                                                                name="user_profileimg"
                                                                accept="image/*"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="name" class="form-label">Name</label>
                                                        <input type="hidden" name="way" value="updateuser" />
                                                        <input type="hidden" name="userid" value="${element.userid}" />
                                                        <input type="hidden" name="old_user_profileimg" value="${element.user_profileimg}" />
                                                        <input type="text" class="form-control" name="user_name" id="user_name${index}" placeholder="Enter Name" value="${element.user_name}" required />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="role" class="form-label">Role</label>
                                                        <input type="text" name="user_role" class="form-control" id="role${index}" placeholder="Enter Role" value="${element.user_role}" required />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="linkedin" class="form-label">LinkedIn</label>
                                                        <input type="url" name="user_linkedinlink" class="form-control" id="linkedin${index}" placeholder="Enter LinkedIn Link" value="${element.user_linkedinlink}" required />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="whatsapp" class="form-label">Whatsapp</label>
                                                        <input type="number" class="form-control" name="user_whatsapplink" id="whatsapp${index}" placeholder="Enter Whatsapp Number" value="${element.user_whatsapplink}" required />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="x" class="form-label">X</label>
                                                        <input type="url" class="form-control" id="x${index}" name="user_xlink" placeholder="Enter X Link" value="${element.user_xlink === null ? "" : element.user_xlink}" />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <label for="instagram" class="form-label">Instagram</label>
                                                        <input type="url" class="form-control" name="user_instalink" id="instagram${index}" placeholder="Enter Instagram Link" value="${element.user_instalink}" required />
                                                    </div>
                                                    <div class="col-md-12">
                                                        <div class="d-md-flex d-grid align-items-center gap-3">
                                                            <button type="submit" id="updatebtn${index}" onClick="UpdateForm('${index}')" class="btn btn-grd-danger px-4">Update</button>
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

                    $("#usersdata").html(usersdata);
                } else {
                    $("#usersdata").html("<tr><th colspan='4'>No User Found</th></tr>")
                }
            }
        }
    });
}

$("#myForm").submit(function (e) {
    e.preventDefault();

    $("#usersubmitbtn").html(`<div style="display:flex">
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
    $("#usersubmitbtn").prop("disbaled", true);

    var frm = $("#myForm")[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/usersAjax.php",
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
                    title: 'User Profile',
                    text: 'Successfully User Profile Added!',
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

                $("#FormModal").modal("hide");

                $("#usersubmitbtn").html(`Submit`);
                $("#usersubmitbtn").prop("disbaled", false);

                document.getElementById("myForm").reset();
                document.getElementById("fileName").textContent = "";
                $("#usersubmitbtn").prop("disabled", true);

                return getData();
            }
        }
    });

});

const UpdateForm = (id) => {

    $("#myFormupdate" + id).submit(function (e) {
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

        var frm = $("#myFormupdate" + id)[0];
        var frmdata = new FormData(frm);

        $.ajax({
            type: "POST",
            url: "./requiredFiles/ajax/usersAjax.php",
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
                        title: 'User Profile',
                        text: 'Successfully User Profile Updated!',
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

                    $("#updateuser" + id).modal("hide");

                    return getData();
                }
            }
        });

    });

}

const deleteUser = (id) => {

    $("#deletebtn" + id).html(`<div style="display:flex">
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
    $("#deletebtn" + id).prop("disbaled", true);

    const profileImg = $("#deleteuserimg" + id).val();

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
                    url: "./requiredFiles/ajax/usersAjax.php",
                    data: {
                        "way": "deleteProfile",
                        "userid": id,
                        "profileImg": profileImg
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
                                title: 'User Profile',
                                text: 'Successfully User Profile Deleted!',
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
            } else {
                $("#deletebtn" + id).prop("disbaled", false);
                $("#deletebtn" + id).html(`Delete`);
            }
        });


}