<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "addproduct") {
        $project_name = $_POST["project_name"];
        $project_link = $_POST["project_link"];
        $project_description = $_POST["project_description"];

        $profileimg = $_FILES["project_img"]["name"];
        $timestamp = date("YmdHis");
        $newImageName = $timestamp . '_' . $profileimg;

        if (move_uploaded_file($_FILES["project_img"]["tmp_name"], "../../Utils/ProjectImg/" . $newImageName)) {
            $insertproject = $con->prepare("INSERT INTO projects (project_name, project_img, project_link, project_description)
            VALUES (?,?,?,?)");
            $insertproject->bind_param("ssss", $project_name, $newImageName, $project_link, $project_description);
            $insertproject->execute();

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
