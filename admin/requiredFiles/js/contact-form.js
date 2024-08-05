$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/contact-formAjax.php",
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
                return changetable();
            }
        }
    });
});

const changetable = () => {
    const tableselector = $("#table-selector").val();

    $.ajax({
        type: "POST",
        url: "./requiredFiles/ajax/contact-formAjax.php",
        data: {
            "way": tableselector
        },
        success: function (res) {
            var response = JSON.parse(res);

            if (response.status == "auth_failed" && response.message == "Expired token") {

                location.replace("time_expried.php");

            } else if (response.status == "auth_failed") {

                location.replace("unauth_login.php");

            } else if (response.status == "success") {

                if (response.table == "nonvisted") {

                    if (response.nonvisted.length > 0) {
                        let contacttable = "";
                        response.nonvisted.forEach((element, index) => {
                            contacttable += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${element.createdAt}</td>
                                <td>${element.contact_name}</td>
                                <td>${element.contact_mobileno}</td>
                                <td>${element.contact_email}</td>
                                <td>${element.contact_message}</td>
                                <td><button id="changebtn${element.id}" type="button" class="btn btn-grd btn-grd-branding px-4" onClick="changestatus('${element.id}')">Change Status<br/> to Viewed</button></td>
                            </tr>
                            `;
                        });

                        $("#contacttable").html(contacttable);
                    } else {
                        $("#contacttable").html(`<tr><th colspan="7">No Request Yet</th></tr>`);
                    }

                } else if (response.table == "visted") {

                    if (response.visted.length > 0) {
                        let contacttable = "";
                        response.visted.forEach((element, index) => {
                            contacttable += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${element.createdAt}</td>
                                <td>${element.contact_name}</td>
                                <td>${element.contact_mobileno}</td>
                                <td>${element.contact_email}</td>
                                <td>${element.contact_message}</td>
                                <td style="color:green">viewed</td>
                            </tr>
                            `;
                        });

                        $("#contacttable").html(contacttable);
                    } else {
                        $("#contacttable").html(`<tr><th colspan="7">No Request Yet</th></tr>`);
                    }

                }

            }
        }
    });
}

const changestatus = (id) => {

    $("#changebtn"+id).html(`<div style="display:flex">
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
    $("#changebtn"+id).prop("disbaled", true);

    swal({
        title: "Are you sure?",
        text: "You Want to Change Status!",
        icon: "warning",
        buttons: true,
        buttons: ["No", "Yes"],
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    type: "POST",
                    url: "./requiredFiles/ajax/contact-formAjax.php",
                    data: {
                        "way": "changestatus",
                        "id": id
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
                                title: 'Conatact Us Status',
                                text: 'Successfully Status Changed as Viewed!',
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
                            return changetable();
                        }
                    }
                });
            }else{
                $("#changebtn"+id).html(`Change Status<br/> to Viewed`);
                $("#changebtn"+id).prop("disbaled", false);
            
            }
        });

}