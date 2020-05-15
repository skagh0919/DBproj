const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

// 사용자가 수강 중인 과목들 열람
router.get("/:user_id", (req,res) => {
    
    models.UserClasses.findAll({
        include: [{
            model: models.Classes
        }],
        where: {user_id: req.params.user_id}
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

    //학생
    if(data.type == 0){
        //정원이 다 찼는지 확인
        models.Classes.findOne({
            attributes: {include: [[sequelize.fn('COUNT', sequelize.col('UserClasses.user_id')), "current_num"]]},
            include: [{
                model: models.UserClasses,
                required: false,
                where: {
                    role: {
                    [sequelize.Op.eq]: "student"
                    }
                }
            }],
            where: {classId: data.class_id},
            group: ["Classes.class_id"]
        }).then(result => { // 정원이 다 찼으면 수강 불가
            if(result.dataValues.current_num >= result.capacity){
                res.json({"result": "No more Capacity"});
                return;
            }
            models.UserClasses.create({
                role: "student",
                class_id: data.class_id,
                user_id: data.user_id
            }).then(result => {
                res.json({"result": "success"});
            }).catch(error => {
                console.error(error);
                res.json({"result": "failed"});
            })

        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    // 강사
    }else{
        models.UserClasses.create({
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