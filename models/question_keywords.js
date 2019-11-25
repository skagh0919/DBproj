module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Question_Keywords", {
        score_portion: {
            type: Datatypes.INTEGER(11),
            allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};