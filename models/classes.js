module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Classes", {
        classId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        name: {
            type: Datatypes.STRING(255),
            allowNull: false
        },
        capacity: {
            type: Datatypes.INTEGER(11),
			allowNull: false
        }
    }, {
        underscored: true,
		timestamps: false
    });
};