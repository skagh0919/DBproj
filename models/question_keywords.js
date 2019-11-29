module.exports = (sequelize, Datatypes) => {
    return sequelize.define("QuestionKeywords", {
        scorePortion: {
            type: Datatypes.INTEGER(11),
            allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};