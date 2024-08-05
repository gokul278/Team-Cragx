<?php

require("./DBConnection.php");

$way = $_POST["way"];

if ($way == "getServices") {
    $services = [];

    $getData = $con->prepare("SELECT * FROM services");
    $getData->execute();
    $resgetData = $getData->get_result();

    if ($resgetData->num_rows > 0) {
        foreach ($resgetData as $row) {
            $data = [];

            $data["service_name"] = $row["service_name"];
            $data["service_img"] = $row["service_img"];
            $data["service_description"] = $row["service_description"];

            array_push($services, $data);
        }
    }

    $response["services"] = $services;
    $response["status"] = "success";
    echo json_encode($response);
} else if ($way == "getprojects") {
    $projects = [];

    $getData = $con->prepare("SELECT * FROM projects");
    $getData->execute();
    $resgetData = $getData->get_result();

    if ($resgetData->num_rows > 0) {
        foreach ($resgetData as $row) {
            $data = [];

            $data["project_name"] = $row["project_name"];
            $data["project_img"] = $row["project_img"];
            $data["project_link"] = $row["project_link"];
            $data["project_description"] = $row["project_description"];

            array_push($projects, $data);
        }
    }

    $response["projects"] = $projects;
    $response["status"] = "success";
    echo json_encode($response);
} else if ($way == "getusers") {
    $users = [];

    $getData = $con->prepare("SELECT * FROM users");
    $getData->execute();
    $resgetData = $getData->get_result();

    if ($resgetData->num_rows > 0) {
        foreach ($resgetData as $row) {
            $data = [];

            $data["user_name"] = $row["user_name"];
            $data["user_profileimg"] = $row["user_profileimg"];
            $data["user_role"] = $row["user_role"];
            $data["user_linkedinlink"] = $row["user_linkedinlink"];
            $data["user_whatsapplink"] = $row["user_whatsapplink"];
            $data["user_xlink"] = $row["user_xlink"];
            $data["user_instalink"] = $row["user_instalink"];

            array_push($users, $data);
        }
    }

    $response["users"] = $users;
    $response["status"] = "success";
    echo json_encode($response);
} else if ($way == "subscribeemail") {
    $subscribeemail = $_POST["subscribeemail"];

    $getData = $con->prepare("SELECT * FROM subscribes WHERE subscribe_email=?");
    $getData->bind_Param("s", $subscribeemail);
    $getData->execute();
    $resgetData = $getData->get_result();

    if ($resgetData->num_rows > 0) {

        $response["status"] = "error";
        echo json_encode($response);
    } else {

        $addsubscribe = $con->prepare("INSERT INTO subscribes (subscribe_email, adminview_status)
        VALUES (?,'subscribed')");
        $addsubscribe->bind_param("s", $subscribeemail);
        $addsubscribe->execute();

        $response["status"] = "success";
        echo json_encode($response);
    }
} else if ($way == "submitcontact") {
    $name = $_POST["name"];
    $mobilenumber = $_POST["mobilenumber"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $createContact = $con->prepare("INSERT INTO contactus (contact_name, contact_mobileno, contact_email, contact_message, conatct_viewstatus)
    VALUES (?,?,?,?,'submitted')");
    $createContact->bind_param("ssss", $name, $mobilenumber, $email, $message);
    $createContact->execute();

    $response["status"] = "success";
    echo json_encode($response);
}
