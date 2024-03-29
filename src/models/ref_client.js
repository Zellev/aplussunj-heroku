module.exports = (sequelize, DataTypes) => {
    const Ref_Client = sequelize.define('Ref_client', {
        id_client: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true,
        },
        client: { 
            type: DataTypes.STRING(11), 
            unique: true,
            allowNull: false
        }      
    }, {
        freezeTableName: true,
        timestamps: false 
    });

    Ref_Client.associate = db => {
        Ref_Client.hasOne(db.Client, {
            foreignKey: 'jenis_client',
            onDelete: 'RESTRICT',
            as: 'Client'
        });
    }

    return Ref_Client;
}

