const express = require('express');
let models = require('../models');
let router = express.Router();

// 해당 문제에 보기 생성
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.bogi){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    if(!data.bogi_id){
        models.QuestionBogi.create({
            question_id: data.question_id,
            bogi: data.bogi
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
    else{
        models.QuestionBogi.create({
            bogiId: data.bogi_id,
            question_id: data.question_id,
            bogi: data.bogi
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
});

// 보기 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.QuestionBogi.destroy({
        where: {
            question_id: data.question_id,
            bogiId: data.bogi_id
        }
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;