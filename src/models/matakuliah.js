module.exports = (sequelize, DataTypes) => {
    const Matakuliah = sequelize.define('Matakuliah', {
        id_matkul: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        kode_matkul: { 
            type: DataTypes.STRING(10),
            unique: true,
            allowNull: false
        },
        id_kel_mk: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_peminatan: {
            type: DataTypes.INTEGER
        },
        nama_matkul: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },        
        sks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deskripsi: {
            type: DataTypes.TEXT
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Matakuliah.associate = db => {        
        Matakuliah.belongsTo(db.Ref_kel_matkul, {
            foreignKey: 'id_kel_mk',
            as: 'KelMk'
        }),
        Matakuliah.belongsTo(db.Ref_peminatan, {
            foreignKey: 'id_peminatan',
            allowNull: true,
            as: 'RefPemin'
        }),
        Matakuliah.hasMany(db.Kelas, {
            foreignKey: 'id_matkul',
            onDelete: 'CASCADE',
            as: 'Kelas'
        }),
        Matakuliah.hasMany(db.Soal_essay, {
            foreignKey: 'id_matkul',
            onDelete: 'CASCADE',
            as: 'Soal'
        })
    }

    return Matakuliah;
}