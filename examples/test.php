<?php
header('Content-Type: application/json');

$result = '';
foreach ($_POST as $key => $value) {
    $result .= $key.' = '.var_export($value, true)."\n";
}

echo json_encode((object)["result"=>$result]);
