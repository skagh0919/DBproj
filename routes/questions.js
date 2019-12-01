const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

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

// 문제 열람(query 사용)
router.get("/", (req, res) => {
    let data = req.query;
    
    // 해당 강의 모든 문제 열람
    if(!data.question_id){

        // 강사 시점(/questions/?utype=1&lecture_id=n)
        if(req.query.utype == 1){
            models.Questions.findAll({
                where: { lecture_id: parseInt(data.lecture_id)}
            }).then(result => {
                res.json(result);
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
        else{ // 학생 시점
            models.Questions.findAll({
                attributes: ["question", "type", "question_id"],
                where: { lecture_id: parseInt(data.lecture_id)}
            }).then(result => {
                res.json(result);
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
    }
    // 개별 문제 열람 (보기와 함께)
    else{

        // 강사 시점(/questions?utype=1&question_id=n)
        if(req.query.utype == 1){
            models.Questions.findOne({
                attributes: {include: [[sequelize.fn('SUM', sequelize.col('QuestionKeywords.score_portion')), "total_score"]]},
                include: [{
                    model: models.QuestionKeywords
                }],
                where: {
                    questionId: parseInt(data.question_id)
                },
                group: ["Questions.question_id"]
            }).then(result => {
                models.QuestionBogi.findAll({
                    where: {question_id: data.question_id}
                }).then(result2 => {
                    res.json({
                        question: result,
                        bogis: result2
                    });
                }).catch(err => {
                    console.error(err);
                    res.json({"result": " Bogis failure"});
                })
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
        else{// 학생 시점
            models.Questions.findOne({
                attributes: ["question", "type", "question_id"],
                where: {
                    questionId: parseInt(data.question_id)
                }
            }).then(result => {
                models.QuestionBogi.findAll({
                    attributes: ["bogi_id", "bogi"],
                    where: {question_id: data.question_id}
                }).then(result2 => {
                    res.json({
                        question: result,
                        bogis: result2
                    });
                }).catch(err => {
                    console.error(err);
                    res.json({"result": " Bogis failure"});
                })
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
        
    }
});

// 실질 난이도 계산
router.put("/:question_id", (req, res) =>{
    let data = req.params;

    // 해당 문제 평균 점수 계산
    models.Solves.findOne({
        attributes: ["question_id", [sequelize.cast(sequelize.fn("avg", sequelize.col("score")), 'signed'),"average"]],
        where: {question_id: data.question_id},
        group: ["question_id"]
    }).then(qavg =>{
        if(!qavg){
            res.json({"result": "No one solve this question"});
            return;
        }
        // 해당 문제 총점 계산
        models.Questions.findOne({
            attributes: ["question_id", [sequelize.cast(sequelize.fn('SUM', sequelize.col('QuestionKeywords.score_portion')), 'signed'), "total_score"]],
            include: [{
                 model: models.QuestionKeywords
            }],
            where: {
                questionId: data.question_id
            },
            group: ["Questions.question_id"]
        }).then(qscore => {
            // 실질 난이도 수정
            models.Questions.update(
                {realDifficulty: 10 * (1 - qavg.dataValues.average/qscore.dataValues.total_score)},
                {where: {questionId: data.question_id}}
            ).then(result => {
                res.json(result);
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

// 문제 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.Questions.destroy({
        where: {
            question_id: data.question_id
        }
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;