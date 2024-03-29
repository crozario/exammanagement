<?php
session_start();
include_once("scripts/helper.php");
check_session("instructor");
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Instructor Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="styles/style.css" />
    <script src="scripts/main.js"></script>

</head>

<body onload="exam_review_list_onload(); return false;">

    <div class="nav-bar-container">
        <div class="nav-bar-left">
            <a class="active" href="instructorhome.php">Home</a>
            <a href="instructorexams.php">Create Exams</a>
            <a href="questionbank.php">Question Bank</a>
        </div>
          
        <div class="nav-bar-right">
            <a class="nav-bar-user"></a>
            <button onclick="logout_button_pressed(); return false;">Logout</button>
        </div>
        
    </div>

    <div class="exam-review-list-page">
        <table id="exam-review-list">
            <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Review</th>
            </tr>
        </table>
    </div>

</body>

</html>