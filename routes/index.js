const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    res.send("<h3>API 서버에 오신 것을 환영합니다</h3>");
});

module.exports = router;