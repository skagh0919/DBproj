const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

// 해당 문제를 푼 기록들 및 평균 점수 열람
router.get("/:question_id", (req, res) => {

    models.Solves.findAll({
        where: {question_id: req.params.question_id}
    }).then(result => {
        models.Solves.findAll({
            attributes: ["question_id", [sequelize.fn("avg", sequelize.col("score")),"average"]],
            where: {question_id: req.params.question_id},
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
// questoin_id
// user_id
// stu_answer
// key_value
router.post("/", (req, res) => {
    let data = req.body;
    var score = 0;
    let deletePrev = (qid, uid) => {
        models.Solves.destroy({
            where: {
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
            questionId: data.question_id
        },
        group: ["Questions.question_id"]
    }).then(result => {
        // 개별형의 경우 파라미터에 따른 정답 체크
        if(result.dataValues.type == 2){
            let total_score = result.dataValues.total_score;
            models.QuestionParams.findOne({
                where: {
                    question_id: data.question_id,
                    keyValue: data.key_value
                }
            }).then(result => {
                if(result.dataValues.answer == data.stu_answer){
                    score = total_score;
                }
                // 기존에 푼 기록 찾기(있으면 삭제)
                models.Solves.findOne({
                    where: {
                        question_id: data.question_id,
                        user_id: data.user_id
                    }
                }).then(result => {
                    if(result){
                        deletePrev(result.question_id, result.user_id);
                        console.log("delete success");
                    }
                    // 푼 기록 생성
                    models.Solves.create({
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
            })
        }
        // 객관식/단답식의 경우
        else{
            if(result.answer == data.stu_answer){
                score = result.dataValues.total_score;
            }
            // 기존에 푼 기록 찾기(있으면 삭제)
            models.Solves.findOne({
                where: {
                    question_id: data.question_id,
                    user_id: data.user_id
                }
            }).then(result => {
                if(result){
                    deletePrev(result.question_id, result.user_id);
                    console.log("delete success");
                }
                // 푼 기록 생성
                models.Solves.create({
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
        }
             
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
    
});

module.exports = router;