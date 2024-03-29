var question_bank_array;
var question_bank_exams_array;
var take_exam_name = "";

var topic_options_array = ["functions", "loops", "strings", "conditionals", "arrays", "recursion"];
var difficulty_options_array = ["easy", "medium", "hard"];
var constraint_options_array = ["none", "for", "while", "recursion"];
var difficulty_options_filtering_array= ["none", "easy", "medium", "hard"];
var topic_options_filtering_array = ["none", "functions", "loops", "strings", "conditionals", "arrays", "recursion"];


class Question {
    constructor(question, topic, difficulty) {
        this.question = question;
        this.topic = topic;
        this.difficulty = difficulty;
    }
}

// function index_onload() {
//     var status_id = document.getElementById("status");  
//     status_id.style.display = "none";
// }

// Login 
function login_button_pressed() {
    var username = document.getElementsByName("username")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var vars = "login=true" + "&username=" + username + "&password=" + password;
    var status_id = document.getElementById("status");

    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                var json_response = JSON.parse(req.responseText);   
                var login_response = json_response.login;
                if (login_response == "student") {
                    location.href = "studenthome.php";
                } else if (login_response == "instructor") {
                    location.href = "instructorhome.php";
                } else if (login_response == "fail") {
                    
                    incorrect_username_or_password_notification();
                } else {
                    // error
                    status_id.innerHTML = login_response;
                }
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function incorrect_username_or_password_notification() {
    document.getElementById("login-form").reset();
    var status_id = document.getElementById("status");
    status_id.style.display = "block";
    status_id.style.opacity = 1;
    status_id.addEventListener('click', fadeOutEffect);
    setTimeout(function(){ 
        status_id.click();
    }, 1500);
}


function fadeOutEffect() {
    var fadeTarget = document.getElementById("status");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 50); 
}



// Logout 

function logout_button_pressed() {
    var vars = "logout=true";
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {

                location.href = "index.php";
                
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);

}

function set_navbar_user_info(user_type) {
    get_username(gotUsername);

    function gotUsername(data) {
        var username = data;
        var user_info = document.getElementsByClassName("nav-bar-user");
        user_info[0].innerHTML = user_type + " | " + username;
    }
}

