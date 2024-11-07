<?php
require_once('phpmailer/class.phpmailer.php');
require_once('phpmailer/class.smtp.php');

// Initialize response array
$response = array(
    'status' => 'error',
    'message' => ''
);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate required fields
    if (!empty($_POST['form_name']) && !empty($_POST['email']) && !empty($_POST['form_subject'])) {
        
        $name = $_POST['form_name'];
        $email = $_POST['email'];
        $subject = $_POST['form_subject'];
        $phone = $_POST['form_phone'];
        $message = $_POST['form_message'];
        $botcheck = $_POST['form_botcheck'];

        // Check if it's not a bot
        if ($botcheck == '') {
            $mail = new PHPMailer();
            
            // Configure SMTP
            $mail->isSMTP();
            $mail->Host = 'in-v3.mailjet.com';
            $mail->SMTPAuth = true;
            $mail->Port = 587;
            $mail->Username = 'f49b68b1154b568060585a4d4be7b9c6'; // Replace with your Mailjet API Key
            $mail->Password = '333a587ab6b208a33994830b0fea4fc6'; // Replace with your Mailjet Secret Key
            $mail->SMTPSecure = 'tls';
            
            // Set email content
            $mail->setFrom($email, $name);
            $mail->addAddress('ashref1944@gmail.com', 'Ashref Bna'); // Replace with your recipient email
            $mail->Subject = $subject;
            
            // Build email body
            $body = "Name: $name<br><br>";
            $body .= "Email: $email<br><br>";
            $body .= "Phone: $phone<br><br>";
            $body .= "Message: $message<br><br>";
            $body .= "Sent from: " . $_SERVER['HTTP_REFERER'];
            
            $mail->isHTML(true);
            $mail->Body = $body;
            
            // Send email
            if ($mail->send()) {
                $response['status'] = 'success';
                $response['message'] = 'Thank you! Your message has been sent successfully.';
            } else {
                $response['message'] = 'Sorry, there was an error sending your message: ' . $mail->ErrorInfo;
            }
        } else {
            $response['message'] = 'Bot detected! Please try again.';
        }
    } else {
        $response['message'] = 'Please fill in all required fields.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?> 