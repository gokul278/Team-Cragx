<?php

require("../../Utils//DBConnection.php");

require("./verify.php");

$values = token::verify();

if ($values["status"] = "success") {

    $way = $_POST["way"];

    if ($way == "checktoken") {
        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "getdata") {
        $getquotationhistory = $con->prepare("SELECT * FROM quotation_details ORDER BY quotation_id DESC");
        $getquotationhistory->execute();
        $resquotationhistory = $getquotationhistory->get_result();

        $quotation = [];

        if ($resquotationhistory->num_rows > 0) {
            foreach ($resquotationhistory as $row) {

                $totalprice = 0;

                $getbillvalue = $con->prepare("SELECT * FROM quotation_description WHERE quotation_id=?");
                $getbillvalue->bind_param("s", $row["quotation_id"]);
                $getbillvalue->execute();
                $resbillvalue = $getbillvalue->get_result();

                foreach ($resbillvalue as $billrow) {
                    $totalprice += $billrow["quotation_price"];
                }

                $date = (new DateTime($row["createdAt"]))->format('Y-m-d');
                $data = [];
                $data["quotation_id"] = $row["quotation_id"];
                $data["company_name"] = $row["company_name"];
                $data["company_address"] = $row["company_address"];
                $data["company_email"] = $row["company_email"];
                $data["company_phoneno"] = $row["company_phoneno"];
                $data["createdAt"] = $date;
                $data["estimatedval"] = number_format($totalprice);

                array_push($quotation, $data);
            }
        }

        $response["quotation"] = $quotation;

        $response["status"] = "success";
        echo json_encode($response);
    } else if ($way == "deletequotation") {
        $quotation_id = $_POST["quotation_id"];

        $deletedetails = $con->prepare("DELETE FROM quotation_details WHERE quotation_id=?");
        $deletedetails->bind_param("s", $quotation_id);
        $deletedetails->execute();

        $deletedescription = $con->prepare("DELETE FROM quotation_description WHERE quotation_id=?");
        $deletedescription->bind_param("s", $quotation_id);
        $deletedescription->execute();

        $response["status"] = "success";
        echo json_encode($response);
    } else {
        $response["status"] = "error";
        echo json_encode($response);
    }
} else if ($values["status"] = "auth_failed") {

    $response["status"] = $values["status"];
    $response["message"] = $values["message"];
    echo json_encode($response);
}
