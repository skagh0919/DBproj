const express = require('express');
let models = require('../models');
let router = express.Router();

// 사용자가 수강 중인 과목들 열람
router.get("/:id", (req,res) => {
    
    models.User_Classes.findAll({
        include: [{
            model: models.Classes
        }],
        where: {user_id: req.params.id}
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 수강 신청(혹은 강사로서 참여)
router.post("/", (req, res) => {
    let data = req.body;

    if(data.type == 0){
        models.User_Classes.create({
            role: "student",
            class_id: data.class_id,
            user_id: data.user_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }else{
        models.User_Classes.create({
            role: "teacher",
            class_id: data.class_id,
            user_id: data.user_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

});

module.exports = router;