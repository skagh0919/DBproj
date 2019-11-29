const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

// 해당 강의 문제를 푼 기록들 및 문항별 평균 점수 열람
router.get("/:lecture_id", (req, res) => {

    models.Solves.findAll({
        where: {lecture_id: req.params.lecture_id}
    }).then(result => {
        models.Solves.findAll({
            attributes: ["lecture_id", "question_id", [sequelize.fn("avg", sequelize.col("score")),"average"]],
            where: {lecture_id: req.params.lecture_id},
            group: ["question_id"]
        }).then(result2 => {
            res.json({
                each: result,
                avg: result2
            });
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 문제 풀기
router.post("/", (req, res) => {
    let data = req.body;
    var score = 0;
    let deletePrev = (lid, qid, uid) => {
        models.Solves.destroy({
            where: {
                lecture_id: lid,
                question_id: qid,
                user_id: uid
            }
        }).then(result => {
            console.log(result);
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    };

    // 해당 문제의 정답과 비교 후 채점
    models.Questions.findOne({
        attributes: {include: [[sequelize.cast(sequelize.fn('SUM', sequelize.col('QuestionKeywords.score_portion')),'signed'), "total_score"]]},
        include: [{
            model: models.QuestionKeywords,
        }],
        where: {
            lecture_id: data.lecture_id,
            questionId: data.question_id,
        },
        group: ["Questions.question_id"]
    }).then(result => {
        if(result.answer == data.stu_answer){
            score = result.dataValues.total_score;
        }
        // 기존에 푼 기록 찾기(있으면 삭제)
        models.Solves.findOne({
            where: {
                lecture_id: data.lecture_id,
                question_id: data.question_id,
                user_id: data.user_id
            }
        }).then(result => {
            if(result){
                deletePrev(result.lecture_id, result.question_id, result.user_id);
                console.log("delete success");
            }
            // 푼 기록 생성
            models.Solves.create({
                lecture_id: data.lecture_id,
                question_id: data.question_id,
                user_id: data.user_id,
                stuAnswer: data.stu_answer,
                score: score
            }).then(result => {
                res.json({"result": "success"});
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })

        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })     
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
    
});

module.exports = router;