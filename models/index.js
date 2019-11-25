const Sequelize = require('sequelize');
const config = {
    "database": "project",
    "username": "root",
    "password": "namuMaroo0349",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
};

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Datatypes = Sequelize;   // 두 가지 이름으로 모두 쓸 수 있게 중복 선언

db.Users = require("./users")(db.sequelize, db.Datatypes);
db.Classes = require("./classes")(db.sequelize, db.Datatypes);
db.Lectures = require("./lectures")(db.sequelize, db.Datatypes);
db.Lecture_Keywords = require("./lecture_keywords")(db.sequelize, db.Datatypes);
db.Questions = require("./questions")(db.sequelize, db.Datatypes);
db.Question_Keywords = require("./question_keywords")(db.sequelize, db.Datatypes);
db.Solves = require("./solves")(db.sequelize, db.Datatypes);
db.Question_Bogi = require("./question_bogi")(db.sequelize, db.Datatypes);

db.Users.hasMany(db.Classes, {foreignKey: {name: "user_id", allowNull: false}});
db.Users.hasMany(db.Solves, {foreignKey: {name: "user_id", primaryKey: true, allowNull: false}});
db.Classes.hasMany(db.Lectures, {foreignKey: {name: "class_id", allowNull: false}, onDelete: "cascade"});
db.Lectures.hasMany(db.Lecture_Keywords, {foreignKey: {name: "lecture_id", allowNull: false}, onDelete: "cascade"});
db.Lectures.hasMany(db.Questions, {foreignKey: {name: "lecture_id", allowNull: false}, onDelete: "cascade"});
db.Lectures.hasMany(db.Question_Keywords, {foreignKey: {name: "lecture_id", allowNull: false, primaryKey: true}, onDelete: "cascade"});
db.Questions.hasMany(db.Question_Keywords, {foreignKey: {name: "question_id", allowNull: false, primaryKey: true}, onDelete: "cascade"});
db.Questions.hasMany(db.Solves, {foreignKey: {name: "question_id", primaryKey: true, allowNull: false}});
db.Questions.hasMany(db.Question_Bogi, {foreignKey: {name: "question_id", primaryKey: true, allowNull: false}});
db.Question_Keywords.removeAttribute("id");
db.Solves.removeAttribute("id");

module.exports = db;