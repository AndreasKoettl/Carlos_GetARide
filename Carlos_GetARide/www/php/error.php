<?php

// Create new result array with an error message.
function createErrorArray($errorMessage): array
{
    return array("status" => "error", "statusmessage" => $errorMessage);
}

// Create new result array with a success message.
function createSuccessArray($successMessage): array
{
    return array("status" => "success", "statusmessage" => $successMessage);
}

// Set a error message of an existing result array.
function setErrorMessage($result, $errorMessage): array
{
    $result["status"] = "error";
    $result["statusmessage"] = $errorMessage;

    return $result;
}

// Set a success message of a
function setSuccessMessage($result, $successMessage): array
{
    $result["status"] = "success";
    $result["statusmessage"] = $successMessage;

    return $result;
}

// Check if last operation has produced an error.
function failed($result): bool {
    return (isset($result["status"]) && $result["status"] == "error");
}

// Check if last operation has produced an success.
function succeeded($result): bool {
    return (isset($result["status"]) && $result["status"] == "success");
}