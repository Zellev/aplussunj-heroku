module.exports = (sequelize, DataTypes) => { 
    const Rel_paketsoal_soal  = sequelize.define('Rel_paketsoal_soal', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_paket: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_soal: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        no_urut_soal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },        
        bobot_soal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        kata_kunci_soal: {
            type: DataTypes.STRING(200),
            defaultValue: null,
            get: function() {
                if(this.getDataValue('kata_kunci_soal') == null){
                    return this.getDataValue('kata_kunci_soal')
                }
                return JSON.parse(this.getDataValue('kata_kunci_soal'));
            },
            set: function(val) {
                if(val == null){
                    return this.setDataValue('kata_kunci_soal', val);
                }
                return this.setDataValue('kata_kunci_soal', JSON.stringify(val));                
            }
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Rel_paketsoal_soal.associate = db => {
        Rel_paketsoal_soal.belongsTo(db.Paket_soal, {
            foreignKey: 'id_paket',
            onDelete: 'CASCADE',
            as: 'PaketSoal'
        }),
        Rel_paketsoal_soal.belongsTo(db.Soal_essay, {
            foreignKey: 'id_soal',
            onDelete: 'CASCADE',
            as: 'Soal'
        }),
        Rel_paketsoal_soal.hasMany(db.Jawaban_mahasiswa, {
            foreignKey: 'id_relasi_soalpksoal',
            onDelete: 'CASCADE',
            as: 'Jawabans'
        })
    };

    return Rel_paketsoal_soal;
}