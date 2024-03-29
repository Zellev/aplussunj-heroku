module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true,
        },
        username: { 
            type: DataTypes.STRING(25), 
            unique: true,
            allowNull: false
        },
        email: { 
            type: DataTypes.STRING(50), 
            unique: true,
            allowNull: false
        },
        password:{ 
            type: DataTypes.STRING(65),
            allowNull: false
        },
        status_civitas: { 
            type: DataTypes.ENUM('aktif','tidak_aktif'), 
            defaultValue: 'aktif',
            allowNull: false
        },
        id_role: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foto_profil: { 
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        keterangan: { 
            type: DataTypes.TEXT,
            defaultValue: null
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
        timestamps: false,
        indexes:[
            {
                unique: false,
                fields:['created_at', 'updated_at']
            }
        ]
    });

    User.associate = db => {
        User.hasOne(db.Dosen, {
            foreignKey: 'id_user',
            as: 'Dosen',
            onDelete: 'CASCADE'
        }),
        User.hasOne(db.Mahasiswa, {
            foreignKey: 'id_user',
            as: 'Mahasiswa',
            onDelete: 'CASCADE'
        }),
        User.hasOne(db.Token_history, {
            foreignKey: 'id_user',
            as: 'Token',
            onDelete: 'CASCADE'
        }),
        User.belongsTo(db.Ref_role, {
            foreignKey: 'id_role',
            as: 'Role'
        })        
    }

    return User;
}

