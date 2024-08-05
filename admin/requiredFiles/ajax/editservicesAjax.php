<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "getData") {
        $getData = $con->prepare("SELECT * FROM services");
        $getData->execute();
        $resgetData = $getData->get_result();

        $Services = [];

        if ($resgetData->num_rows > 0) {
            foreach ($resgetData as $row) {
                $data = [];

                $data["service_id"] = $row["id"];
                $data["service_name"] = $row["service_name"];
                $data["service_img"] = $row["service_img"];
                $data["service_description"] = $row["service_description"];

                array_push($Services, $data);
            }
        }

        $response["services"] = $Services;
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "updateservice") {

        $service_img = $_FILES["service_img"]["name"];

        $service_id = $_POST["service_id"];
        $service_name = $_POST["service_name"];
        $service_description = $_POST["service_description"];

        if (strlen($service_img) > 0) {
            $profileimg = $_FILES["service_img"]["name"];
            $timestamp = date("YmdHis");
            $newImageName = $timestamp . '_' . $profileimg;
            $old_service_img = $_POST["service_img"];

            if (unlink("../../Utils/ServiceImg/" . $old_service_img)) {
                if (move_uploaded_file($_FILES["service_img"]["tmp_name"], "../../Utils/ServiceImg/" . $newImageName)) {
                    $updateService = $con->prepare("UPDATE services SET service_name=?, service_img=?, service_description=? WHERE id=?");
                    $updateService->bind_param("ssss", $service_name, $newImageName, $service_description, $service_id);
                    $updateService->execute();

                    $response["status"] = "success";
                    echo json_encode($response);
                }
            }
        } else {
            $updateService = $con->prepare("UPDATE services SET service_name=?, service_description=? WHERE id=?");
            $updateService->bind_param("sss", $service_name, $service_description, $service_id);
            $updateService->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "deleteservice") {
        $service_id = $_POST["service_id"];
        $service_img = $_POST["service_img"];

        if (unlink("../../Utils/ServiceImg/" . $service_img)) {
            $deleteservice = $con->prepare("DELETE FROM services WHERE id=?");
            $deleteservice->bind_param("s", $service_id);
            $deleteservice->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else {
        $response["status"] = "errordd";
        echo json_encode($response);
    }
} else if ($values["status"] == "auth_failed") {

    $response["status"] = $values["status"];
    $response["message"] = $values["message"];
    echo json_encode($response);
}
