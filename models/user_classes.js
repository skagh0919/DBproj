module.exports = (sequelize, Datatypes) => {
    return sequelize.define("User_Classes", {
        role: {
            type: Datatypes.STRING(255),
            allowNull: false
        },
        //userId
		//classId
    }, {
        underscored: true
    });
};