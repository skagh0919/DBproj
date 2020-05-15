td_see = document.querySelector(".question.item .question.see");
td_save = document.querySelector(".question.item .question.save");
td_solve = document.querySelector(".question.item .question.button");
td_del = document.querySelector(".question.item .question.del");
if(localStorage.getItem("userId")) {
    let type = localStorage.getItem("type");
    if(type == 0){
        td_save.style.display = "none";
        td_see.style.display = "none";
        td_del.style.display = "none";
    }else if(type == 1){
        //td_solve.style.display = "none";
    }
}