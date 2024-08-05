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

        $getData = $con->prepare("SELECT * FROM users");
        $getData->execute();
        $resgetData = $getData->get_result();

        $UsersData = [];

        if ($resgetData->num_rows > 0) {

            foreach ($resgetData as $row) {
                $data = [];

                $data["userid"] = $row["id"];
                $data["user_name"] = $row["user_name"];
                $data["user_role"] = $row["user_role"];
                $data["user_profileimg"] = $row["user_profileimg"];
                $data["user_linkedinlink"] = $row["user_linkedinlink"];
                $data["user_whatsapplink"] = $row["user_whatsapplink"];
                $data["user_xlink"] = $row["user_xlink"];
                $data["user_instalink"] = $row["user_instalink"];

                array_push($UsersData, $data);
            }
        }

        $response["Users"] = $UsersData;
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "newuser") {

        $profileimg = $_FILES["user_profileimg"]["name"];
        $timestamp = date("YmdHis");
        $newImageName = $timestamp . '_' . $profileimg;

        $user_name = $_POST["user_name"];
        $user_role = $_POST["user_role"];
        $user_linkedinlink = $_POST["user_linkedinlink"];
        $user_whatsapplink = $_POST["user_whatsapplink"];
        $user_xlink = strlen($_POST["user_xlink"]) > 0 ? $_POST["user_xlink"] : null;
        $user_instalink = $_POST["user_instalink"];

        if (move_uploaded_file($_FILES["user_profileimg"]["tmp_name"], "../../Utils/ProfileImg/" . $newImageName)) {
            $createuser = $con->prepare("INSERT INTO users (user_name,user_profileimg,user_role,user_linkedinlink,user_whatsapplink,user_xlink,user_instalink)
            VALUES (?,?,?,?,?,?,?)");
            $createuser->bind_param("sssssss", $user_name, $newImageName, $user_role, $user_linkedinlink, $user_whatsapplink, $user_xlink, $user_instalink);
            $createuser->execute();

            $response["status"] = "success";
            echo json_encode($response);
        } else {
            $response["status"] = "error";
            echo json_encode($response);
        }
    } else if ($way == "updateuser") {

        $profileimg = $_FILES["user_profileimg"]["name"];

        $userid = $_POST["userid"];
        $user_name = $_POST["user_name"];
        $user_role = $_POST["user_role"];
        $user_linkedinlink = $_POST["user_linkedinlink"];
        $user_whatsapplink = $_POST["user_whatsapplink"];
        $user_xlink = strlen($_POST["user_xlink"]) > 0 ? $_POST["user_xlink"] : null;
        $user_instalink = $_POST["user_instalink"];

        if (strlen($profileimg) > 0) {
            $timestamp = date("YmdHis");
            $newImageName = $timestamp . '_' . $profileimg;
            $old_user_profileimg = $_POST["old_user_profileimg"];

            if (unlink("../../Utils/ProfileImg/" . $old_user_profileimg)) {
                if (move_uploaded_file($_FILES["user_profileimg"]["tmp_name"], "../../Utils/ProfileImg/" . $newImageName)) {
                    $createuser = $con->prepare("UPDATE users SET user_name=?, user_profileimg =?, user_role=?, user_linkedinlink=?, user_whatsapplink=?, user_xlink=?, user_instalink=? WHERE id=?");
                    $createuser->bind_param("ssssssss", $user_name, $newImageName, $user_role, $user_linkedinlink, $user_whatsapplink, $user_xlink, $user_instalink, $userid);
                    $createuser->execute();

                    $response["status"] = "success";
                    echo json_encode($response);
                } else {
                    $response["status"] = "error";
                    echo json_encode($response);
                }
            }
        } else {
            $createuser = $con->prepare("UPDATE users SET user_name = ?, user_role =?, user_linkedinlink=?, user_whatsapplink=?, user_xlink=?, user_instalink=? WHERE id=?");
            $createuser->bind_param("sssssss", $user_name, $user_role, $user_linkedinlink, $user_whatsapplink, $user_xlink, $user_instalink, $userid);
            $createuser->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else if ($way == "deleteProfile") {
        $userid = $_POST["userid"];
        $profileimg = $_POST["profileImg"];

        if (unlink("../../Utils/ProfileImg/" . $profileimg)) {
            $deleteUser = $con->prepare("DELETE FROM users WHERE id=?");
            $deleteUser->bind_param("s", $userid);
            $deleteUser->execute();

            $response["status"] = "success";
            echo json_encode($response);
        }
    } else {
        $response["status"] = "errorww";
        echo json_encode($response);
    }
} else if ($values["status"] == "auth_failed") {

    $response["status"] = $values["status"];
    $response["message"] = $values["message"];
    echo json_encode($response);
}
