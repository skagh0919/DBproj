module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Questions", {
        questionId: {
            type: Datatypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true
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
            type: Datatypes.TEXT,
            allowNull: false
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