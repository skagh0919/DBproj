module.exports = (sequelize, Datatypes) => {
    return sequelize.define("BankQuestions", {
        questionId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        lectureId: {
            type: Datatypes.INTEGER(11),
            allowNull: false
        },
		type: {
			type: Datatypes.INTEGER(11),
			allowNull: false
		},
        question: {
            type: Datatypes.STRING(1023),
            allowNull: false
        },
        answer: {
            type: Datatypes.TEXT
        },
        difficulty: {
            type: Datatypes.FLOAT,
            allowNull: false
        },
        realDifficulty: {
            type: Datatypes.FLOAT
        }
    }, {
        underscored: true,
		timestamps: false
    });
};