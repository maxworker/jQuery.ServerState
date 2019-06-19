<?php
header('Content-Type: application/json');
$message = array_key_exists("message", $_REQUEST) ? $_REQUEST["message"] : "Default!!!";
echo json_encode((object)["message"=>$message, "result"=>"Cool! You type: $message"]);
                                                                           