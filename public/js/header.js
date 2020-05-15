let a_createClass = document.querySelector(".menu.list .link.createClass");
let a_ClassList = document.querySelector(".menu.list .link.classList");
let a_takingClass = document.querySelector(".menu.list .link.takingClass");
let a_bank = document.querySelector(".menu.list .link.bank");
var regex = /^[0-9]+$/;

function reg(input) {
let result = regex.test(input);
return result;
}

if(localStorage.getItem("userId")) {
    let type = localStorage.getItem("type");
    let a_login = document.querySelector(".menu.list .link.login");
    a_login.innerText = "로그아웃";
    a_login.href = "main.html";
    let a_register = document.querySelector(".menu.list .link.register");
    let a_createClass = document.querySelector(".menu.list .link.createClass");
    a_register.style.display = "none";
    if(type == "0"){
        a_createClass.style.display = "none";
        a_bank.style.display = "none";
    }
    if(type == "1"){
        //a_takingClass.style.display = "none";
    }
    a_login.onclick = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("type");
    }
}else{
    a_createClass.style.display = "none";
    a_ClassList.style.display = "none";
    a_takingClass.style.display = "none";
    a_bank.style.display = "none";
}