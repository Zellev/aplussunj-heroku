module.exports = (sequelize, DataTypes) => {
    const Rel_Mahasiswa_Kelas = sequelize.define('Rel_mahasiswa_kelas', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_mhs: { 
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

    return Rel_Mahasiswa_Kelas;
}

