$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/nextfilemanagerAjax.php",
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

    $("#files").html(`
        <div
                    style="
                      display: flex;
                      justify-content: center;
                      width: 100%;
                      margin-top: 20px;
                      font-size: 18px;
                    "
                  >
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
  `);

    const folder_name = new URLSearchParams(window.location.search).get('folder_name');
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/nextfilemanagerAjax.php",
        data: {
            "way": "getdata",
            "folder_name": folder_name
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.files.length > 0) {

                    $("#headernav").html(`<b
                    ><a href="./filemanager.html" style="color: #fff"
                      >File Manager</a
                    >
                    /
                    <a href="./nextfilemanager.html?folder_name=${folder_name}" style="color: #fff"
                      >${folder_name}</a
                    ></b
                  >`);
                    let files = "";

                    response.files.forEach(element => {

                        files += `
                        <div
                    style="
                      width: 95%;
                      display: flex;
                      justify-content: space-between;
                      border-bottom: solid 2px #181f4a;
                      font-size: 16px;
                    "
                  >
                    <div
                      style="
                        padding-top: 20px;
                        padding-bottom: 20px;
                        width: 90%;
                        display: flex;
                        align-items: center;
                      "
                      align="start"
                    >
                      ${element.file_name.split('_')[1]}
                    </div>
                    <div
                      style="
                        padding-top: 20px;
                        padding-bottom: 20px;
                        width: 10%;
                      "
                      class="flex flex-col"
                      align="end"
                    >
                      <div>
                        <a
                          target="_blank"
                          href="./assets/folder/${element.file_name}"
                        >
                          <i
                            class="material-icons-outlined"
                            style="color: yellow; cursor: pointer"
                            >visibility</i
                          >
                        </a>
                      </div>
                      <div>
                        <i
                          class="material-icons-outlined"
                          style="color: #3498db; cursor: pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#editrenamemodal${element.id}"
                          >edit</i
                        >
                        <div class="modal fade" id="editrenamemodal${element.id}">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                <h5 class="modal-title">Rename File</h5>
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
                                <form class="row g-3" id="editrenamefile${element.id}">
                                    <div class="col-md-12">
                                    <input type="hidden" name="way" value="filerename"/>
                                    <input type="hidden" name="fileid" value="${element.id}"/>
                                    <input type="hidden" name="old_folder_name" value="${element.file_name.split('_')[1]}"/>
                                    <input
                                        type="text"
                                        class="form-control"
                                        name="filename"
                                        value="${element.file_name.split('_')[1]}"
                                        placeholder="Enter Folder Name"
                                        required
                                    />
                                    </div>
                                    <div class="col-md-12">
                                    <div class="d-md-flex d-grid align-items-center">
                                        <button
                                        id="renamefile${element.id}"
                                        onClick="renamefile('${element.id}')"
                                        type="submit"
                                        class="btn btn-grd-danger px-4"
                                        >
                                        Rename File
                                        </button>
                                    </div>
                                    </div>
                                </form>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                      </div>
                      <div>
                        <i
                          style="color: red; cursor: pointer"
                          class="material-icons-outlined"
                          onClick="deletefile('${element.id}')"
                          >delete</i
                        >
                      </div>
                    </div>
                  </div>
                  `
                    });


                    $("#files").html(files);

                } else {
                    $("#files").html(`<div style="color:white;font-size:16px">No Files Found</div>`);
                    $("#headernav").html(`<b
                    ><a href="./filemanager.html" style="color: #fff"
                      >File Manager</a
                    >
                    /
                    <a href="./nextfilemanager.html?folder_name=${folder_name}" style="color: #fff"
                      >${folder_name}</a
                    ></b
                  >`);
                }

            } else if (response.status == "error") {
                $("#uploadbtndiv").html(`<div style="color:white;font-size:16px">
                    ${response.message}<br/><br/><br/>
                    <a href="./filemanager.html">
                        <button
                        type="button"
                        class="btn btn-grd btn-grd-primary px-4">
                        Back to Folder
                        </button>
                    </a>
                </div>`);
                $("#headernav").html(`<b
                    ><a href="./filemanager.html" style="color: #fff"
                      >File Manager</a
                    >
                    /
                    <a href="./filemanager.html" style="color: red"
                      >INVALID</a
                    ></b
                  >`);
            }
        }
    });
}

const renamefile = (id) => {

    $("#renamefile" + id).html(`<div style="display:flex">
        Loading &nbsp;<div class="loader">
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
      </div></div>`);
    $("#renamefile" + id).prop("disabled", true);

    var frm = $("#editrenamefile" + id)[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/nextfilemanagerAjax.php",
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
                    title: 'File',
                    text: 'Successfully File Renamed!',
                    effect: 'fade',
                    speed: 300,
                    customClass: '',
                    customIcon: '<i class="fa-solid fa-file"></i>',
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

                $("#renamefile" + id).prop("disabled", false);
                $("#renamefile" + id).html(`Rename File`);
                document.getElementById("editrenamefile" + id).reset();

                $("#editrenamemodal" + id).modal('hide');

                return getData();
            } else if (response.status == "error") {
                alert(response.message);
                $("#renamefile" + id).prop("disabled", false);
                $("#renamefile" + id).html(`Rename File`);
                document.getElementById("editrenamefile" + id).reset();

                $("#editrenamemodal" + id).modal('hide');
            }
        }
    });

}

const deletefile = (id) => {

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this File Data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                $("#files").html(`
                <div
                            style="
                              display: flex;
                              justify-content: center;
                              width: 100%;
                              margin-top: 20px;
                              font-size: 18px;
                            "
                          >
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
          `);


                $.ajax({
                    type: "POST",
                    url: "./requiredFiles/ajax/nextfilemanagerAjax.php",
                    data: {
                        "way": "deletefile",
                        "id": id
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



            }
        });


}