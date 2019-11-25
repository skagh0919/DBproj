module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Lectures", {
        lectureId: {
            type: Datatypes.INTEGER(11),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        name: {
            type: Datatypes.STRING(225),
            allowNull: false
        },
        startTime: {
            type: Datatypes.DATE,
            allowNull: false
        },
        endTime: {
            type: Datatypes.DATE
        }
    },{
        underscored: true,
        timestamps: false
    });
};