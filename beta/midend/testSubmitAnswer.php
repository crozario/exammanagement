<?php
/**
 * Created by IntelliJ IDEA.
 * User: furqan
 * Date: 10/15/18
 * Time: 10:09 PM
 */
//change this to addanswer later on
//submits student's answers
//$answer = "def operation (op, a, b):
//    if op == '+':
//        print  a+b
//    elif op == '-':
//        print a-b
//    elif op == '*':
//        print a*b
//    elif op == '/':
//        print a/b
//    else:
//        print \"error\"";

//$data = array(
//    'user'=>'ez90',
//    'exam'=>'exam1',
//    'answer'=>addslashes($answer)
//);

//$url = "https://web.njit.edu/~eo65/cs490/beta/backend/testSubmitQuestion.php";
//sendAnswers($data, $url);
var_dump($_POST);

//exit();
//should actually receive the user and exam name from front
$answer = $_POST['answer'];
$username = $_POST['user_name'];
$examname= $_POST['exam_name'];

$data = array(
    'user'=>$username,
    'exam'=>$examname,
    'answer'=>rawurlencode($answer)
);
echo rawurldecode($_POST['answer']);

//for ($x=0; $x<count($answersArray);$x++){
//    $data = array(
//        'user'=>$username,
//        'exam'=>$examname,
//        "answer"=>addslashes($answersArray[$x])
//    );
//    sendAnswers($data, $url);
//}

//backend table format: userid, examid, question, answer
// grade answers
//$url = "https://web.njit.edu/~ak697/cs490/cs490-beta/gradetest.php";
sendAnswers($data);

function sendAnswers($data){
    $url = "https://web.njit.edu/~eo65/cs490/beta/backend/testSubmitQuestion.php";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//    echo '<br>';
    //die is also called if the response is empty
    $response = curl_exec($ch) or die("Curl to $url didn't work");
//    var_dump($data);
//    print_r($response );
    curl_close($ch);
}
