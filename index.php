<?php

require_once __DIR__ . "/lib/w2g-tools-sync-server.php";

// config
const AUTH_TOKEN = "<redacted>";
const STORAGE_FILE = __DIR__ . "/data/sync-storage.json";

// CORS fuckery
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: x-sync-token");
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
     die();
}

// create storage and server
$storage_provider = new \w2gtools\sync\json_storage_provider(STORAGE_FILE);
$server = new \w2gtools\sync\sync_server($storage_provider);

if (!array_key_exists("HTTP_X_SYNC_TOKEN", $_SERVER)) {
    http_response_code(400);
    die(json_encode([ "error" => "MISSING_TOKEN" ]));
}

$token = $_SERVER["HTTP_X_SYNC_TOKEN"];
if ($token !== AUTH_TOKEN) {
    http_response_code(401);
    die(json_encode(["error" => "INCORRECT_TOKEN"]));
}

// parse request
$uri = $_SERVER["REQUEST_URI"];
$request_url = parse_url($uri);
$path = $request_url["path"];

// routing
if ($path === "/playlist/get-titles") {
    die(json_encode([ "titles" => $server->get_video_titles() ]));
} else if ($path === "/playlist/set-title") {
    if (!array_key_exists("url", $_GET) || !array_key_exists("title", $_GET)) {
        http_response_code(400);
        die(json_encode(["error" => "INVALID_REQUEST"]));
    }

    $url = $_GET["url"];
    $title = $_GET["title"];

    if (empty($url)) {
        http_response_code(400);
        die(json_encode(["error" => "INVALID_REQUEST"]));
    }

    if (strpos($url, "http://") !== 0 && strpos($url, "https://") !== 0) {
        http_response_code(400);
        die(json_encode(["error" => "INVALID_URL"]));
    }

    $server->rename_video($url, $title);

    die(json_encode([ "error" => null ]));
} else {
    http_response_code(404);
    die(json_encode([ "error" => "NOT_FOUND" ]));
}
