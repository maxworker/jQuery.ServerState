<?php
$params = file_get_contents('php://input');
$params = !empty($params) ? json_decode($params, true) : [];

header('Content-Type: application/json');
$message = array_key_exists("message", $params) ? $params["message"] : "Default Value";
echo json_encode((object)["message"=>$message, "result"=>"Cool! You type: $message"]);
