module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Question_Keywords", {
        userId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
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