// Instructor Home 
function instructor_home_onload() {

    set_navbar_user_info("Instructor");

    var table = document.getElementById("pending-exams");
    var vars = "get_pending_exams=true";
    var req = new XMLHttpRequest();


    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                var json_response = JSON.parse(req.responseText);
                var exams = json_response;
                // alert(req.responseText);
                // alert(exams.length);
                for (var i = 0; i < exams.length; i++) {
                    var exam = exams[i].exam;
                    var row = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    var cell2 = document.createElement("td");
                    cell1.appendChild(document.createTextNode(exam));
                    cell2.appendChild(add_review_list_button(exam));
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    table.children[0].appendChild(row);

                }

                if(exams.length == 0) {
                    no_exams_available(table);
                }
                
                // status_id.innerHTML = req.responseText;
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function add_review_list_button(exam) {
    var button = document.createElement("button");
    button.innerHTML = "Review";
    button.onclick = function () {
        
        save_instructor_home_review(exam);
    };
    return button;
}

function save_instructor_home_review(exam) {
    var vars = "save_instructor_home_review=" + exam;
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {                       
                location.href = "examreviewlist.php";
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function get_instructor_home_review(callback) {
    var vars = "get_instructor_home_review=true";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

// Instructor Exams

function instructor_exams_onload() {
    add_topic_options_filtering_instructor_exams();
    add_difficulty_options_filtering_instructor_exams(); 

    set_navbar_user_info("Instructor");

    var table = document.getElementById("question-bank-table-exams");
    var vars = "get_question_bank=true";
    var req = new XMLHttpRequest();


    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                var json_response = JSON.parse(req.responseText);
                question_bank_exams_array = new Array();

                for (var i = 0; i < json_response.length; i++) {
                    var question = json_response[i].questionbody;
                    var topic = json_response[i].topic;
                    var difficulty = json_response[i].difficulty;

                    var row = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    var cell2 = document.createElement("td");
                    var cell3 = document.createElement("td");
                    var cell4 = document.createElement("td");
                    cell1.appendChild(document.createTextNode(topic));
                    cell2.appendChild(document.createTextNode(difficulty));
                    cell3.appendChild(document.createTextNode(question));
                    cell4.appendChild(create_question_bank_button(question, topic, difficulty));
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    row.appendChild(cell3);
                    row.appendChild(cell4);
                    table.children[0].appendChild(row);
                    var question_temp = new Question(question, topic, difficulty);
                    question_bank_exams_array.push(question_temp);
                }
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}


function create_question_bank_button(question, topic, difficulty) {
    var button = document.createElement("button");
    button.innerHTML = "Add";
    button.onclick = function () {
        add_question_to_exam(question, topic, difficulty);
    };
    return button;
}

function add_question_to_exam(question, topic, difficulty) {
    var table = document.getElementById("add-exam-table");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    var cell4 = document.createElement("td");
    cell1.appendChild(document.createTextNode(topic));
    cell2.appendChild(document.createTextNode(difficulty));
    cell3.appendChild(document.createTextNode(question));
    cell4.appendChild(add_point_input());
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    table.children[0].appendChild(row);
}

function add_point_input() {
    var input = document.createElement("input");
    input.type = "text";
    input.size = "5";
    return input;
}
function add_exam_button_pressed() {

    var exam_name = document.getElementsByName("exam_name")[0].value;
    var questions = get_exam_questions();
    var points = get_exam_points();
    var vars = "send_exam=true&exam_name=" + exam_name + "&questions=" + questions + "&points=" + points;
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                clear_create_exam();
                


            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);

}

function clear_create_exam(){
    var table = document.getElementById("add-exam-table");
    document.getElementById("add-exam-input").value = "";
    while (table.rows.length > 1) {
        table.deleteRow(table.rows.length-1);

    }
}

function get_exam_questions() {
    var table = document.getElementById("add-exam-table");
    var questions_array = new Array();

    for (var r = 1, n = table.rows.length; r < n; r++) {
        var question = table.rows[r].cells[2].innerHTML;
        questions_array.push(question);
    }
    return JSON.stringify(questions_array);
}

function get_exam_points() {
    var table = document.getElementById("add-exam-table");
    var points_array = new Array();

    for (var r = 1, n = table.rows.length; r < n; r++) {
        var points = table.rows[r].cells[3].children[0].value;
        points_array.push(points);
    }
    return JSON.stringify(points_array);
}

// Question Bank
function question_bank_onload() {
    add_topic_options();
    add_difficulty_options();
    add_constraint_options();
    add_difficulty_options_filtering_question_bank()
    add_topic_options_filtering_question_bank()

    set_navbar_user_info("Instructor");

    var table = document.getElementById("question-bank-table");
    var vars = "get_question_bank=true";
    var req = new XMLHttpRequest();


    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                var json_response = JSON.parse(req.responseText);
                question_bank_array = new Array();

                for (var i = 0; i < json_response.length; i++) {
                    var question = json_response[i].questionbody;
                    var topic = json_response[i].topic;
                    var difficulty = json_response[i].difficulty;

                    var row = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    var cell2 = document.createElement("td");
                    var cell3 = document.createElement("td");
                    cell1.appendChild(document.createTextNode(topic));
                    cell2.appendChild(document.createTextNode(difficulty));
                    cell3.appendChild(document.createTextNode(question));
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    row.appendChild(cell3);
                    table.children[0].appendChild(row);
                    var question_temp = new Question(question, topic, difficulty);
                    question_bank_array.push(question_temp);
                }

            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function filter_button_pressed_question_bank() {
    var filter_topic_option = document.getElementById("topic-select-filtering");
    var filter_topic_value = filter_topic_option.options[filter_topic_option.selectedIndex].value;
    var difficulty_topic_option = document.getElementById("difficulty-select-filtering");
    var difficulty_topic_value = difficulty_topic_option.options[difficulty_topic_option.selectedIndex].value;
    var keywords = document.getElementById("keyword-filter-name").value;
    table_id = "question-bank-table";
    clear_question_bank(table_id);
    new_question_bank = new Array();

    for(var i = 0; i <question_bank_array.length; i++) {
        if(question_bank_array[i].topic == filter_topic_value || filter_topic_value == "none") {
            if(question_bank_array[i].difficulty == difficulty_topic_value || difficulty_topic_value == "none") {
                if(keyword_in_question_bank(keywords, question_bank_array[i].question) == true || keywords.length < 1)
                    new_question_bank.push(question_bank_array[i]);
            }     
        }
    }

    add_to_question_bank_from_array(new_question_bank, table_id);

}

function filtering_reset_button_pressed_question_bank() {
    table_id = "question-bank-table";
    clear_question_bank(table_id);
    add_to_question_bank_from_array(question_bank_array, table_id)
}

function keyword_in_question_bank(keywords, question) {
    var keyword_array = keywords.split(',');
    var temp = false;
    for (var i = 0; i < keyword_array.length; i++) {
        var word = keyword_array[i];
        if(question.includes(word)) {
            temp = true;
        } else {
            temp = false
        }

    }
    // alert(temp);
    return temp;
    
}

function add_to_question_bank_from_array(new_question_bank, table_id) {
    var table = document.getElementById(table_id);
    for (var i = 0; i < new_question_bank.length; i++) {
        var question = new_question_bank[i].question;
        var topic = new_question_bank[i].topic;
        var difficulty = new_question_bank[i].difficulty;

        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        cell1.appendChild(document.createTextNode(topic));
        cell2.appendChild(document.createTextNode(difficulty));
        cell3.appendChild(document.createTextNode(question));
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        table.children[0].appendChild(row);
    }
}

function clear_question_bank(table_id) {
    var table = document.getElementById(table_id);
    for(var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function filter_button_pressed_instructor_exam() {
   
    var filter_topic_option = document.getElementById("topic-select-filtering-instructor");
    var filter_topic_value = filter_topic_option.options[filter_topic_option.selectedIndex].value;
    var difficulty_topic_option = document.getElementById("difficulty-select-filtering-instructor");
    var difficulty_topic_value = difficulty_topic_option.options[difficulty_topic_option.selectedIndex].value;
    var keywords = document.getElementById("keyword-filter-name-instructor").value;
    
    table_id = "question-bank-table-exams";
    clear_question_bank(table_id);
    new_question_bank = new Array();

    for(var i = 0; i <question_bank_exams_array.length; i++) {
        if(question_bank_exams_array[i].topic == filter_topic_value || filter_topic_value == "none") {
            if(question_bank_exams_array[i].difficulty == difficulty_topic_value || difficulty_topic_value == "none") {
                if(keyword_in_question_bank(keywords, question_bank_exams_array[i].question) == true || keywords.length < 1)
                    new_question_bank.push(question_bank_exams_array[i]);
            }     
        }
    }

    add_to_question_bank_from_array_instructor_exams(new_question_bank, table_id);
}

function filtering_reset_button_pressed_instructor_exam() {
    table_id = "question-bank-table-exams";
    clear_question_bank(table_id);
    add_to_question_bank_from_array_instructor_exams(question_bank_exams_array, table_id);
}



function add_to_question_bank_from_array_instructor_exams(new_question_bank, table_id) {
    var table = document.getElementById(table_id);
    for (var i = 0; i < new_question_bank.length; i++) {
        var question = new_question_bank[i].question;
        var topic = new_question_bank[i].topic;
        var difficulty = new_question_bank[i].difficulty;

        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        cell1.appendChild(document.createTextNode(topic));
        cell2.appendChild(document.createTextNode(difficulty));
        cell3.appendChild(document.createTextNode(question));
        cell4.appendChild(create_question_bank_button(question, topic, difficulty));
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        table.children[0].appendChild(row);
    }
}

function add_difficulty_options() {
    var difficulty_div = document.getElementById("difficulty-select-question-bank");

    var select_list = document.createElement("select");
    select_list.id = "difficulty-select";
    difficulty_div.appendChild(select_list);

    for (var i = 0; i < difficulty_options_array.length; i++) {
        var option = document.createElement("option");
        option.value = difficulty_options_array[i];
        option.text = difficulty_options_array[i];
        select_list.appendChild(option);
    }
}

function add_topic_options() {

    var topic_div= document.getElementById("topic-select-question-bank");

    var select_list = document.createElement("select");
    select_list.id = "topic-select";
    topic_div.appendChild(select_list);

    for (var i = 0; i < topic_options_array.length; i++) {
        var option = document.createElement("option");
        option.value = topic_options_array[i];
        option.text = topic_options_array[i];
        select_list.appendChild(option);
    }
}

function add_constraint_options() {
    var constraint_div = document.getElementById("constraint-select-question-bank");

    var select_list = document.createElement("select");
    select_list.id = "constraint-select";
    constraint_div.appendChild(select_list);

    for (var i = 0; i < constraint_options_array.length; i++) {
        var option = document.createElement("option");
        option.value = constraint_options_array[i];
        option.text = constraint_options_array[i];
        select_list.appendChild(option);
    }
}

function add_difficulty_options_filtering_question_bank() {
    var difficulty_div= document.getElementById("difficulty-select-filtering-question-bank");

    var select_list = document.createElement("select");
    select_list.id = "difficulty-select-filtering";
    difficulty_div.appendChild(select_list);

    for (var i = 0; i < difficulty_options_filtering_array.length; i++) {
        var option = document.createElement("option");
        option.value = difficulty_options_filtering_array[i];
        option.text = difficulty_options_filtering_array[i];
        select_list.appendChild(option);
    }
}

function add_topic_options_filtering_question_bank() {

    var topic_div= document.getElementById("topic-select-filtering-question-bank");

    var select_list = document.createElement("select");
    select_list.id = "topic-select-filtering";
    topic_div.appendChild(select_list);

    for (var i = 0; i < topic_options_filtering_array.length; i++) {
        var option = document.createElement("option");
        option.value = topic_options_filtering_array[i];
        option.text = topic_options_filtering_array[i];
        select_list.appendChild(option);
    }
}

function add_difficulty_options_filtering_instructor_exams() {
    var difficulty_div= document.getElementById("difficulty-select-filtering-instructor-exam");

    var select_list = document.createElement("select");
    select_list.id = "difficulty-select-filtering-instructor";
    difficulty_div.appendChild(select_list);

    for (var i = 0; i < difficulty_options_filtering_array.length; i++) {
        var option = document.createElement("option");
        option.value = difficulty_options_filtering_array[i];
        option.text = difficulty_options_filtering_array[i];
        select_list.appendChild(option);
    }
}

function add_topic_options_filtering_instructor_exams() {

    var topic_div= document.getElementById("topic-select-filtering-instructor-exam");

    var select_list = document.createElement("select");
    select_list.id = "topic-select-filtering-instructor";
    topic_div.appendChild(select_list);

    for (var i = 0; i < topic_options_filtering_array.length; i++) {
        var option = document.createElement("option");
        option.value = topic_options_filtering_array[i];
        option.text = topic_options_filtering_array[i];
        select_list.appendChild(option);
    }
}


function add_question_button_pressed() {
    var question = document.getElementById("question").value;
    var function_name = document.getElementById("function-name").value;
    var topic_options = document.getElementById("topic-select");
    var topic = topic_options.options[topic_options.selectedIndex].value;
    var difficulty_options = document.getElementById("difficulty-select");
    var difficulty = difficulty_options.options[difficulty_options.selectedIndex].value;
    var constraint_options = document.getElementById("constraint-select");
    var constraint = constraint_options.options[constraint_options.selectedIndex].value;
    var table = document.getElementById("test-cases-table");

    var input_str = "";
    var output_str = "";
    for (var r = 1, n = table.rows.length; r < n; r++) {
        var cell1_value = table.rows[r].cells[0].children[0].value;
        var cell2_value = table.rows[r].cells[1].children[0].value;
        if (r == table.rows.length - 1) {
            input_str += cell1_value;
            output_str += cell2_value;
        } else {
            input_str += cell1_value + ":";
            output_str += cell2_value + ":";
        }

    }

    var vars = "add_question=true" + "&question=" + encodeURIComponent(question) + "&function_name=" + encodeURIComponent(function_name) + "&topic=" + encodeURIComponent(topic )+ "&difficulty=" + encodeURIComponent(difficulty) + "&difficulty=" + encodeURIComponent(difficulty) + "&constraint=" + encodeURIComponent(constraint) + "&test_case_in=" + encodeURIComponent(input_str) + "&test_case_out=" + encodeURIComponent(output_str);
    var req = new XMLHttpRequest();


    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {
                var json_response = JSON.parse(req.responseText);
                if (json_response.added == true) {
                    var question_temp = new Question(question, topic, difficulty);
                    question_bank_array.push(question_temp);
                    add_to_question_bank(question_temp);
                    clear_create_question_form()
                } else {

                }
                // status_id.innerHTML = req.responseText;
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);

}

function add_to_question_bank(question_object) {
    var table = document.getElementById("question-bank-table");
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    cell1.appendChild(document.createTextNode(question_object.topic));
    cell2.appendChild(document.createTextNode(question_object.difficulty));
    cell3.appendChild(document.createTextNode(question_object.question));
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    table.children[0].appendChild(row);
}

function clear_create_question_form() {
    document.getElementById("question").value = "";
    document.getElementById("function-name").value = "";
    document.getElementById("topic-select").selectedIndex = 0;
    document.getElementById("difficulty-select").selectedIndex = 0;
    document.getElementById("constraint-select").selectedIndex = 0;
    var table = document.getElementById("test-cases-table");
    table.rows[1].cells[0].children[0].value = "";
    table.rows[1].cells[1].children[0].value = "";

    if (table.rows.length > 2) {
        for (var r = 2, n = table.rows.length; r < n; r++) {
            table.deleteRow(r);
        }
    }

}


function add_test_case_button() {
    var table = document.getElementById("test-cases-table");
    var input = document.createElement("input");
    input.type = "text";
    var input2 = document.createElement("input");
    input2.type = "text";
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    cell1.appendChild(input);
    cell2.appendChild(input2);
    row.appendChild(cell1);
    row.appendChild(cell2);
    table.children[0].appendChild(row);

}

function create_remove_button_test_case() {
    var button = '<button>Remove</button>'
    button.onclick = function () {
        console.log("hello")
    }
    return button;
}


// Student Home

function student_home_onload() {
    var table = document.getElementById("pending-exams-student");
    var vars = "student_exams";

    get_username(gotUsername);

    function gotUsername(data) {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    var json = JSON.parse(req.responseText);

                    var student_username = data;

                    var user_info = document.getElementsByClassName("nav-bar-user");
                    user_info[0].innerHTML = "Student | " + student_username;
                
                    for (var i = 0; i < json.length; i++) {
                        if(json[i].user == student_username) {
                            var student_info = json[i];
                            var row = document.createElement("tr");

                            if (student_info.tk == 0 && student_info.rel == 0) { // exam not taken
                                var cell1 = document.createElement("td");
                                var cell2 = document.createElement("td");                              
                                cell1.appendChild(document.createTextNode(student_info.exam));
                                cell2.appendChild(add_take_exam_button(student_info.exam));
                                row.appendChild(cell1);
                                row.appendChild(cell2);
                                table.children[0].appendChild(row);
                            } else if(student_info.tk == 1 && student_info.rel == 0) {  // taken but not released
                                var cell1 = document.createElement("td");
                                var cell2 = document.createElement("td");
                                cell1.appendChild(document.createTextNode(student_info.exam));
                                cell2.appendChild(document.createTextNode("Exam Release Pending..."));
                                row.appendChild(cell1);
                                row.appendChild(cell2);
                                table.children[0].appendChild(row);                        
                            } else if(student_info.tk == 1 && student_info.rel == 1) { // taken and released
                                var cell1 = document.createElement("td");
                                var cell2 = document.createElement("td");
                                cell1.appendChild(document.createTextNode(student_info.exam));
                                cell2.appendChild(add_check_grade_button(student_info.exam));
                                row.appendChild(cell1);
                                row.appendChild(cell2);
                                table.children[0].appendChild(row);
                            } else { // no exams available
                                var cell1 = document.createElement("td");
                                cell1.appendChild(document.createTextNode("No exams available"));
                                row.appendChild(cell1);
                                table.children[0].appendChild(row);                              
                            }

                        }
                    }
                    if(json.length == 0) {
                        no_exams_available(table);
                    }
                                                              
                } else {
                    status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
                }
            }
        }
    
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);
    }

}

function no_exams_available(table) {
    var row = document.createElement("tr");
    var cell1 = document.createElement("td");                                            
    cell1.appendChild(document.createTextNode("No exams available"));
    row.appendChild(cell1);
    table.children[0].appendChild(row); 
}

function get_username(callback) {
    var vars = "get_username=true";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function add_take_exam_button(exam) {
    var button = document.createElement("button");
    button.innerHTML = "Take";
    button.onclick = function() {
        save_take_exam(exam);
    };
    return button;
}

function add_check_grade_button(exam) {
    var button = document.createElement("button");
    button.innerHTML = "Check Grade";
    button.onclick = function() {
        save_check_grade_exam(exam);
    };
    return button;
}


function save_take_exam(exam) {
    var vars = "save_take_exam=" + exam;
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                location.href = "takeexam.php";

            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function save_check_grade_exam(exam) {
    var vars = "save_check_grade_exam=" + exam;
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                location.href = "examreviewstudent.php";
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function check_grade_exam_and_student(callback) {
    var vars = "check_grade_exam_and_student=true";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);   
}

function get_exam_and_student(callback) {
    var vars = "get_exam_and_student=true";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

// Exam Review Student

function exam_review_student_onload() {
    check_grade_exam_and_student(received_exam_and_student);

    function received_exam_and_student(data) {
        var json_data = JSON.parse(data);
        var user_info = document.getElementsByClassName("nav-bar-user");
        user_info[0].innerHTML = "Student | " + json_data.student;

        var vars = "exam_review_student=true" + "&exam=" + json_data.exam + "&user=" + json_data.student;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
    
                if (req.status == 200) {
                    get_test_cases(json_data.student, json_data.exam, got_test_cases);

                    function got_test_cases(callback_data) {
                        var info = JSON.parse(req.responseText);
                        var test_case_data = JSON.parse(callback_data);
                        var review_info = parse_test_cases(test_case_data, info);
                        var exam_grade = calculate_exam_grade_and_percentage_student(info);

                        var exam_name = document.getElementById("exam-review-student-exam-name");

                        exam_name.innerHTML = json_data.exam;

                        var exam_info_container = document.getElementById("exam-review-student-info-container");

                        var exam_info_table = document.createElement('table');
                        var row = document.createElement("tr");
                        var cell1 = document.createElement("td");
                        var cell2 = document.createElement("td");
                        var cell3 = document.createElement("td");
                        var cell4 = document.createElement("td");
                        cell1.appendChild(document.createTextNode("Exam Percentage:"));
                        cell1.style.fontWeight = 'bold';
                        cell2.appendChild(document.createTextNode(`${exam_grade[2]}%`));
                        cell3.appendChild(document.createTextNode("Exam Grade:"));
                        cell3.style.fontWeight = 'bold';
                        cell4.appendChild(document.createTextNode(`${exam_grade[0]} / ${exam_grade[1]}`));
                      
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        row.appendChild(cell4);
                        exam_info_table.appendChild(row);

                        exam_info_container.appendChild(exam_info_table);
                        
                        var container = document.getElementById("exam-review-student-container");
                        
                        Object.keys(review_info).forEach(function(key) {
                            var table = document.createElement('table');
                            
                            var row = document.createElement("tr");

                            var cell1 = document.createElement("td");
                            var cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Question:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(document.createTextNode(key));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Points Received:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(document.createTextNode(review_info[key].question_grade));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Total Points:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(document.createTextNode(review_info[key].question_points));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Test Cases:"));
                            cell1.style.fontWeight = 'bold';
                            
                            var test_case_table = document.createElement('table');

                            var tc_row = document.createElement("tr");
                            var tc_cell1 = document.createElement("td");
                            var tc_cell2 = document.createElement("td");
                            var tc_cell3 = document.createElement("td");
                            var tc_cell4 = document.createElement("td");
                            var tc_cell5 = document.createElement("td");
                            var tc_cell6 = document.createElement("td");
                            tc_cell1.appendChild(document.createTextNode("Input"));
                            tc_cell1.style.fontWeight = 'bold';
                            tc_cell2.appendChild(document.createTextNode("Expected"));
                            tc_cell2.style.fontWeight = 'bold';
                            tc_cell3.appendChild(document.createTextNode("Output"));
                            tc_cell3.style.fontWeight = 'bold';
                            tc_cell4.appendChild(document.createTextNode("Points Received"));
                            tc_cell4.style.fontWeight = 'bold';
                            tc_cell5.appendChild(document.createTextNode("Points Total"));
                            tc_cell5.style.fontWeight = 'bold';
                            tc_cell6.appendChild(document.createTextNode("Status"));
                            tc_cell6.style.fontWeight = 'bold';
                            tc_row.appendChild(tc_cell1);
                            tc_row.appendChild(tc_cell2);
                            tc_row.appendChild(tc_cell3);
                            tc_row.appendChild(tc_cell4);
                            tc_row.appendChild(tc_cell5);
                            tc_row.appendChild(tc_cell6);
                            test_case_table.appendChild(tc_row);

                            for (i = 0; i < review_info[key].test_case_in.length; i++) {
                                var current_test_case_in = review_info[key].test_case_in[i];
                                var current_test_case_out = review_info[key].test_case_out[i];
                                var current_expected_test_case_out = review_info[key].expected_test_case_out[i];           
                                var current_test_case_points_received = review_info[key].test_case_total_grade[i];
                                var current_test_case_points_total = review_info[key].test_case_total_points[i];
                                
                                tc_row = document.createElement("tr");
                                tc_cell1 = document.createElement("td");
                                tc_cell2 = document.createElement("td");
                                tc_cell3 = document.createElement("td");
                                tc_cell4 = document.createElement("td");
                                tc_cell5 = document.createElement("td");
                                tc_cell6 = document.createElement("td");
                                tc_cell1.appendChild(document.createTextNode(current_test_case_in));
                                tc_cell2.appendChild(document.createTextNode(current_expected_test_case_out));
                                tc_cell3.appendChild(document.createTextNode(current_test_case_out));
                                tc_cell4.appendChild(document.createTextNode(current_test_case_points_received));
                                tc_cell5.appendChild(document.createTextNode(current_test_case_points_total));
                                
                                if(current_expected_test_case_out == current_test_case_out) {
                                    tc_cell6.appendChild(document.createTextNode("\u2713"));
                                    tc_cell6.style.backgroundColor = "#23a393";
                                    tc_cell6.style.textAlign = "center"
                                } else {
                                    tc_cell6.appendChild(document.createTextNode("\u0058"));
                                    tc_cell6.style.backgroundColor = "#ff5959";
                                    tc_cell6.style.textAlign = "center"
                                }
                                
                                tc_row.appendChild(tc_cell1);
                                tc_row.appendChild(tc_cell2);
                                tc_row.appendChild(tc_cell3);
                                tc_row.appendChild(tc_cell4);
                                tc_row.appendChild(tc_cell5);
                                tc_row.appendChild(tc_cell6);


                                test_case_table.appendChild(tc_row);
                            }

                            
                            var extra_info_table = document.createElement('table');

                            if (review_info[key].function_name == "1") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("function name is correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else if (review_info[key].function_name == "0") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("function name is not correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else {
                                
                            }

                            extra_info_table.appendChild(tc_row2);

                            if (review_info[key].constraint == "1") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("constraint is correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else if (review_info[key].constraint == "0") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("constraint is not correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else {

                            }

                            extra_info_table.appendChild(tc_row2);

                            row.appendChild(cell1);
                            row.appendChild(test_case_table);
                            row.appendChild(extra_info_table);
                            table.appendChild(row);
    
                            
                            var table_td_collection = test_case_table.getElementsByTagName("td");
                            for(var i=0; i<table_td_collection.length; i++) {
                                var td = table_td_collection[i];
                                td.style.border = "1px solid white";
                                td.style.padding = "8px";
                            }

                            var extra_table_td_collection = extra_info_table.getElementsByTagName("td");
                            for(var i=0; i<extra_table_td_collection.length; i++) {
                                var td = extra_table_td_collection[i];
                                td.style.border = "1px solid white";
                                td.style.padding = "8px";
                            }
                            

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Answer:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(non_editable_in_text_area(review_info[key].answer));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);
                            
                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Comment:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(non_editable_in_text_area(review_info[key].comment));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            container.appendChild(table);

                        });
                       

                    }
                } 
            }
        }
    
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);
    }
}


// Take Exam

function take_exam_onload() {

    get_exam_and_student(got_exam_and_student);

    function got_exam_and_student(data) {
        json_data = JSON.parse(data);
        var user_info = document.getElementsByClassName("nav-bar-user");
        user_info[0].innerHTML = "Student | " + json_data.student;

        var vars = "take_exam_student=true" + "&exam=" + json_data.exam;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
    
                if (req.status == 200) {
                    var questions = JSON.parse(req.responseText);
                    var exam_name = document.getElementById("take-exam-name");
                    exam_name.innerHTML = questions[0].exam;
    
                    var container = document.getElementById("take-exam-container");

                    for (i = 0; i < questions.length; i++) {
                        var table = document.createElement('table');
                        
                        var row = document.createElement("tr");
                        var cell1 = document.createElement("label");
                        var cell2 = document.createElement("td");
                        cell1.appendChild(document.createTextNode("Question:"));
                        cell1.style.fontWeight = 'bold';
                        cell2.appendChild(document.createTextNode(questions[i].question));
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        table.appendChild(row);
    
                        row = document.createElement("tr");
                        cell1 = document.createElement("label");
                        cell2 = document.createElement("td");
                        cell1.appendChild(document.createTextNode("Points:"));
                        cell1.style.fontWeight = 'bold';
                        cell2.appendChild(document.createTextNode(questions[i].points));
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        table.appendChild(row);
    
                        row = document.createElement("tr");
                        cell1 = document.createElement("label");
                        cell2 = document.createElement("td");
                        cell1.appendChild(document.createTextNode("Answer:"));
                        cell1.style.fontWeight = 'bold';
                        cell2.appendChild(add_answer_textarea());
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        table.appendChild(row);

                        container.appendChild(table);
                    }

                } else {
                    status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
                }
            }
        }
    
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);

    }
}

