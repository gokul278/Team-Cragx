<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] == "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "createdquotation") {

        $company_name = $_POST["company_name"];
        $company_address = $_POST["company_address"];
        $company_email = $_POST["company_email"];
        $company_phoneno = $_POST["company_phoneno"];

        $description = $_POST["description"];
        $price = $_POST["price"];

        $quotation_id = 1001;

        $getid = $con->prepare("SELECT max(quotation_id) as quotation_id FROM quotation_details");
        $getid->execute();
        $resgetid = $getid->get_result()->fetch_assoc();

        if ($resgetid["quotation_id"] > 0) {
            $quotation_id = $resgetid["quotation_id"] + 1;
        }

        $quotation_details = $con->prepare("INSERT INTO quotation_details (quotation_id, company_name, company_address, company_email, company_phoneno)
        VALUES (?,?,?,?,?)");
        $quotation_details->bind_param("sssss", $quotation_id, $company_name, $company_address, $company_email, $company_phoneno);
        $quotation_details->execute();

        for ($i = 0; $i < count($description); $i++) {
            $descriptionval = $description[$i];
            $priceval = $price[$i];

            $quotation_description = $con->prepare("INSERT INTO quotation_description (quotation_id, quotation_description, quotation_price)
            VALUES (?,?,?)");
            $quotation_description->bind_param("sss", $quotation_id, $descriptionval, $priceval);
            $quotation_description->execute();
        }

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
