const express = require('express');
let models = require('../models');
let router = express.Router();

// 문제 생성
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.type || !data.question || !data.answer || !data.difficulty){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.Questions.create({
        type: data.type,
        quesiton: data.question,
        answer: data.answer,
        difficulty: data.difficulty,
        lecture_id: data.lecture_id
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })

});

// 생성한 문제 목록 열람(강사용)
router.post("/", (req, res) => {
    let data = req.body;

    models.Questions.findAll({
        where: { lecture_id: data.lecture_id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })

});

// 문제 열람
router.post("/:id", (req, res) => {
    let data = req.body;

    // 학생 시점
    if(data.user_type == 0){
        models.Questions.findOne({
            attributes: ["question"],
            where: {
                question_id: req.params.id
            }
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }else{// 강사 시점
        models.Questions.findOne({
            where: {
                question_id: req.params.id
            }
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
});

// 문제 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.Questions.destroy({
        where: {question_id: data.question_id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;