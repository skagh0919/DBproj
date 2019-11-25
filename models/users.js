module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Users", {
        userId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
		email: {
			type: Datatypes.STRING(255),
			allowNull: false,
			unique: true
		},
        password: {
            type: Datatypes.STRING(255),
            allowNull: false
        },
        type: {
            type: Datatypes.INTEGER(11)
        }
    }, {
        underscored: true,
		timestamps: false
    });
};