function add_answer_textarea() {
    var input = document.createElement("textarea");
    input.cols = "80";
    input.rows = "10";

    return input;
}

function take_exam_submit_button_pressed() {
    var exam_container = document.getElementById("take-exam-container");

    var questions = new Array();
    var points = new Array();
    var answers = new Array();

    
    var i = 0;
    while (i < exam_container.childElementCount) {
        var table = exam_container.children[i];

        var question = table.rows[0].cells[0].innerHTML;
        var point = table.rows[1].cells[0].innerHTML;
        var answer = table.rows[2].cells[0].children[0].value;

        if(answer == "") {
            alert("All questions were not answered.");
            return;
        }
 
        questions.push(question);
        points.push(point);
        answers.push(encodeURIComponent(answer));
        i++;
    } 

    var questions_stringified = JSON.stringify(questions);
    var points_stringified = JSON.stringify(points);
    var answers_stringified = JSON.stringify(answers);

    get_exam_and_student(got_exam_and_student);

    function got_exam_and_student(data) {
        json_data = JSON.parse(data);
        var user_name = json_data.student;
        var exam_name = json_data.exam;
        var vars = "take_exam_submit=true"+"&user_name="+user_name+"&exam_name="+exam_name+"&answers="+ answers_stringified +"&points=" + points_stringified + "&questions=" + questions_stringified;
        var req = new XMLHttpRequest();
        

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
    
                if (req.status == 200) {
                    location.href = "studenthome.php";
                } else {
                    status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
                }
            }
        }
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);
    }
}



