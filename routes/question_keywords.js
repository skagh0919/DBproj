const express = require('express');
let models = require('../models');
let router = express.Router();

// 문제의 키워드 열람
router.get("/:question_id", (req, res) => {

    models.QuestionKeywords.findAll({
        include: {
            model: models.LectureKeywords
        },
        where: {
            question_id: req.params.question_id
        }
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 문제에 키워드 부착
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.score_portion){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.QuestionKeywords.create({
        question_id: data.question_id,
        lecture_id: data.lecture_id,
        keyword_id: data.keyword_id,
        scorePortion: data.score_portion
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

// 문제에 키워드 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.QuestionKeywords.destroy({
        where: {
            question_id: data.question_id,
            keyword_id: data.keyword_id
        }
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;