module.exports = (sequelize, DataTypes) => {
    const Rel_Kelas_Ujian = sequelize.define('Rel_kelas_ujian', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_kelas: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_ujian: { 
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Rel_Kelas_Ujian.associate = db => {
        Rel_Kelas_Ujian.belongsTo(db.Kelas, {
            foreignKey: 'id_kelas',
            onDelete: 'CASCADE',
            as: 'Kosek'
        }),
        Rel_Kelas_Ujian.belongsTo(db.Ujian, {
            foreignKey: 'id_ujian',
            onDelete: 'CASCADE',
            as: 'Ujian'
        })
    };

    return Rel_Kelas_Ujian;
}