function exam_review_list_onload() {
    set_navbar_user_info("Instructor");

    var table = document.getElementById("exam-review-list");
    var vars = "exam_review_list=true";
    var req = new XMLHttpRequest();


    req.onreadystatechange = function () {
        if (req.readyState == 4) {

            if (req.status == 200) {                
                get_instructor_home_review(got_instructor_home_review)
                    function got_instructor_home_review(data) {
                        var exam = JSON.parse(data).exam;
                        var json = JSON.parse(req.responseText);
                        var not_taken = 0;
                        var student_count = 0;

                        for(i = 0; i < json.length; i++) {
                            if(json[i].exam == exam) {
                                student_count++;
                                if(json[i].tk == 1 && json[i].rel == 0) {
                                    var row = document.createElement("tr");
                                    var cell1 = document.createElement("td");
                                    var cell2 = document.createElement("td");
                                    var cell3 = document.createElement("td");
                                    cell1.appendChild(document.createTextNode(json[i].user));
                                    cell2.appendChild(document.createTextNode(json[i].graded));
                                    cell3.appendChild(review_exam_by_student_button(json[i].user, json[i].exam));
                                    row.appendChild(cell1);
                                    row.appendChild(cell2);
                                    row.appendChild(cell3);
                                    table.children[0].appendChild(row);
                                } else if(json[i].tk == 1 && json[i].rel == 1) {
                                    var row = document.createElement("tr");
                                    var cell1 = document.createElement("td");
                                    var cell2 = document.createElement("td");
                                    var cell3 = document.createElement("td");
                                    cell1.appendChild(document.createTextNode(json[i].user));
                                    cell2.appendChild(document.createTextNode(json[i].graded));
                                    cell3.appendChild(document.createTextNode("Exam Released"));
                                    row.appendChild(cell1);
                                    row.appendChild(cell2);
                                    row.appendChild(cell3);
                                    table.children[0].appendChild(row);
                                } else {
                                    not_taken++;
                                }
                            }
                            
                        }
                        
                        if(student_count == not_taken) {
                            var row = document.createElement("tr");
                            var cell1 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("students have not taken exam"));
                            row.appendChild(cell1);
                            table.children[0].appendChild(row);
                        }



                }          
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars); 
}

function review_exam_by_student_button(student_user, student_exam) {
    var button = document.createElement("button");
    button.innerHTML = "Review";
    button.onclick = function() {        
        save_exam_review_list(student_user, student_exam);
    };
    return button;
}

// Exam Review Instructor 

function exam_review_instructor_onload() {
    set_navbar_user_info("Instructor");
    
    get_exam_review_list(got_exam_review_list);

    function got_exam_review_list(data) {
       
        json_data = JSON.parse(data);

        var vars = "exam_review_instructor=true" + "&exam=" + json_data.student_exam + "&user=" + json_data.student_user;
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
    
                if (req.status == 200) {
                
                    get_test_cases(json_data.student_user, json_data.student_exam, got_test_cases);

                    function got_test_cases(callback_data) {
                        // alert(callback_data);
                        var info = JSON.parse(req.responseText);
                        var test_case_data = JSON.parse(callback_data);

                        var review_info = parse_test_cases(test_case_data, info);  
                        
                        var exam_grade = calculate_exam_grade_and_percentage(info);
                            
                        var exam_name = document.getElementById("exam-review-instructor-exam-name");                   
                        exam_name.innerHTML = json_data.student_exam;

                        var exam_info_container= document.getElementById("exam-review-instructor-info-container");
                        
                        var exam_info_table = document.createElement('table');
                        var row = document.createElement("tr");
                        var cell1 = document.createElement("td");
                        var cell2 = document.createElement("td");
                        var cell3 = document.createElement("td");
                        var cell4 = document.createElement("td");
                        var cell5 = document.createElement("td");
                        var cell6 = document.createElement("td");
                        cell1.appendChild(document.createTextNode("Student:"));
                        cell1.style.fontWeight = 'bold';
                        cell2.appendChild(document.createTextNode(json_data.student_user));   
                        cell3.appendChild(document.createTextNode("Exam Percentage:"));
                        cell3.style.fontWeight = 'bold';
                        cell4.appendChild(document.createTextNode(`${exam_grade[2]}%`));
                        cell5.appendChild(document.createTextNode("Exam Grade:"));
                        cell5.style.fontWeight = 'bold';
                        cell6.appendChild(document.createTextNode(`${exam_grade[0]} / ${exam_grade[1]}`));
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        row.appendChild(cell4);
                        row.appendChild(cell5);
                        row.appendChild(cell6);
                        exam_info_table.appendChild(row);

                        exam_info_container.appendChild(exam_info_table);
                        
                        var container = document.getElementById("exam-review-instructor-container");

                        Object.keys(review_info).forEach(function(key) {
                            var table = document.createElement('table');

                            var row = document.createElement("tr");

                            var cell1 = document.createElement("td");
                            var cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Question:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(document.createTextNode(key));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Points Received:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(create_points_textbox(review_info[key].question_grade));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Total Points:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(document.createTextNode(review_info[key].question_points));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Test Cases:"));
                            cell1.style.fontWeight = 'bold';
                            
                            var test_case_table = document.createElement('table');

                            var tc_row = document.createElement("tr");
                            var tc_cell1 = document.createElement("td");
                            var tc_cell2 = document.createElement("td");
                            var tc_cell3 = document.createElement("td");
                            var tc_cell4 = document.createElement("td");
                            var tc_cell5 = document.createElement("td");
                            var tc_cell6 = document.createElement("td");
                            tc_cell1.appendChild(document.createTextNode("Input"));
                            tc_cell1.style.fontWeight = 'bold';
                            tc_cell2.appendChild(document.createTextNode("Expected"));
                            tc_cell2.style.fontWeight = 'bold';
                            tc_cell3.appendChild(document.createTextNode("Output"));
                            tc_cell3.style.fontWeight = 'bold';
                            tc_cell4.appendChild(document.createTextNode("Points Received"));
                            tc_cell4.style.fontWeight = 'bold';
                            tc_cell5.appendChild(document.createTextNode("Points Total"));
                            tc_cell5.style.fontWeight = 'bold';
                            tc_cell6.appendChild(document.createTextNode("Status"));
                            tc_cell6.style.fontWeight = 'bold';
                            tc_row.appendChild(tc_cell1);
                            tc_row.appendChild(tc_cell2);
                            tc_row.appendChild(tc_cell3);
                            tc_row.appendChild(tc_cell4);
                            tc_row.appendChild(tc_cell5);
                            tc_row.appendChild(tc_cell6);
                            test_case_table.appendChild(tc_row);

                            for (i = 0; i < review_info[key].test_case_in.length; i++) {
                                var current_test_case_in = review_info[key].test_case_in[i];
                                var current_test_case_out = review_info[key].test_case_out[i];
                                var current_expected_test_case_out = review_info[key].expected_test_case_out[i];           
                                var current_test_case_points_received = review_info[key].test_case_total_grade[i];
                                var current_test_case_points_total = review_info[key].test_case_total_points[i];
                                
                                tc_row = document.createElement("tr");
                                tc_cell1 = document.createElement("td");
                                tc_cell2 = document.createElement("td");
                                tc_cell3 = document.createElement("td");
                                tc_cell4 = document.createElement("td");
                                tc_cell5 = document.createElement("td");
                                tc_cell6 = document.createElement("td");
                                tc_cell1.appendChild(document.createTextNode(current_test_case_in));
                                tc_cell2.appendChild(document.createTextNode(current_expected_test_case_out));
                                tc_cell3.appendChild(document.createTextNode(current_test_case_out));
                                tc_cell4.appendChild(document.createTextNode(current_test_case_points_received));
                                tc_cell5.appendChild(document.createTextNode(current_test_case_points_total));
                                
                                if(current_expected_test_case_out == current_test_case_out) {
                                    tc_cell6.appendChild(document.createTextNode("\u2713"));
                                    tc_cell6.style.backgroundColor = "#23a393";
                                    tc_cell6.style.textAlign = "center"
                                } else {
                                    tc_cell6.appendChild(document.createTextNode("\u0058"));
                                    tc_cell6.style.backgroundColor = "#ff5959";
                                    tc_cell6.style.textAlign = "center"
                                }
                                
                                tc_row.appendChild(tc_cell1);
                                tc_row.appendChild(tc_cell2);
                                tc_row.appendChild(tc_cell3);
                                tc_row.appendChild(tc_cell4);
                                tc_row.appendChild(tc_cell5);
                                tc_row.appendChild(tc_cell6);


                                test_case_table.appendChild(tc_row);
                            }


                            var extra_info_table = document.createElement('table');

                            if (review_info[key].function_name == "1") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("function name is correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else if (review_info[key].function_name == "0") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("function name is not correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else {
                                
                            }

                            extra_info_table.appendChild(tc_row2);

                            if (review_info[key].constraint == "1") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("constraint is correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else if (review_info[key].constraint == "0") {
                                var tc_row2 = document.createElement("tr");
                                var tc_cell7 = document.createElement("td");
                                tc_cell7.appendChild(document.createTextNode("constraint is not correct."));
                                tc_row2.appendChild(tc_cell7);
                            } else {

                            }

                            extra_info_table.appendChild(tc_row2);
                            row.appendChild(cell1);
                            row.appendChild(test_case_table);
                            row.appendChild(extra_info_table);
                            table.appendChild(row);
    
                            
                            var table_td_collection = test_case_table.getElementsByTagName("td");
                            for(var i=0; i<table_td_collection.length; i++) {
                                var td = table_td_collection[i];
                                td.style.border = "1px solid white";
                                td.style.padding = "8px";
                            }

                            var extra_table_td_collection = extra_info_table.getElementsByTagName("td");
                            for(var i=0; i<extra_table_td_collection.length; i++) {
                                var td = extra_table_td_collection[i];
                                td.style.border = "1px solid white";
                                td.style.padding = "8px";
                            }
                            

                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Answer:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(non_editable_in_text_area(review_info[key].answer));
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);
                            
                            row = document.createElement("tr");
                            cell1 = document.createElement("td");
                            cell2 = document.createElement("td");
                            cell1.appendChild(document.createTextNode("Comment:"));
                            cell1.style.fontWeight = 'bold';
                            cell2.appendChild(add_comment_textarea());
                            row.appendChild(cell1);
                            row.appendChild(cell2);
                            table.appendChild(row);


                            container.appendChild(table);

                        });

                    }

                } else {
                    status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
                }
            }
        }
    
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);
    

    }
}

