const port = process.env.PORT || 3000;
const express = require("express");
let models = require("./models");
let server = express();

//models.sequelize.sync();
models.sequelize.sync({force: true});  // 테이블 모두 재생성해주는 코드. 데이터는 모두 삭제됨

server.use(require("cors")());  // local에서 실행할 때 발생하는 문제 해결
server.use(express.json());     // application/json Content/type이 오면 이걸로 파싱

// 로그 출력
server.use((req, res, next) => {
    console.log(req.method, req.url, res.status);
    next();
});

// Route들
//새로운 route가 생길시 여기에 추가
server.use("/login", require("./routes/login"));                        // 로그인 관련 API
server.use("/register", require("./routes/register"));                  // 회원가입 관련 API
server.use("/", require("./routes/index"));                             // 메인 페이지 관련 API
server.use("/classes", require("./routes/classes"));                    // 과목 페이지 관련 API
server.use("/user_classes", require("./routes/user_classes"));          // 사용자와 강의 관계 관련 API
server.use("/lectures", require("./routes/lectures"));                  // 강의 페이지 관련 API
server.use("/lecture_keywords", require("./routes/lecture_keywords"));  // 강의 키워드 관련 API
server.use("/questions", require("./routes/questions"));                // 문제 관련 API
server.use("/question_keywords", require("./routes/question_keywords"));// 문제의 키워드 관련 API
server.use("/question_bogi", require("./routes/question_bogi"));        // 문제의 보기 관련 API
server.use("/solves", require("./routes/solves"));                      // 문제 푼 기록 관련 API

// 404 not found 처리
server.use((req, res, next) => {
    res.status(404).send("요청하신 페이지는 존재하지 않습니다.");
});

// 500 서버 오류 처리
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("서버 오류가 발생하였습니다. 빠른 시일내에 처리하겠습니다");
});

server.listen(port, () => {
    console.log("Server started on port... " + port);
});