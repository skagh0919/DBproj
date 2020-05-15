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
    }
    a_login.onclick = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("type");
    }
}