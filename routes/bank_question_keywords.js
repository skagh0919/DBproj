const express = require('express');
let models = require('../models');
let router = express.Router();
let sequelize = require('sequelize');

// 문제은행 내 모든 키워드 열람
router.get("/", (req, res) => {
    models.BankQuestionKeywords.findAll({
        attributes: ["keyword_id", "keyword"],
        group: ["keyword_id", "keyword"]
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
        res.json({"result": "failed"});
    })
})

module.exports = router;