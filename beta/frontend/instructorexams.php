<?php
    include_once("scripts/helper.php");
    session_start();
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

<body onload="instructor_exams_onload(); return false;">

    <div>
        <div class="nav-bar-container">
            <ul class="nav-bar">
                <li><a href="instructorhome.php">Home</a></li>
                <li><a href="instructorexams.php">Create Exams</a></li>
                <li><a href="questionbank.php">Question Bank</a></li>
            </ul>
            <button onclick="logout_button_pressed(); return false;">Logout</button>
        </div>


        <!-- <div class="exam-list">
            <h2>Exam List</h2>
            <div></div>
            <div class="add-exam-container">
                <input class="add-exam-input" type="text" placeholder="Enter Exam Name" name="exam_name" required>
                <button class="add-exam-button" type="button" onclick="add_exam_button_pressed();">Add Exam</button>
            </div>
            <div>
                <table id="exam-list-table">
                    <tr>
                        <th>Exam Name</th>
                        <th>Graded</th>
                        <th>Grades Released</th>
                    </tr>
                    <tr>
                        <td>Testasdfas101</td>
                        <td>N/td>
                        <td>logic, turtle</td>

                    </tr>
                </table>
            </div>

        </div> -->


        <div class="question-bank-container">
            <h2>Question Bank</h2>
            <div>
                <table id="question-bank-table-exams">
                    <tr>
                        <th>Topic</th>
                        <th>Difficulty</th>
                        <th>Question</th>
                    </tr>
                    <!-- <tr>
                        <td>Conditional</td>
                        <td>Hard</td>
                        <td>Given a string name, e.g. "Bob", return a greeting of the form "Hello Bob!".</td>
                        <td><button>Add</button></td>
                    </tr> -->

                </table>
            </div>

        </div>

        <div class="add-exam-container">
            <h2>Create Exam</h2>
            <div>
                <input id="add-exam-input" type="text" placeholder="Enter Exam Name" name="exam_name" required>
            </div>
            <div>
                <table id="add-exam-table">
                    <tr>
                        <th>Topic</th>
                        <th>Difficulty</th>
                        <th>Question</th>
                        <th>Points</th>
                    </tr>

                </table>
            </div>
            <div>
                <button class="add-exam-button" type="button" onclick="add_exam_button_pressed(); return false;">Add Exam</button>
            </div>

        </div>

    </div>

</body>

</html>