<?php

require("../../Utils/DBConnection.php");
require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "getdata") {
        $folder_name = $_POST["folder_name"];

        $checkfoldername = $con->prepare("SELECT * FROM folder WHERE folder_name=?");
        $checkfoldername->bind_param("s", $folder_name);
        $checkfoldername->execute();
        $rescheckfoldername = $checkfoldername->get_result();

        if ($rescheckfoldername->num_rows > 0) {

            $files = [];

            $getfile = $con->prepare("SELECT * FROM files WHERE folder_name=?");
            $getfile->bind_param("s", $folder_name);
            $getfile->execute();
            $resgetfile = $getfile->get_result();

            if ($resgetfile->num_rows > 0) {
                foreach ($resgetfile as  $row) {
                    $data = [];
                    $data["id"] = $row["id"];
                    $data["file_name"] = $row["file_name"];

                    array_push($files, $data);
                }
            }

            $response["files"] = $files;

            $response["status"] = "success";
            echo json_encode($response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Invalid FolderName";
            echo json_encode($response);
        }
    } else if ($way == "uploadfile") {
        // Handle file uploads
        if (isset($_FILES['file_name'])) {
            $uploadDir = '../../assets/folder/';

            $response = [];
            foreach ($_FILES['file_name']['name'] as $key => $name) {
                if ($_FILES['file_name']['error'][$key] === UPLOAD_ERR_OK) {
                    $timestamp = date("YmdHis");
                    $tmpName = $_FILES['file_name']['tmp_name'][$key];
                    $fileName = basename($name);
                    $filePath = $uploadDir .  $timestamp . "_" . $fileName;

                    $newfilename  = $timestamp . "_" . $fileName;

                    if (move_uploaded_file($tmpName, $filePath)) {
                        // Insert file information into the database
                        $stmt = $con->prepare("INSERT INTO files (file_name, folder_name) VALUES (?, ?)");
                        $stmt->bind_param("ss", $newfilename, $_POST['folder_name']);
                        $stmt->execute();
                    } else {
                        $response[] = [
                            "status" => "error",
                            "file_name" => $fileName,
                            "message" => "Failed to upload file"
                        ];
                    }
                } else {
                    $response[] = [
                        "status" => "error",
                        "file_name" => $name,
                        "message" => "Error during file upload"
                    ];
                }
            }

            $response["status"] = "success";
            echo json_encode($response);
        } else {
            $response["status"] = "error";
            $response["message"] = "No files uploaded";
            echo json_encode($response);
        }
    } else if ($way == "filerename") {
        $id = $_POST["fileid"];

        $getfile = $con->prepare("SELECT * FROM files WHERE id=?");
        $getfile->bind_param("s", $id);
        $getfile->execute();
        $resgetfile = $getfile->get_result()->fetch_assoc();

        $filenameid = $result = explode('_', $resgetfile["file_name"])[0];

        $old_folder_name = $filenameid . "_" . $_POST["old_folder_name"];
        $filename = $filenameid . "_" . $_POST["filename"];

        $currentFilePath = '../../assets/folder/' . $old_folder_name;
        $newFilePath = '../../assets/folder/' . $filename;

        if (rename($currentFilePath, $newFilePath)) {

            $updatefilename = $con->prepare("UPDATE files SET file_name=? WHERE id=?");
            $updatefilename->bind_param("ss", $filename, $id);
            $updatefilename->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "deletefile") {
        $id = $_POST["id"];

        $getfile = $con->prepare("SELECT * FROM files WHERE id=?");
        $getfile->bind_param("s", $id);
        $getfile->execute();
        $resgetfile = $getfile->get_result()->fetch_assoc();

        if (unlink("../../assets/folder/" . $resgetfile["file_name"])) {

            $deletefile = $con->prepare("DELETE FROM files WHERE id=?");
            $deletefile->bind_param("s", $id);
            $deletefile->execute();

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
