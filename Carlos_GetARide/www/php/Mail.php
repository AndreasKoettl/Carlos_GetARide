<?php

require_once '../lib/phpmailer/PHPMailer.php';
require_once '../lib/phpmailer/Exception.php';

use \PHPMailer\PHPMailer\PHPMailer;

class Mail
{
    const HOST = "localhost";
    const SMTP_AUTH = true;
    const SENDER_MAIL = "carlos_getaride@gmail.com";
    const SENDER_NAME = "Carlos Get A Ride";
    const SENDER_PASSWORD = "Carlos_GetARide";
    const SMTPSecure = "tls";
    const PORT = 587;

    private $mail;

    private $result;

    public function __construct($recipientMail, $recipientName, $subject, $htmlBody, $altBody)
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = self::HOST;
            $mail->SMTPAuth = self::SMTP_AUTH;
            $mail->Username = self::SENDER_MAIL;
            $mail->Password = self::SENDER_PASSWORD;
            $mail->SMTPSecure = self::SMTPSecure;
            $mail->Port = self::PORT;

            $mail->setFrom(self::SENDER_MAIL, self::SENDER_NAME);
            $mail->addAddress($recipientMail, $recipientName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $altBody;

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