$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/filemanagerAjax.php",
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

    $("#folder").html(`
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
        url: "./requiredFiles/ajax/filemanagerAjax.php",
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

                if (response.folder.length > 0) {

                    let folder = "";

                    response.folder.forEach((element, index) => {
                        folder += `
                        <div style="width: 110px; height: 168px">
                    <div
                      style="
                        width: 110px;
                        height: 120px;
                        background-color: #181f4a;
                        border-radius: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                      "
                    >
                      <div
                        style="
                          margin-top: 2px;
                          width: 100%;
                          display: flex;
                          justify-content: end;
                          margin-right: 10px;
                          column-gap: 5px;
                        "
                      >
                        <i
                          class="material-icons-outlined"
                          style="color: #3498db"
                          data-bs-toggle="modal"
                          data-bs-target="#editrenamemodal${index}"
                          >edit</i
                        >
                        
                        <div class="modal fade" id="editrenamemodal${index}">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header border-bottom-0 py-2 bg-grd-info">
                                <h5 class="modal-title">Rename Folder</h5>
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
                                <form class="row g-3" id="editrenameForm${index}">
                                    <div class="col-md-12">
                                    <input type="hidden" name="way" value="renamefolder" />
                                    <input type="hidden" name="id" value="${element.id}" />
                                    <input
                                        type="text"
                                        class="form-control"
                                        name="foldername"
                                        placeholder="Enter Folder Name"
                                        value="${element.folder_name}"
                                        required
                                    />
                                    </div>
                                    <div class="col-md-12">
                                    <div class="d-md-flex d-grid align-items-center">
                                        <button
                                        id="editfoldername${index}"
                                        onClick="renamefolder('${index}')"
                                        type="submit"
                                        class="btn btn-grd-danger px-4"
                                        >
                                        Rename Folder
                                        </button>
                                    </div>
                                    </div>
                                </form>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <i style="color: red" class="material-icons-outlined"
                        onClick="deletefolder('${element.id}')"
                          >delete</i
                        >
                      </div>
                      <a href="./nextfilemanager.html?folder_name=${element.folder_name}">
                        <img
                          src="./assets/images/folderimg.png"
                          alt="folderlogo"
                          style="width: 85px;margin-top: 5px;"
                        />
                      </a>
                    </div>
                    <p style="margin-top: 2px; font-size: 15px">${element.folder_name}</p>
                  </div>
                  `;
                    });

                    $("#folder").html(folder);

                } else {
                    $("#folder").html(`
                        <div
                    style="
                      display: flex;
                      justify-content: center;
                      width: 100%;
                      margin-top: 20px;
                      font-size: 18px;
                    "
                  >
                    No Folder Found
                  </div>
                  `);
                }
            }
        }
    });
}


$("#myForm").submit(function (e) {
    e.preventDefault();

    $("#createfolderbtn").prop("disabled", true);
    $("#createfolderbtn").html(`<div style="display:flex">
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
      </div></div>`)


    var frm = $("#myForm")[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/filemanagerAjax.php",
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
                    title: 'Folder',
                    text: 'Successfully Folder Created!',
                    effect: 'fade',
                    speed: 300,
                    customClass: '',
                    customIcon: '<i class="fa-solid fa-folder-plus"></i>',
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

                $("#createfolderbtn").prop("disabled", false);
                $("#createfolderbtn").html(`Create Folder`);
                document.getElementById("myForm").reset();

                $("#createfolderModal").modal('hide');

                return getData();
            } else if (response.status == "error") {
                alert(response.message);
                $("#createfolderbtn").prop("disabled", false);
                $("#createfolderbtn").html(`Create Folder`);
                document.getElementById("myForm").reset();

                $("#createfolderModal").modal('hide');
            }
        }
    });

});

const renamefolder = (id) => {

    $("#editfoldername" + id).prop("disabled", true);
    $("#editfoldername" + id).html(`<div style="display:flex">
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
      </div></div>`)


    var frm = $("#editrenameForm" + id)[0];
    var frmdata = new FormData(frm);

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/filemanagerAjax.php",
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
                    title: 'Folder',
                    text: 'Successfully Folder Renamed!',
                    effect: 'fade',
                    speed: 300,
                    customClass: '',
                    customIcon: '<i class="fa-solid fa-folder-plus"></i>',
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

                $("#editrenamemodal" + id).modal('hide');

                return getData();
            } else if (response.status == "error") {
                alert(response.message);
                $("#editfoldername" + id).prop("disabled", false);
                $("#editfoldername" + id).html(`Create Folder`);
                document.getElementById("myForm").reset();

                $("#editrenamemodal" + id).modal('hide');
            }
        }
    });

}

const deletefolder = (id) =>{

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this Folder Data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {

            $("#folder").html(`
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
            url: "./requiredFiles/ajax/filemanagerAjax.php",
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