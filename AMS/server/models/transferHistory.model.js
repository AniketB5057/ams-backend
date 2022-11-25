"use strict";

export default (sequelize, DataTypes) => {
    const transferHistory = sequelize.define(
        "transferHistory",
        {
            // attributes
            transferredFrom: {
                type: DataTypes.INTEGER,
                field: "transferred_from",
            },
            transferredTo: {
                type: DataTypes.INTEGER,
                field: "transferred_to",
            },
            itemId: {
                type: DataTypes.INTEGER,   // item reference
                field: "item_id",
            },
            dateTransfer: {
                type: DataTypes.DATE,
                field: "date_transfer",
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks",
            },
            createdBy: {
                type: DataTypes.INTEGER,
                field: "created_by",
            },
            modifiedBy: {
                type: DataTypes.INTEGER,
                field: "modified_by",
            },
        },
        {
            freezeTableName: true,
            tableName: "transfer_history",
            updatedAt: "updated_at",
            createdAt: "created_at"
        }
    );

    transferHistory.associate = function (models) {
        transferHistory.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
        transferHistory.belongsTo(models.item, { foreignKey: 'itemId', as: 'itemDetail' });
        
        transferHistory.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        transferHistory.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    };

    return transferHistory;
 
};
