"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const categoryDetails = sequelize.define("categoryDetails", {
        categoryName: {
            type: DataTypes.STRING,
            field: "category_name",
            validate: {
                notEmpty: { msg: "categoryName is required" },
                isUnique: dbHelper.isUnique("categoryDetails", "categoryName", {
                    msg: "categoryName is already in use"
                })
            }
        },
        description: {
            type: DataTypes.STRING,
            field: "description",
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "user_id",
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
        tableName: "category_details",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    categoryDetails.associate = function (models) {
        categoryDetails.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
        categoryDetails.hasMany(models.item, { foreignKey: 'categoryId', as: 'employeeItems' });

        categoryDetails.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        categoryDetails.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    }
    return categoryDetails;

};
