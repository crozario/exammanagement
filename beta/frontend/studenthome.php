<?php
    include_once("scripts/helper.php");
    session_start();
    check_session("student");
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Student Home</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="styles/style.css" />
    <script src="scripts/main.js"></script>

</head>

<body onload="student_home_onload(); return false;">
    <div class="nav-bar-container">
        <ul class="nav-bar">
            <li><a href="studenthome.php">Home</a></li>
        </ul>
        <button onclick="logout_button_pressed(); return false;">Logout</button>
    </div>

    <div>
        <table id="pending-exams-student">
            <tr>
                <th>Exam Name</th>
                <th>Status</th>  <!-- Take Button(exam not taken), Pending(exam taken), See Grade Button(Released)  -->
            </tr>
            <tr>
                <td>test1</td>
                <td><button onclick="location.href='takeexam.php';">Take</button></td>
            </tr>
        </table>
    </div>
</body>

</html>