function calculate_exam_grade_and_percentage(question_data) {
    var total_percentage = 0.0;
    var total_points = 0.0;
    var total_points_received = 0.0;


    for(i = 0; i < question_data.length; i++) {
        if(question_data[i] == null) {
            continue;
        }
        total_points = total_points + parseFloat(question_data[i].points);
        total_points_received = total_points_received + parseFloat(question_data[i].autograde);
    }

    if (total_points != 0) {
        total_percentage = (total_points_received / total_points) * 100;
    }

    return [total_points_received, total_points, total_percentage];
}

function calculate_exam_grade_and_percentage_student(question_data) {
    var total_percentage = 0.0;
    var total_points = 0.0;
    var total_points_received = 0.0;


    for(i = 1; i < question_data.length; i++) {
        if(question_data[i] == null) {
            continue;
        }
        total_points = total_points + parseFloat(question_data[i].points);
        total_points_received = total_points_received + parseFloat(question_data[i].autograde);
    }

    if (total_points != 0) {
        total_percentage = (total_points_received / total_points) * 100;
    }

    return [total_points_received, total_points, total_percentage];
}

function non_editable_in_text_area(text) {
    var input = document.createElement("textarea");
    input.cols = "80";
    input.rows = "10";
    input.defaultValue = text;
    input.readOnly = true;
    return input;
}

