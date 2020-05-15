module.exports = (sequelize, Datatypes) => {
    return sequelize.define("QuestionParams", {
        keyValue: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        params: {
            type: Datatypes.JSON,
			allowNull: false
        },
        answer: {
            type: Datatypes.TEXT,
			allowNull: false
        },
    }, {
        underscored: true,
		timestamps: false
    });
};