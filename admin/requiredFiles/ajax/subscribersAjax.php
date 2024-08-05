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
        $subscribes = [];

        $getsubscribe = $con->prepare("SELECT * FROM subscribes ORDER BY id DESC;");
        $getsubscribe->execute();
        $resgetsubscribe = $getsubscribe->get_result();

        if ($resgetsubscribe->num_rows > 0) {

            foreach ($resgetsubscribe as $row) {
                $data = [];

                $data["subscribe_email"] = $row["subscribe_email"];
                $data["createdAt"] = $row["createdAt"];

                array_push($subscribes, $data);
            }
        }

        $response["subscribes"] = $subscribes;
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
