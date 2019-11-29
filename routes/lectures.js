const express = require('express');
let models = require('../models');
let router = express.Router();

// 해당 과목의 강의 목록 열람
router.get("/:class_id", (req, res) => {
    
    models.Lectures.findAll({
        where: {
            class_id: req.params.class_id
        }
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 해당 강의 정보
router.get("/:lecture_id", (req, res) => {
    let data = req.params;

    models.Lectures.findOne({
        where: {
            lectureId: data.lecture_id
        }
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 강의 생성
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.name || !data.start_time){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    if(!data.end_time){
        models.Lectures.create({
            name: data.name,
            startTime: data.start_time,
            class_id: data.class_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }
    else{
        models.Lectures.create({
            name: data.name,
            startTime: data.start_time,
            endTime: data.end_time,
            class_id: data.class_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

});

// 강의 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    if(data.issure !== true || typeof data.lecture_id !== "number") {
        res.json({
            "result": "no_action",
            "log": "make sure to pass 'issure' parameter and post id"
        });
        return;
    }

    models.Lectures.destroy({
        where: {
            lectureId: data.lecture_id
        }
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;