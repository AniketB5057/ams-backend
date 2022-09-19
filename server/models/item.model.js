"use strict";

export default (sequelize, DataTypes) => {
    const item = sequelize.define("item", {
        // attributes
        itemTag: {
            type: DataTypes.STRING,
            field: "item_tag",
        },
        itemName: {
            type: DataTypes.STRING,
            field: "item_name",
        },
        description: {
            type: DataTypes.STRING,
            field: "description",
        },
        serialNo: {
            type: DataTypes.STRING,
            field: "serial_no",
        },
        cost: {
            type: DataTypes.STRING,
            field: "cost",
        },
        datePurchased: {
            type: DataTypes.STRING,
            field: "date_purchased",
        },
        qty: {
            type: DataTypes.STRING,
            field: "qty",
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: "category_id",
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "user_id",
        },
        qty: {
            type: DataTypes.STRING,
            field: "qty",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active",
            defaultValue: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            field: "created_by",
        },
        modifiedBy: {
            type: DataTypes.INTEGER,
            field: "modified_by",
        },
    }, {
        freezeTableName: true,
        allowNull: false,
        tableName: "item",
    });


    // Modal associations
    item.associate = function (models) {
        item.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
        item.belongsTo(models.categoryDetails, { foreignKey: 'categoryId', as: 'category' });
        item.hasMany(models.employeeAssignment, { foreignKey: 'itemId', as: 'employeeItems' });
        item.hasOne(models.itemImage, { foreignKey: 'itemId', as: 'itemImage' });

        item.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        item.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    };

    return item;
};
