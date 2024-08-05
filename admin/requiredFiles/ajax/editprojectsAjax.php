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

        $getData = $con->prepare("SELECT * FROM projects");
        $getData->execute();
        $resgetData = $getData->get_result();

        $projects = [];

        if ($resgetData->num_rows > 0) {
            foreach ($resgetData as $row) {
                $data = [];

                $data["id"] = $row["id"];
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
    } else if ($way == "updateproject") {
        $id = $_POST["id"];
        $project_name = $_POST["project_name"];
        $project_link = $_POST["project_link"];
        $project_description = $_POST["project_description"];

        $project_img = $_FILES["project_img"]["name"];

        if (strlen($project_img) > 0) {
            $profileimg = $_FILES["project_img"]["name"];
            $timestamp = date("YmdHis");
            $newImageName = $timestamp . '_' . $profileimg;
            $old_service_img = $_POST["old_project_img"];

            if (unlink("../../Utils/ProjectImg/" . $old_service_img)) {
                if (move_uploaded_file($_FILES["project_img"]["tmp_name"], "../../Utils/ProjectImg/" . $newImageName)) {
                    $updateproject = $con->prepare("UPDATE projects SET project_name=?, project_img=?, project_link=?, project_description=? WHERE id=?");
                    $updateproject->bind_param("sssss", $project_name, $newImageName, $project_link, $project_description, $id);
                    $updateproject->execute();

                    $response["status"] = "success";
                    echo json_encode($response);
                }
            }
        } else {
            $updateproject = $con->prepare("UPDATE projects SET project_name=?, project_link=?, project_description=? WHERE id=?");
            $updateproject->bind_param("ssss", $project_name, $project_link, $project_description, $id);
            $updateproject->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "deleteproject") {
        $id = $_POST["id"];
        $project_img = $_POST["project_img"];

        if (unlink("../../Utils/ProjectImg/" . $project_img)) {
            $deleteservice = $con->prepare("DELETE FROM projects WHERE id=?");
            $deleteservice->bind_param("s", $id);
            $deleteservice->execute();

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
