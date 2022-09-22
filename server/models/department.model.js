"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const department = sequelize.define("department", {
        name: {
            type: DataTypes.STRING,
            field: "name",
            validate: {
                notEmpty: { msg: "name is required" },
                isUnique: dbHelper.isUnique("department", "name", {
                    msg: "name is already in use"
                })
            }            
        },
        departmentUniqueId: {
            type: DataTypes.STRING,
            field: "department_unique_id",
        },
        description: {
            type: DataTypes.STRING,
            field: "description",
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
        tableName: "department",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    department.associate = function (models) {
        department.hasMany(models.employee, { foreignKey: 'departmentId', as: 'employeeDetail' });

        department.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        department.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    }
    return department;

};
