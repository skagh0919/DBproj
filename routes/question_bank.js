const express = require('express');
let models = require('../models');
let router = express.Router();
let sequelize = require('sequelize');

// 문제 은행에 있는 모든 문제 열람
router.get("/", (req, res) => {
    models.BankQuestions.findAll({

    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

// 문제 은행의 개별 문제 열람
router.get("/:question_id", (req, res) => {
    let data = req.params;

    models.BankQuestions.findOne({
        attributes: {include: [[sequelize.fn('SUM', sequelize.col('BankQuestionKeywords.score_portion')), "total_score"]]},
        include: [{
            model: models.BankQuestionKeywords
        }],
        where: {
            questionId: parseInt(data.question_id)
        },
        group: ["BankQuestions.question_id"]
    }).then(result => {
        models.BankQuestionBogi.findAll({
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
});

// 문제를 문제은행에 추가
router.post("/:question_id", (req, res) => {
    let data = req.params;

    // 해당 문제 찾기
    models.Questions.findOne({
        where: {questionId: data.question_id}
    }).then(result => {
        if(!result){
            res.json({"result": "Not exist Questions"});
            return;
        }
        let tuple = result.dataValues;
        
        //문제 은행에 넣기
        models.BankQuestions.create({
            questionId: tuple.questionId,
            lectureId: tuple.lecture_id,
            type: tuple.type,
            question: tuple.question,
            answer: tuple.answer,
            difficulty: tuple.difficulty,
            realDifficulty: tuple.realDifficulty
        }).then(result=>{
            // 키워드 탐색 후 문제은행 키워드에 삽입
            models.QuestionKeywords.findAll({
                include: [{
                    model: models.LectureKeywords
                }],
                where: {question_id: data.question_id}
            }).then(result => {
                for(i = 0; i < result.length; ++i){
                    models.BankQuestionKeywords.create({
                        question_id: result[i].dataValues.question_id,
                        keywordId: result[i].dataValues.LectureKeyword.dataValues.keywordId,
                        keyword: result[i].dataValues.LectureKeyword.dataValues.keyword,
                        scorePortion: result[i].dataValues.scorePortion
                    }).then(result => {
                        console.log("BankQuestionKeyword" + i + " Insertion Clear");
                    }).catch(err => {
                        console.error(err);
                        res.json({"result": "failure"});
                    })
                }
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })

            // 객관식이면 보기 탐색 후 문제은행 보기에 삽입
            if(tuple.type == 1){
                models.QuestionBogi.findAll({
                    where: {question_id: data.question_id}
                }).then(result => {
                    for(i = 0; i < result.length; ++i){
                        models.BankQuestionBogi.create({
                            question_id: data.question_id,
                            bogiId: result[i].dataValues.bogiId,
                            bogi: result[i].dataValues.bogi
                        }).then(result => {
                            console.log("BankQuestionBogi" + i + " Intertion Clear");
                        }).catch(err => {
                            console.error(err);
                            res.json({"result": "failure"});
                        })
                    }
                }).catch(err => {
                    console.error(err);
                    res.json({"result": "failure"});
                })
            }
            // 개별형이면 파라미터 데이터도 문제은행 파라미터에 삽입
            else if(tuple.type == 2){
                models.QuestionParams.findAll({
                    where: {question_id: data.question_id}
                }).then(result => {
                    for(i = 0; i < result.length; ++i){
                        models.BankQuestionParams.create({
                            question_id: data.question_id,
                            keyValue: result[i].dataValues.keyValue,
                            params: result[i].dataValues.params,
                            answer: result[i].dataValues.answer
                        }).then(result => {
                            console.log("BankQuestionParams" + i + " Intertion Clear");
                        }).catch(err => {
                            console.error(err);
                            res.json({"result": "failure"});
                        })
                    }
                }).catch(err => {
                    console.error(err);
                    res.json({"result": "failure"});
                })
            }
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })

    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })

});

// 문제은행에서 해당 문제 삭제
router.delete("/:question_id", (req, res) => {
    let data = req.params;

    models.BankQuestions.destroy({
        where: {questionId: data.question_id}
    }).then(result => {
        res.json({"result" : "Delete Success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;