$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/editprojectsAjax.php",
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
        url: "./requiredFiles/ajax/editprojectsAjax.php",
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

                if (response.projects.length > 0) {

                    let projects = "";

                    response.projects.forEach((element, index) => {

                        projects += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <img
                                src="./Utils/ProjectImg/${element.project_img}"
                                style="width: 100px;height: 100px;"
                                />
                            </td>
                            <td style="text-transform: uppercase">${element.project_name}</td>
                            <td>
                                <div class="col">
                                <button
                                    type="button"
                                    class="btn btn-grd btn-grd-branding px-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#FormModal${element.id}"
                                >
                                    Edit
                                </button>
                                 <button
                                    id="deletebtn${element.id}"
                                    type="button"
                                    class="btn btn-danger px-4"
                                    onClick="deleteproject('${element.id}')"
                                >
                                    Delete
                                </button>
                                </div>
                                <div class="modal fade" id="FormModal${element.id}">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                        <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                            <h5 class="modal-title">Projects Edit</h5>
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
                                            <form class="row g-3" id="updateproject${element.id}" align="start">
                                                <input type="hidden" name="way" value="updateproject" />
                                                <input type="hidden" name="id" value="${element.id}" />
                                                <input type="hidden" id="profile_img${element.id}" name="old_project_img" value="${element.project_img}" />
                                                <div class="mb-3" style="margin-bottom: 15px; min-width: 300px">
                                                <label
                                                    for="formFileMultiple"
                                                    style="font-weight: bold; color: #fff"
                                                    >Project Image</label
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
                                                    class="form-control"
                                                    type="file"
                                                    id="formFileMultiple"
                                                    name="project_img"
                                                    accept="image/*"
                                                    />
                                                </div>
                                                </div>
                                                <div class="col-md-12">
                                                <label for="project" class="form-label">Project Name</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="project"
                                                    name="project_name"
                                                    placeholder="Enter Project Name"
                                                    value="${element.project_name}"
                                                />
                                                </div>

                                                <div class="col-md-12">
                                                <label for="link" class="form-label">Project Link</label>
                                                <input
                                                    type="url"
                                                    class="form-control"
                                                    id="url"
                                                    name="project_link"
                                                    placeholder="Enter Project Link"
                                                    value="${element.project_link}"
                                                    required
                                                />
                                                </div>

                                                <div class="col-md-12">
                                                <label for="description" class="form-label"
                                                    >Project Description</label
                                                >
                                                <textarea
                                                    class="form-control"
                                                    id="description"
                                                    name="project_description"
                                                    placeholder="Enter Project Description"
                                                    rows="5"
                                                >${element.project_description}</textarea>
                                                </div>

                                                <div class="col-md-12">
                                                <div class="d-md-flex d-grid align-items-center gap-3">
                                                    <button
                                                    id="updatebtn${element.id}"
                                                    type="button"
                                                    class="btn btn-grd-danger px-4"
                                                    onclick="updateproject('${element.id}')"
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

                    $("#projectsdata").html(projects);

                } else {
                    $("#projectsdata").html(`<tr><th colspan="4">No Services Found</th></tr>`)
                }

            }
        }
    })
}

const updateproject = (id) => {

    $("#updatebtn" + id).html(`<div style="display:flex">
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
    $("#updatebtn" + id).prop("disbaled", true);

    var frm = $("#updateproject" + id)[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/editprojectsAjax.php",
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
                    title: 'Project',
                    text: 'Successfully Project Updated!',
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
}

const deleteproject = (id) => {
    const project_img = $("#profile_img" + id).val();

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
                    url: "./requiredFiles/ajax/editprojectsAjax.php",
                    data: {
                        "way": "deleteproject",
                        "id": id,
                        "project_img": project_img

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
                                title: 'Project',
                                text: 'Successfully Project Deleted!',
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
                $("#deletebtn" + id).html(`Delete`);
                $("#deletebtn" + id).prop("disbaled", false);
            }
        });
}