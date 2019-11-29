module.exports = (sequelize, Datatypes) => {
    return sequelize.define("UserClasses", {
        role: {
            type: Datatypes.STRING(255),
            allowNull: false
        }
    }, {
        underscored: true,
        timestamps: false
    });
};