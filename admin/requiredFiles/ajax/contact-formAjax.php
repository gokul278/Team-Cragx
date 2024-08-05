<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "nonvisited") {
        $nonvisted = [];

        $getnonvisted = $con->prepare("SELECT * FROM contactus  WHERE conatct_viewstatus='submitted'");
        $getnonvisted->execute();

        $resgetnonvisted = $getnonvisted->get_result();

        if ($resgetnonvisted->num_rows > 0) {
            foreach ($resgetnonvisted as $row) {
                $data = [];
                $data["id"] = $row["id"];
                $data["contact_name"] = $row["contact_name"];
                $data["contact_mobileno"] = $row["contact_mobileno"];
                $data["contact_email"] = $row["contact_email"];
                $data["contact_message"] = $row["contact_message"];
                $data["createdAt"] = $row["createdAt"];

                array_push($nonvisted, $data);
            }
        }

        $response["table"] = "nonvisted";
        $response["nonvisted"] = $nonvisted;
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "visited") {
        $visted = [];

        $getvisted = $con->prepare("SELECT * FROM contactus  WHERE conatct_viewstatus='viewed'");
        $getvisted->execute();

        $resgetvisted = $getvisted->get_result();

        if ($resgetvisted->num_rows > 0) {
            foreach ($resgetvisted as $row) {
                $data = [];
                $data["contact_name"] = $row["contact_name"];
                $data["contact_mobileno"] = $row["contact_mobileno"];
                $data["contact_email"] = $row["contact_email"];
                $data["contact_message"] = $row["contact_message"];
                $data["createdAt"] = $row["createdAt"];

                array_push($visted, $data);
            }
        }

        $response["table"] = "visted";
        $response["visted"] = $visted;
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "changestatus") {
        $id = $_POST["id"];


        $updatestatus = $con->prepare("UPDATE contactus SET conatct_viewstatus='viewed' WHERE id=?");
        $updatestatus->bind_param("s", $id);
        $updatestatus->execute();

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
