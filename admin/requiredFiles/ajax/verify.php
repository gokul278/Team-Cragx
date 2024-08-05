<?php

require "../../Utils/php_jwt/vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class token
{
    static function verify()
    {
        if (isset($_COOKIE['token'])) {

            $key = "$2y$10xq0IENjFqETtqzBJN4r5HuAs/E1wF4K4Z33OIAgbbndbdtUh6ZTEAMCRAGX";

            try {

                $token = $_COOKIE['token'];
                $decoded = JWT::decode($token, new Key($key, 'HS256'));

                $useremail = $decoded->data->useremail;
                $response["useremail"] = $useremail;
                $response["status"] = "success";
                return $response;
            } catch (Exception $e) {

                $response["status"] = "auth_failed";
                $response["message"] = $e->getMessage();
                return $response;
            }
        } else {

            $response["status"] = "auth_failed";
            $response["message"] = "Invalid Token";
            return $response;
        }
    }
}
