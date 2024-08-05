<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "getdata") {
        $getsubscribescount = $con->prepare("SELECT COUNT(id) as totalsubscribe FROM subscribes WHERE adminview_status='subscribed'");
        $getsubscribescount->execute();

        $resgetsubscribescount = $getsubscribescount->get_result()->fetch_assoc();

        $getcontactuscount = $con->prepare("SELECT COUNT(id) as totalcontactus FROM contactus WHERE conatct_viewstatus='submitted'");
        $getcontactuscount->execute();

        $resgetcontactuscount = $getcontactuscount->get_result()->fetch_assoc();

        $response["totalsubscribe"] = $resgetsubscribescount["totalsubscribe"];
        $response["totalcontactus"] = $resgetcontactuscount["totalcontactus"];
        $response["status"] = "success";
        echo json_encode($response);
    } else {
        $response["status"] = "error";
        echo json_encode($response);
    }
} else if ($values["status"] == "auth_failed") {

    $response["status"] = $values["status"];
    $response["message"] = $values["message"];
    echo json_encode($response);
}
