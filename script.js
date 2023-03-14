document.getElementById("inp").disabled = true;
document.getElementById("inp").style.overflow = scroll;



let val = document.querySelector("body");
val.addEventListener("keydown", function (e) {
    let x = e.key;
    if ((x >= '0' && x <= '9') || x == '+' || x == '-' || x == '*' || x == '/' || x == '%' || x == '(' || x == ')' || x == '.' || x == '=' || x == "Enter" || x == "Backspace" || x == "^" || x == "c") {
        var element = document.getElementById(x);
        element.classList.add("active");
        let str = "./sounds/click" + Math.floor(Math.random() * 3) + ".mp3"
        let aud = new Audio();
        aud.src = str;
        aud.play();
    }
});

val.addEventListener("keyup", function (e) {
    let x = e.key;
    if ((x >= '0' && x <= '9') || x == '+' || x == '-' || x == '*' || x == '/' || x == '%' || x == '(' || x == ')' || x == '.') {
        pressed(x);
        var element = document.getElementById(x);
        element.classList.remove("active");
    }
    else if (x == '=' || x == "Enter") {
        display_answer();
        var element = document.getElementById(x);
        element.classList.remove("active");
    }
    else if (x == "Backspace") {
        del_last_elem();
        var element = document.getElementById(x);
        element.classList.remove("active");
    }
    else if (x == 'c' || x == 'C') {
        clear_display();
        var element = document.getElementById('c');
        element.classList.remove("active");
    }
    else if (x == '^') {
        pressed("**");
        var element = document.getElementById(x);
        element.classList.remove("active");
    }
    else {
        console.log(x);
    }
});


function pressed(x) {
    let val = document.querySelector("input").value;
    val += x;
    document.getElementById("inp").setAttribute("value", val);
    document.querySelector("input").scrollLeft = document.querySelector("input").scrollWidth;
}

function display_answer() {
    let val = document.querySelector("input").value;
    try {
        let result = Function("return " + val + ";")();
        if (result == val || result == "undefined") {
            document.getElementById("inp").setAttribute("value", "Error");
            if (result == "69") { document.getElementById("inp").setAttribute("value", "Holy Number"); }
        }
        else {
            document.getElementById("inp").setAttribute("value", result);
        }
    }
    catch (err) {
        document.getElementById("inp").setAttribute("value", "Error");
    }
}

function del_last_elem() {
    let val = document.querySelector("input").value;
    val = val.substring(0, val.length - 1);
    document.getElementById("inp").setAttribute("value", val);
}

function clear_display() {
    document.getElementById("inp").setAttribute("value", "");
}