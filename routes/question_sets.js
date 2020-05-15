const express = require('express');
let models = require('../models');
let router = express.Router();
const sequelize = require('sequelize');

// 해당 조건에 맞는 문제 집합을 추출 후 열람
// question_num: 문제 수
// is_real: 실질 난이도인지 여부(bool)
// difficulty_range: 난이도 범위(배열)
// keyword_list: 키워드 ID목록(배열)
router.post("/", (req, res) => {
    let data = req.body;
    let notRealDiffQuery = 
    `select *
    from bank_questions
    where difficulty between :min and :max
    and question_id in(
        select distinct bq.question_id
        from bank_questions as bq, bank_question_keywords as bqk
        where bq.question_id = bqk.question_id and bqk.keyword_id in (:keyRange)
    )`;
    let realDiffQuery = 
    `select *
    from bank_questions
    where real_difficulty between :min and :max
    and question_id in(
        select distinct bq.question_id
        from bank_questions as bq, bank_question_keywords as bqk
        where bq.question_id = bqk.question_id and bqk.keyword_id in (:keyRange)
    )`;
    
    let qnum = data.question_num;
    //실질 난이도로 검색
    if(data.is_real){
        models.sequelize.query(realDiffQuery, {
            replacements: {
                min: data.difficulty_range[0],
                max: data.difficulty_range[1],
                keyRange: data.keyword_list
            },
            type: sequelize.QueryTypes.SELECT,
            nest: true
        }).then(result => {
            console.log(result);
            // 조건에 부합하는 문제가 없을 경우
            if(!result){
                res.json({"result": "Nothing"});
                return;
            }
            // 추출된 문제의 수가 필요한 문제 수보다 적거나 같을 경우 그대로 보냄
            else if(result.length <= qnum){
                let idSet = [];
                for(i = 0; i < result.length; ++i){
                    idSet.push(result[i].question_id);
                }
                result.push(idSet);
                let resArray = [result];
                res.json(resArray);
            }
            // 4개의 랜덤 set을 추출
            else{
                let resultSet = [];
                for(i = 0; i < 4; ++i){
                    let set = {};
                    let qSet = [];
                    let idSet = [];
                    while(qSet.length < qnum){
                        let randNum = Math.floor(Math.random() * result.length);
                        if(!idSet.includes(result[randNum].question_id)){
                            idSet.push(result[randNum].question_id);
                            qSet.push(result[randNum]);
                        }
                    }
                    set["qSet"] = qSet;
                    set["idSet"] = idSet;
                    resultSet.push(set);
                }
                res.json(resultSet);
            }

        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
    //일반 난이도로 검색
    else{
        models.sequelize.query(notRealDiffQuery, {
            replacements: {
                min: data.difficulty_range[0],
                max: data.difficulty_range[1],
                keyRange: data.keyword_list
            },
            type: sequelize.QueryTypes.SELECT,
            nest: true
        }).then(result => {
            let resultSet = [];
            // 조건에 부합하는 문제가 없을 경우
            if(!result){
                res.json({"result": "Nothing"});
                return;
            }
            // 추출된 문제의 수가 필요한 문제 수보다 적거나 같을 경우 그대로 보냄
            else if(result.length <= qnum){
                let set = {};
                let qSet = [];
                let idSet = [];
                for(i = 0; i < result.length; ++i){
                    idSet.push(result[i].question_id);
                    qSet.push(result[i]);
                }
                set["qSet"] = qSet;
                set["idSet"] = idSet;
                resultSet.push(set);
            }
            // 4개의 랜덤 set을 추출
            else{
                for(i = 0; i < 4; ++i){
                    let set = {};
                    let qSet = [];
                    let idSet = [];
                    while(qSet.length < qnum){
                        let randNum = Math.floor(Math.random() * result.length);
                        if(!idSet.includes(result[randNum].question_id)){
                            idSet.push(result[randNum].question_id);
                            qSet.push(result[randNum]);
                        }
                    }
                    set["qSet"] = qSet;
                    set["idSet"] = idSet;
                    resultSet.push(set);
                }
            }
            res.json(resultSet);
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
    
});

// 선택된 문제 set을 강의에 추가
// lecture_id
// idSet
router.post("/copy", (req, res) => {
    let data = req.body;

    for(i = 0; i < data.idSet.length; ++i){
        // 문제를 탐색 후 복사
        models.BankQuestions.findOne({
            where: {questionId: data.idSet[i]}
        }).then(result => {
            let tuple = result.dataValues;
            models.Questions.create({
                type: tuple.type,
                question: tuple.question,
                answer: tuple.answer,
                difficulty: tuple.difficulty,
                lecture_id: data.lecture_id
            }).then(result => {
                let newTuple = result.dataValues;
                // 키워드를 탐색 후 복사
                models.BankQuestionKeywords.findAll({
                    where:{question_id: tuple.questionId}
                }).then(result => {
                    let bKeywords = result;
                    for(k = 0; k < bKeywords.length; ++k){
                        let bKeyword = bKeywords[k];
                        models.LectureKeywords.findOne({
                            where:{
                                lecture_id: data.lecture_id,
                                keyword: bKeyword.dataValues.keyword
                            }
                        }).then(result => {
                            console.log(k);
                            models.QuestionKeywords.create({
                                question_id: newTuple.questionId,
                                lecture_id: data.lecture_id,
                                keyword_id: result.dataValues.keywordId,
                                scorePortion: bKeyword.dataValues.scorePortion
                            }).then(result => {
                                console.log("Question Keyword Copy");
                            }).catch(err => {
                                console.error(err);
                                res.json({"result": "failure"});
                            })
                        }).catch(err => {
                            console.error(err);
                            res.json({"result": "failure"});
                        })
                    }
                }).catch(err => {
                    console.error(err);
                    res.json({"result": "failure"});
                })
                // 객관식이면 탐색 후 보기들 복사
                if(tuple.type == 1){
                    models.BankQuestionBogi.findAll({
                        where: {question_id: tuple.questionId}
                    }).then(result => {
                        for(j = 0; j < result.length; ++j){
                            models.QuestionBogi.create({
                                question_id: newTuple.questionId,
                                bogi: result[j].dataValues.bogi,
                                bogiId: result[j].dataValues.bogiId
                            }).then(result => {
                                console.log("Question Bogi Copy");
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
                // 개별형이면 파라미터 복사
                else if(newTuple.type == 2){
                    models.BankQuestionParams.findAll({
                        where: {question_id: tuple.questionId}
                    }).then(result => {
                        for(j = 0; j < result.length; ++j){
                            models.QuestionParams.create({
                                question_id: newTuple.questionId,
                                keyValue: result[j].dataValues.keyValue,
                                params: result[j].params,
                                answer: result[j].answer
                            }).then(result => {
                                console.log("Question Params Copy");
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
        })

    }
})


module.exports = router;