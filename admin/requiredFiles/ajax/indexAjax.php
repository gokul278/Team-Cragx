<?php

require "../../Utils/DBConnection.php";
require("../../Utils/php_jwt/vendor/autoload.php");

use Firebase\JWT\JWT;

$way = $_POST["way"];

if ($way == "login") {

    $username = $_POST["useremail"];
    $password = $_POST["password"];
    $loggedin = $_POST["loggedin"];

    $checkdetail = $con->prepare("SELECT * FROM login_credentials WHERE username=?");
    $checkdetail->bind_param("s", $username);
    $checkdetail->execute();

    $rescheckdetail = $checkdetail->get_result();

    if ($rescheckdetail->num_rows > 0) {
        $row = $rescheckdetail->fetch_assoc();
        if ($row["password"] == $password) {

            $key = "$2y$10xq0IENjFqETtqzBJN4r5HuAs/E1wF4K4Z33OIAgbbndbdtUh6ZTEAMCRAGX";

            if ($loggedin == "false") {

                $token = JWT::encode(
                    array(
                        'iat' => time(),
                        'nbf' => time(),
                        'exp' => time() + 3600,
                        'data' => array(
                            'useremail' => $username
                        )
                    ),
                    $key,
                    'HS256'
                );
                setcookie("token", $token, time() + 43200, "/", "", true, true);
            } else {

                $token = JWT::encode(
                    array(
                        'iat' => time(),
                        'nbf' => time(),
                        'data' => array(
                            'useremail' => $username
                        )
                    ),
                    $key,
                    'HS256'
                );
                setcookie("token", $token, 0, "/", "", true, true);
            }

            $response["status"] = "success";
            echo json_encode($response);

        } else {
            $response["status"] = "failed";
            $response["message"] = "Invalid Password";
            echo json_encode($response);
        }
    } else {
        $response["status"] = "failed";
        $response["message"] = "Invalid Username";
        echo json_encode($response);
    }
} else {
    $response["status"] = "error";
    echo json_encode($response);
}
