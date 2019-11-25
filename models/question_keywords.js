module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Question_Keywords", {
		keyword: {
			type: Datatypes.STRING(255),
			allowNull: false,
			unique: true
		},
        score_portion: {
            type: Datatypes.INTEGER(11),
            allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};