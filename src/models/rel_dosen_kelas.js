module.exports = (sequelize, DataTypes) => {
    const Rel_Dosen_Kelas = sequelize.define('Rel_dosen_kelas', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_dosen: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_kelas: { 
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    return Rel_Dosen_Kelas;
}

