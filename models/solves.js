module.exports = (sequelize, Datatypes) => {
    return sequelize.define("Solves", {
        stuAnswer: {
            type: Datatypes.TEXT
        },
        score: {
            type: Datatypes.INTEGER(11)
        }
    }, {
        underscored: true,
        timestamps: false
    });
};