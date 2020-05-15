td_delete = document.querySelector(".classlist .class.item .class.del");
td_create = document.querySelector(".classlist .class.item .class.button");
td_lecList = document.querySelector(".classlist .class.item .class.lecList");
if(localStorage.getItem("userId")) {
    let type = localStorage.getItem("type");
    if(type == 0){
        td_delete.style.display = "none";
        td_create.style.display = "none";
        td_lecList.style.display = "none";
    }
}