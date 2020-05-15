const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');
const fs = require('fs');

// 문제 생성
// [보내줘야 할 데이터들]
// type: 문제 타입
// question: 문제내용
// answer: 답
// difficulty: 난이도
// lecture_id: 강의 ID
// selectedKeywords: 선택된 키워드 ID 배열
// scorePortions: 키워드별 배점 배열
// bogis: 객관식의 보기들 배열
// csv_path: csv파일 경로(개별형인 경우에만)
router.post("/", (req, res) => {
    let data = req.body;

    if((data.type != 0 && data.type != 1 && data.type != 2) || !data.question || !data.difficulty
    || !data.selectedKeywords || !data.scorePortions || (data.type == 1 && !data.bogis)){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    // 문제 생성
    models.Questions.create({
        type: data.type,
        question: data.question,
        answer: data.answer,
        difficulty: data.difficulty,
        lecture_id: data.lecture_id
    }).then(result => {
        // 키워드 생성
        for(i = 0; i < data.selectedKeywords.length; ++i){
            models.QuestionKeywords.create({
                question_id: result.dataValues.questionId,
                lecture_id: data.lecture_id,
                keyword_id: data.selectedKeywords[i],
                scorePortion: data.scorePortions[i]
            }).then(result => {
                console.log("keyword insertion");
            }).catch(err => {
                console.error(err);
                res.json({"result": "failure"});
            })
        }
        if(data.type == 1){ // 객관식의 경우 보기 생성
            for(i = 0; i < data.bogis.length; ++i){
                models.QuestionBogi.create({
                    question_id: result.dataValues.questionId,
                    bogiId: i + 1,
                    bogi: data.bogis[i]
                }).then(result => {
                    console.log("bogi insertion");
                }).catch(err => {
                    console.error(err);
                    res.json({"result": "failure"});
                })
            }
        }
        
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
                attributes: ["question", "type", "question_id", "answer", "difficulty", "real_difficulty"],
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
                attributes: ["question", "type", "question_id", "answer", "difficulty", "real_difficulty",
                [sequelize.fn('SUM', sequelize.col('QuestionKeywords.score_portion')), "total_score"]],
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
                // 개별형인 경우 파라미터를 바꿈
                if(result.dataValues.type == 2){
                    let qsentence = result.dataValues.question;
                    let qtype = result.dataValues.type;
                    models.QuestionParams.findAll({
                        where:{question_id: data.question_id}
                    }).then(result2 => {
                        if(!result2){
                            res.json({
                                question: result,
                                bogis: []
                            });
                            return;
                        }
                        let randNum = Math.floor(Math.random() * result2.length);
                        console.log(result2[randNum]);
                        let params = result2[randNum].dataValues.params;
                        for(i = 1; i <= Object.keys(params).length; ++i){
                            qsentence = qsentence.replace("#pr" + i, params["pr" + i]);
                        }
                        res.json({
                            question: {
                                question: qsentence,
                                type: qtype,
                                question_id: parseInt(data.question_id),
                                key_value: randNum + 1
                            },
                            bogis: []
                        });

                    }).catch(err => {
                        console.error(err);
                        res.json({"result": "failure"});
                    })
                }
                else{
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
                }
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
        attributes: ["question_id", [sequelize.fn("avg", sequelize.col("score")),"average"]],
        where: {question_id: data.question_id},
        group: ["question_id"]
    }).then(qavg =>{
        if(!qavg){
            res.json({"result": "No one solve this question"});
            return;
        }
        // 해당 문제 총점 계산
        models.Questions.findOne({
            attributes: ["question_id", [sequelize.fn('SUM', sequelize.col('QuestionKeywords.score_portion')), "total_score"]],
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
    
    models.sequelize.query("SELECT * FROM classes, lectures, questions WHERE classes.class_id = lectures.class_id AND lectures.lecture_id = questions.lecture_id AND question_id = ? LIMIT 1",
    {replacements: [data.question_id], type: sequelize.QueryTypes.SELECT}
    ).then(result => {
        if(data.user_id != result[0].master_id){
            res.json({"result" : "No Authority to delete"});
            return;
        }
        models.Questions.destroy({
            where: {question_id: data.question_id}
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    })

});

module.exports = router;