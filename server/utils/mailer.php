<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

class Mailer {
    public static function sendRegistrationConfirmation($email, $first_name) {
        $mail = new PHPMailer(true);
        try {
           
            $mail->isSMTP();
            $mail->Host = 'sandbox.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Username = '4e477622c4cbc4';
            $mail->Password = 'c6c7f4b6162a0a'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 2525;

            
            $mail->setFrom('no-reply@shelfwise.com', 'ShelfWise');
            $mail->addAddress($email);

            
            $mail->isHTML(false);
            $mail->Subject = 'Welcome to ShelfWise!';
            $mail->Body = "Dear $first_name,\n\nThank you for registering with ShelfWise. Your account has been created successfully.\n\nBest regards,\nThe ShelfWise Team";

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send email to $email: {$mail->ErrorInfo}");
            return false;
        }
    }
}
?>