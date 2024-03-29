module.exports = (sequelize, DataTypes) => {
    const Mahasiswa = sequelize.define('Mahasiswa', {
        id_mhs: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true,
        },
        id_user: { 
            type: DataTypes.INTEGER,            
            allowNull: false
        },
        NIM: { 
            type: DataTypes.STRING(10), 
            unique: true,
            allowNull: false
        },
        nama_lengkap:{ 
            type: DataTypes.STRING(25), 
            allowNull: false
        },
        alamat: { 
            type: DataTypes.TEXT
        },
        nomor_telp: { 
            type: DataTypes.STRING(12), 
            allowNull: false
        },
        created_at: { 
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: { 
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        indexes:[            
            {
                unique: false,
                fields:['created_at', 'updated_at']
            }            
        ]
    });

    Mahasiswa.associate = db => {
        Mahasiswa.belongsTo(db.User, { 
            foreignKey: 'id_user',
            as: 'User'
        }),
        Mahasiswa.belongsToMany(db.Kelas, {
            through: 'Rel_mahasiswa_kelas',
            foreignKey: 'id_mhs',
            onDelete: 'CASCADE',
            as: 'Kelases'
        }),
        Mahasiswa.belongsToMany(db.Paket_soal, {
            through: 'Rel_mahasiswa_paketsoal',
            foreignKey: 'id_mhs',
            onDelete: 'CASCADE',
            as: 'PaketSoals'
        }),
        Mahasiswa.hasMany(db.Rel_mahasiswa_paketsoal, {
            foreignKey: 'id_mhs',
            onDelete: 'CASCADE',
            as: 'Mahasiswa_pksoal'
        }),
        Mahasiswa.hasMany(db.Jawaban_mahasiswa, {
            foreignKey: 'id_mhs',
            onDelete: 'CASCADE',
            as: 'Jawabans'
        })
    }

    return Mahasiswa;
}

