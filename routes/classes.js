const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

// 모든 과목들 열람
router.get("/", (req, res) => {

    models.Classes.findAll({
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
        group: ["Classes.class_id"]
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 사용자가 생성한 과목들 열람
router.get("/:master_id", (req,res) => {
    
    models.Classes.findAll({
        where: {master_id: req.params.master_id}
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 과목 생성
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.capacity || !data.name){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.Classes.create({
        name: data.name,
        capacity: data.capacity,
        master_id: data.master_id
    }).then(result => {
        console.log(result);
        res.json({"result": "success"});
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })

});

// 과목 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.Classes.findOne({
        where:{classId: data.class_id}
    }).then(result => {
        if(result.dataValues.master_id != data.user_id){
            res.json({"result": "No Authority to delete"});
            return;
        }

        models.Classes.destroy({
            where: {
                classId: data.class_id,
                master_id: data.user_id
            }
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })

    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;