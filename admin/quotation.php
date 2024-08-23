<?php


require "./Utils/DBConnection.php";
require "./Utils/TCPDF-main/tcpdf.php";
$quotation_id = $_POST["quotation_id"];

$getquotation = $con->prepare("SELECT * FROM quotation_details WHERE quotation_id=?");
$getquotation->bind_param("s", $quotation_id);
$getquotation->execute();
$resquotation = $getquotation->get_result()->fetch_assoc();

$company_name = $resquotation["company_name"];
$company_address = $resquotation["company_address"];
$company_email = $resquotation["company_email"];
$company_phoneno = $resquotation["company_phoneno"];
$date = (new DateTime($resquotation["createdAt"]))->format('d-m-Y');

$totalprice = 0;
$content = "";

$getdescription = $con->prepare("SELECT * FROM quotation_description WHERE quotation_id=?");
$getdescription->bind_param("s", $quotation_id);
$getdescription->execute();
$resdescription = $getdescription->get_result();

if ($resdescription->num_rows > 0) {
    foreach ($resdescription as $row) {
        $totalprice += $row["quotation_price"];
        $amount = number_format($row["quotation_price"]);
        $content .= '
        <tr style="width:100%">
            <th style="width:60%;border:1.5px solid grey;" align="center">' . $row["quotation_description"] . '</th>
            <th style="width:40%;border:1.5px solid grey;" align="center">' . $amount . '</th>
        </tr>
        ';
    }
}

$totalprice = number_format($totalprice);

// Create a new PDF document
$pdf = new TCPDF();

// Set margins and disable auto page breaks
$pdf->SetMargins(0, 4.6, 0);

// Set document title
$pdf->SetTitle('Estimated Quotation');

// Remove header and footer
$pdf->SetPrintHeader(false);
// $pdf->SetPrintFooter(false);

// Add a new page to the PDF
$pdf->AddPage();

// Define HTML content
$html = '    
   <table style="100%;" align="center">
   <tr><th></th></tr>
   <tr style="width:80%">
    <th style="width:50%;"><img style="width:200px" src="./Utils/Logo/Cragx Text-Logo - Light.jpg" /></th>
    <th style="width:45%;display:flex;" align="right"><div style="font-size:30px;color:grey;"><br>Quotation</div></th>
   </tr>
   <tr style="width:100%;padding:0;margin:0">
    <th style="width:7%"></th>
        <th style="width:30%;" align="start">
            <div style="font-size:12px;width:100%">1st Street Thokkavadi,
                Tiruchengode - 637215.<br>E-Mail: <b>teamcragx@gmail.com</b> <br>Phone No: <b>+91 8838041597</b>
            </div>
        </th>
        <th style="width:26%"></th>
        <th style="width:30%" align="right">
            <div style="font-size:12px;width:100%">
                <table>
                    <tr style="width:100px;">
                        <th>Date:</th>
                        <th align="start">   <b>' . $date . '</b></th>
                    </tr>
                    <tr style="width:100px;">
                        <th>Quoatation ID:</th>
                        <th align="start">   <b>' . $quotation_id . '</b></th>
                    </tr>
                </table>
            </div>
        </th>
   </tr>
   <tr>
   <th>
   </th>
   </tr>
   <tr style="width:100%;padding:0;margin:0">
   <th style="width:7%;background-color:#2f4455;"></th>
   <th style="width:40%;background-color:#2f4455;color:white" align="start"><b style="color:#2f4455">  </b>
   <br><span style="font-size:20px;color:white"><b>Billings To :</b></span><br>
        <br>' . $company_name . ',
        <br>' . $company_address . '.
        <br>E-Mail: <b style="color:#33f5c6">' . $company_email . '</b>
        <br>Phone No: <b style="color:#33f5c6">' . $company_phoneno . '</b><br>
    </th>
   </tr>
   <tr>
   <th>
   </th>
   </tr>
   <tr>
   <th>
   </th>
   </tr>
   <tr>
   <th style="width:7%"></th>
    <th style="width:86%">
        <table style="width:100%" cellpadding="8"> 
            <tr style="width:100%">
                <th style="width:60%;background-color:#1ecfe1;border:1.5px solid grey;" align="center">Description</th>
                <th style="width:40%;background-color:#1ecfe1;border:1.5px solid grey;" align="center">Amounts</th>
            </tr>
            ' . $content . '
             <tr style="width:100%">
                <th style="width:60%;border:1.5px solid grey;background-color:#2f4455;color:white;font-size:17px" align="right"><b>TOTAL AMOUNT</b></th>
                <th style="width:40%;border:1.5px solid grey;background-color:#2f4455;color:white;font-size:17px" align="center"><b>Rs ' . $totalprice . '</b></th>
            </tr>
        </table>
    </th>
   </tr>
   <tr>
   <th>
   </th>
   </tr>
   <tr>
   <th>
   </th>
   </tr>
   <tr style="width:100%">
   <th style="width:100%">
   <b>THANK YOU FOR YOUR BUSINESS!</b>
   </th>
   </tr>
   </table>
';

// Write the HTML content into the PDF
$pdf->writeHTML($html);

// Output the PDF as a file download
$pdf->Output('Quotation_'.$company_name.'.pdf', 'I'); // 'I' means inline output to browser

exit;
