const express = require('express');
let models = require('../models');
let router = express.Router();

router.get("/", (req, res) => {
    let data = req.body;

    models.Lectures.findAll({
        where: {
            class_id: data.class_id
        }
    }).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {lecture_id: req.params.lecture_id}
    })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
});

router.post("/", (req, res) => {
    let data = req.body;

    if(!data.name || !data.start_time){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    if(!data.end_time){
        models.Lectures.create({
            name: data.name,
            start_time: data.start_time,
            class_id: data.class_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }
    else{
        models.Lectures.create({
            name: data.name,
            start_time: data.start_time,
            end_time: data.end_time,
            class_id: data.class_id
        }).then(result => {
            res.json({"result": "success"});
        }).catch(error => {
            console.error(error);
            res.json({"result": "failed"});
        })
    }

});

router.put("/", (req, res) => {
    let data = req.body;

    if(!data.name || !data.start_time){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    if(!data.end_time){
        models.Lectures.update({
            name: data.name,
            start_time: data.start_time
        }, {
            where: {class_id: data.class_id}
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
    else{
        models.Lectures.update({
            name: data.name,
            start_time: data.start_time,
            end_time: data.end_time
        }, {
            where: {class_id: data.class_id}
        }).then(result => {
            res.json({"result": "success"});
        }).catch(err => {
            console.error(err);
            res.json({"result": "failure"});
        })
    }
});

router.delete("/", (req, res) => {
    let data = req.body;

    if(data.issure !== true || typeof data.lecture_id !== "number") {
        res.json({
            "result": "no_action",
            "log": "make sure to pass 'issure' parameter and post id"
        });
        return;
    }

    models.Lectures.destroy({
        where: {lecture_id: data.lecture_id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;