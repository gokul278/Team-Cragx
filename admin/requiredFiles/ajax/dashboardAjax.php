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
    } else if ($way == "checkgraph") {
        $year = $_POST["year"];
        $monthdata = [];
        $max = 0;

        for ($i = 1; $i <= 12; $i++) {
            $data = $con->prepare("SELECT * FROM quotation_description WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ?");
            $data->bind_param("ii", $year, $i);
            $data->execute();
            $result = $data->get_result();

            $val = 0;

            while ($row = $result->fetch_assoc()) {
                $val += $row["quotation_price"];
            }

            if ($val >= $max) {
                $max = $val;
            }

            array_push($monthdata, $val);
        }

        $response["maxval"] = $max;
        $response["data"] = $monthdata;

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
