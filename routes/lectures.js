const express = require('express');
let models = require('../models');
let router = express.Router();

// 해당 과목의 강의 목록 열람
router.get("/:class_id", (req, res) => {
    
    models.Lectures.findAll({
        where: {
            class_id: req.params.class_id
        }
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

// 강의 생성

// name: 강의 이름
// start_time
// end_time
// createdKeywords
// createdWeights
// user_id
// class_id
router.post("/", (req, res) => {
    let data = req.body;

    if(!data.name || !data.start_time || !data.createdKeywords || !data.createdWeights){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }
    // 해당 과목의 담당자인지 체크
    models.Classes.findOne({
        where: {classId: data.class_id}
    }).then(result =>{
        if(result.dataValues.master_id != data.user_id){
            res.json({"result": "Not the master of this class"});
            return;
        }

        if(!data.end_time){
            // 강의 생성
            models.Lectures.create({
                name: data.name,
                startTime: data.start_time,
                class_id: data.class_id
            }).then(result => {
                // 강의 키워드 생성
                let lecId = result.dataValues.lectureId;
                for(i = 0; i < data.createdKeywords.length; ++i){
                    models.LectureKeywords.create({
                        lecture_id: lecId,
                        keyword: data.createdKeywords[i],
                        weight: data.createdWeights[i]
                    }).then(result => {
                        console.log("lecture keyword insertion clear");
                    }).catch(error => {
                        console.error(error);
                        res.json({"result": "failed"});
                    })
                }
                res.json({"result": "success"});
            }).catch(error => {
                console.error(error);
                res.json({"result": "failed"});
            })
        }
        else{
            models.Lectures.create({
                name: data.name,
                startTime: data.start_time,
                endTime: data.end_time,
                class_id: data.class_id
            }).then(result => {
                let lecId = result.dataValues.lectureId;
                for(i = 0; i < data.createdKeywords.length; ++i){
                    models.LectureKeywords.create({
                        lecture_id: lecId,
                        keyword: data.createdKeywords[i],
                        weight: data.createdWeights[i]
                    }).then(result => {
                        console.log("lecture keyword insertion clear");
                    }).catch(error => {
                        console.error(error);
                        res.json({"result": "failed"});
                    })
                }
                res.json({"result": "success"});
            }).catch(error => {
                console.error(error);
                res.json({"result": "failed"});
            })
        }

    })

});

// 강의 삭제
router.delete("/", (req, res) => {
    let data = req.body;

    models.Lectures.findOne({
        include: {
            model: models.Classes
        },
        where: {lectureId: data.lecture_id}
    }).then(result => {
        if(result.dataValues.Class.dataValues.master_id != data.user_id){
            res.json({"result": "No Authority to delete"});
            return;
        }
        models.Lectures.destroy({
            where: {
                lectureId: data.lecture_id
            }
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;