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

        $folder = [];

        $getfolder = $con->prepare("SELECT * FROM folder");
        $getfolder->execute();

        $resgetfolder = $getfolder->get_result();

        if ($resgetfolder->num_rows > 0) {

            foreach ($resgetfolder as $row) {
                $data = [];

                $data["id"] = $row["id"];
                $data["folder_name"] = $row["folder_name"];

                array_push($folder, $data);
            }
        }

        $response["folder"] = $folder;

        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "createfolder") {

        $foldername = $_POST["foldername"];

        $getfoldername = $con->prepare("SELECT * FROM folder WHERE folder_name=?");
        $getfoldername->bind_param("s", $foldername);
        $getfoldername->execute();

        $resgetfoldername = $getfoldername->get_result();

        if ($resgetfoldername->num_rows > 0) {

            $response["status"] = "error";
            $response["message"] = "Folder Name Already Exits";
            echo json_encode($response);
        } else {

            $createfolder = $con->prepare("INSERT INTO folder (folder_name) VALUES (?)");
            $createfolder->bind_param("s", $foldername);
            $createfolder->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "renamefolder") {

        $id = $_POST["id"];
        $foldername = $_POST["foldername"];

        $getfoldername = $con->prepare("SELECT * FROM folder WHERE folder_name=?");
        $getfoldername->bind_param("s", $foldername);
        $getfoldername->execute();

        $resgetfoldername = $getfoldername->get_result();

        if ($resgetfoldername->num_rows > 0) {
            $response["status"] = "error";
            $response["message"] = "Folder Name Already Exits";
            echo json_encode($response);
        } else {

            $getfolder = $con->prepare("SELECT * FROM folder WHERE id=?");
            $getfolder->bind_param("s", $id);
            $getfolder->execute();
            $resgetfolder = $getfolder->get_result()->fetch_assoc();

            $updatefilefolder = $con->prepare("UPDATE files SET folder_name=? WHERE folder_name=?");
            $updatefilefolder->bind_param("ss", $foldername, $resgetfolder["folder_name"]);
            $updatefilefolder->execute();

            $updatefoldername = $con->prepare("UPDATE folder SET folder_name=? WHERE id=?");
            $updatefoldername->bind_param("ss", $foldername, $id);
            $updatefoldername->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "deletefile") {
        $id = $_POST["id"];

        $getfoldername = $con->prepare("SELECT * FROM folder WHERE id=?");
        $getfoldername->bind_param("s", $id);
        $getfoldername->execute();
        $resgetfoldername = $getfoldername->get_result()->fetch_assoc();

        $getfiles = $con->prepare("SELECT * FROM files WHERE folder_name=?");
        $getfiles->bind_param("s", $resgetfoldername["folder_name"]);
        $getfiles->execute();
        $resgetfile = $getfiles->get_result();

        if ($resgetfile->num_rows > 0) {

            foreach ($resgetfile as $row) {
                if (unlink("../../assets/folder/" . $row["file_name"])) {
                    $deletefile = $con->prepare("DELETE FROM files WHERE id=?");
                    $deletefile->bind_param("s", $row["id"]);
                    $deletefile->execute();
                }
            }
        }

        $deletefolder = $con->prepare("DELETE FROM folder WHERE id=?");
        $deletefolder->bind_param("s", $id);
        $deletefolder->execute();

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