class ReviewInfo {

    constructor(test_in, test_out, expected_out, test_case_points, test_case_grade) {
        this.test_case_in = [];
        this.test_case_out = [];
        this.expected_test_case_out = [];
        this.test_case_total_points = [];
        this.test_case_total_grade = [];

        this.question_points = "";
        this.question_grade = "";
        this.answer = "";
        this.comment = "";
        this.constraint = "";
        this.function_name = "";

        this.test_case_in.push(test_in);
        this.test_case_out.push(test_out);
        this.expected_test_case_out.push(expected_out);
        this.test_case_total_points.push(test_case_points);
        this.test_case_total_grade.push(test_case_grade);

    }
}


function parse_test_cases(test_case_data, question_data) {
    var dict = {};

    for(i = 0; i < test_case_data.length; i++) {
        var current_test_case_data = test_case_data[i];     
        if(current_test_case_data.question in dict) {       
            dict[current_test_case_data.question].test_case_in.push(current_test_case_data.testcasesin);
            dict[current_test_case_data.question].test_case_out.push(current_test_case_data.testcasesout);
            dict[current_test_case_data.question].expected_test_case_out.push(current_test_case_data.expectedtestcasesout);
            dict[current_test_case_data.question].test_case_total_points.push(current_test_case_data.points);
            dict[current_test_case_data.question].test_case_total_grade.push(current_test_case_data.autograde);
            
        } else {
            dict[current_test_case_data.question] = new ReviewInfo(current_test_case_data.testcasesin, current_test_case_data.testcasesout, current_test_case_data.expectedtestcasesout, current_test_case_data.points, current_test_case_data.autograde);
            dict[current_test_case_data.question].constraint = current_test_case_data.constraints;
            dict[current_test_case_data.question].function_name = current_test_case_data.funcName;
        }
    }

    for(i = 0; i < question_data.length; i++) {
        var current_question_data = question_data[i];
        if(question_data[i] == null) {
            continue;
        }

        if(current_question_data.question in dict) {

            dict[current_question_data.question].question_points = current_question_data.points;
            dict[current_question_data.question].question_grade = current_question_data.autograde;
            dict[current_question_data.question].answer = current_question_data.answer;
            dict[current_question_data.question].comment = current_question_data.comment;
        } else {
            
        }
    }
    
    return dict;
}

