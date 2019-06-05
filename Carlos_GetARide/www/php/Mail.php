<?php

//require_once '../lib/phpmailer/PHPMailer.php';
//require_once '../lib/phpmailer/Exception.php';

//use \PHPMailer\PHPMailer\PHPMailer;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

class Mail
{
    const HOST = 'smtp.gmail.com';
    const SMTP_AUTH = true;
    const SENDER_MAIL = 'carlos.getaride@gmail.com';
    const SENDER_NAME = 'Carlos';
    const SENDER_PASSWORD = 'Carlos_GetARide';
    const SMTP_SECURE = 'tls';
    const PORT = 587;

    private $mail;

    private $result;

    public function __construct($recipientMail, $recipientName, $subject, $htmlBody, $altBody)
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            //$mail->SMTPDebug = 3;
            $mail->Host = self::HOST;
            $mail->Port = self::PORT;
            $mail->SMTPSecure = self::SMTP_SECURE;
            $mail->SMTPAuth = self::SMTP_AUTH;
            $mail->Username = self::SENDER_MAIL;
            $mail->Password = self::SENDER_PASSWORD;

            $mail->setFrom(self::SENDER_MAIL, self::SENDER_NAME);
            $mail->addAddress($recipientMail, $recipientName);

            $mail->CharSet ="UTF-8";

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $altBody;

            $this->mail = $mail;

            $this->result = createSuccessArray("Email erfolgreich erstellt.");
        } catch (Exception $e) {
            $this->result = createErrorArray("Email konnte nicht erstellt werden.");
        }
    }

    public function send()
    {
        try {
            $this->mail->send();

            $this->result = createSuccessArray("Email erfolgreich gesendet.");
        } catch (Exception $e) {
            $this->result = createErrorArray("Email konnte nicht versendet werden.");
        }
    }

    public function getResultArray(): array
    {
        return $this->result;
    }
}