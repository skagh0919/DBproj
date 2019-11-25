module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Questions", {
        question_id: {
            type: Datatypes.INTEGER(11),
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
        bogi: {
            type: Datatypes.TEXT
        },
        answer: {
            type: Datatypes.TEXT,
            allowNull: false
        },
        difficulty: {
            type: Datatypes.FLOAT,
            allowNull: false
        },
        real_difficulty: {
            type: Datatypes.FLOAT
        }
    }, {
        underscored: true,
		timestamps: false
    });
};