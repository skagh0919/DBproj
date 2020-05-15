module.exports = (sequelize, Datatypes) => {
    return sequelize.define("BankQuestionKeywords", {
        keywordId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            primaryKey: true
        },
        keyword: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        scorePortion: {
            type: Datatypes.INTEGER(11),
            allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};