"use strict";

export default (sequelize, DataTypes) => {
    const stock = sequelize.define("stock", {
        // attributes
        itemName: {
            type: DataTypes.STRING,
            field: "item_name",
        },
        description: {
            type: DataTypes.STRING,
            field: "description",
        },
        qty: {
            type: DataTypes.INTEGER,
            field: "qty",
        },
        totalStock: {
            type: DataTypes.INTEGER,
            field: "total_stock",
        },
        availableStock: {
            type: DataTypes.INTEGER,
            field: "available_stock",
        },
        totalCost: {
            type: DataTypes.INTEGER,
            field: "total_cost",
        },
        datePurchased: {
            type: DataTypes.STRING,
            field: "date_purchased",
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: "category_id",
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
        tableName: "stock",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    stock.associate = function (models) {
        stock.belongsTo(models.categoryDetails, { foreignKey: 'categoryId', as: 'category' });

        stock.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        stock.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    };

    return stock;
};

