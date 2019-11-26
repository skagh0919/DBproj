const express = require('express');
let models = require('../models');
let router = express.Router();

// 해당 강의 키워드 목록 열람
router.post("/", (req, res) => {
    let data = req.body;

    models.Lecture_Keywords.findAll({
        where: { lecture_id: data.lecture_id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })

});

// 해당 강의 키워드 생성
router.post("/", (req, res) => {
    let data = req.body;
    let createKeyword = (lecture_id, keyword, weight) => {
        models.Lecture_Keywords.create({
            lecture_id: lecture_id,
            keyword: keyword,
            weight: weight
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

    if(!data.keyword || !data.weight){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.Lecture_Keywords.findOne({
        where: {
            keyword: data.keyword
        }
    }).then(result => {
        if(!result){
            createKeyword(data.lecture_id, data.keyword, data.weight);
        }
        else{
            res.json({"result": "Already Exist"});
        }
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 키워드 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.Lecture_Keywords.destroy({
        where: {keyword_id: data.keyword_id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;