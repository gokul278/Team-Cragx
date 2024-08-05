<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "addservice") {
        $profileimg = $_FILES["service_img"]["name"];
        $timestamp = date("YmdHis");
        $newImageName = $timestamp . '_' . $profileimg;

        $service_name = $_POST["service_name"];
        $service_description = $_POST["service_description"];

        if (move_uploaded_file($_FILES["service_img"]["tmp_name"], "../../Utils/ServiceImg/" . $newImageName)) {
            $insertservice = $con->prepare("INSERT INTO services (service_name, service_img, service_description)
            VALUES (?,?,?)");
            $insertservice->bind_param("sss", $service_name, $newImageName, $service_description);
            $insertservice->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else {
        $response["status"] = "error";
        echo json_encode($response);
    }
} else if ($values["status"] == "auth_failed") {

    $response["status"] = $values["status"];
    $response["message"] = $values["message"];
    echo json_encode($response);
}