function get_test_cases(user, exam, callback) {
    var vars = "get_test_cases=true" + "&exam=" + exam +"&user=" + user;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function create_points_textbox(text) {
    var input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.size = 4;
    return input;

}

function add_comment_textarea() {
    var input = document.createElement("textarea");
    input.cols = "80";
    input.rows = "10";

    return input;
}

function release_exam_button_pressed() {
    var exam_container = document.getElementById("exam-review-instructor-container");

    var new_points = new Array();
    var comments = new Array();
    var questions = new Array();

    var i = 0;
    while (i < exam_container.childElementCount) {
        var table = exam_container.children[i];

        for(var j=0; j < table.rows.length; j++) {
            var label = table.rows[j].cells[0].innerHTML;
            if (label == "Points Received:") {
                var points_received = table.rows[j].cells[1].children[0].value;
                new_points.push(points_received);
            } else if(label == "Comment:") {
                var comment = table.rows[j].cells[1].children[0].value;
                comments.push(comment);
            } else if(label == "Question:") {
                var question = table.rows[j].cells[1].innerHTML;
                questions.push(question);
            }
        }
             
        i++;
    } 
    
    var new_points_stringified = JSON.stringify(new_points);
    var comments_stringified = JSON.stringify(comments);
    var questions_stringified = JSON.stringify(questions);

    var user_name = document.getElementById('exam-review-instructor-info-container').getElementsByTagName("table")[0].rows[0].cells[1].innerHTML;
    var exam_name = document.getElementById('exam-review-instructor-exam-name').innerHTML;
    
        var vars = "release_exam=true"+"&username="+user_name+"&examname="+exam_name+"&new_points=" +new_points_stringified + "&comments=" + comments_stringified + "&questions=" +questions_stringified;
        var req = new XMLHttpRequest();
        

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
    
                if (req.status == 200) {
                    location.href = "instructorhome.php";
                } else {
                    status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
                }
            }
        }
        req.open("POST", "scripts/request.php", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(vars);    
}


function get_exam_review_list(callback) {
    var vars = "get_exam_review_list=true";
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                callback(req.responseText);
            }
        }
    }
    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}

function save_exam_review_list(student_user, student_exam) {
    var vars = "save_exam_review_list=true" + "&student_user=" + student_user + "&student_exam=" + student_exam;
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                // alert(req.responseText);
                location.href = "examreviewinstructor.php";
            } else {
                status_id.innerHTML = 'An error occurred during your request: ' + req.status + ' ' + req.statusText;
            }
        }
    }

    req.open("POST", "scripts/request.php", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(vars);
}


function student_review_done_button_pressed() {
    location.href = "studenthome.php";
}