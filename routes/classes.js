const express = require('express');
let models = require('../models');
let router = express.Router();

router.get("/", (req, res) => {

    models.Classes.findAll().then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })
});

router.post("/create", (req, res) => {
    let data = req.body;

    if(!data.cap || !data.name){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.Classes.create({
        name: data.name,
        capacity: data.cap,
        master_id: data.id
    }).then(result => {
        res.json({"result": "success"});
    }).catch(error => {
        console.error(error);
        res.json({"result": "failed"});
    })

});

router.put("/", (req, res) => {
    let data = req.body;

    if(!data.cap || !data.name){
        console.log(data);
        res.json({"result": "Not Enough Information"});
        return;
    }

    models.Classes.update({
        name: data.name,
        capacity: data.cap,
        master_id: data.id
    }, {
        where: {master_id: data.id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })

});

router.delete("/", (req, res) => {
    let data = req.body;

    if(data.issure !== true || typeof data.id !== "number") {
        res.json({
            "result": "no_action",
            "log": "make sure to pass 'issure' parameter and post id"
        });
        return;
    }

    models.Classes.destroy({
        where: {master_id: data.id}
    }).then(result => {
        res.json({"result": "success"});
    }).catch(err => {
        console.error(err);
        res.json({"result": "failure"});
    })
});

module.exports = router;