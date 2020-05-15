td_delete = document.querySelector(".lecturelist .lecture.item .lecture.del");
td_create = document.querySelector(".lecturelist .lecture.item .lecture.button");
td_load = document.querySelector(".lecturelist .lecture.item .lecture.bank");
td_check = document.querySelector(".lecturelist .lecture.item .lecture.check");
if(localStorage.getItem("userId")) {
    let type = localStorage.getItem("type");
    if(type == 0){
        td_delete.style.display = "none";
        td_load.style.display = "none";
        td_create.style.display = "none";
        td_check.style.display = "none";
    }
}