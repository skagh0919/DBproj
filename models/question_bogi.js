module.exports = (sequelize, Datatypes) => {
    return sequelize.define("QuestionBogi", {
        bogiId: {
            type: Datatypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        bogi: {
            type: Datatypes.STRING(1023),
			allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};