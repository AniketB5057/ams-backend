"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
        employeeUniqueId: {
            type: DataTypes.STRING,
            field: "employee_unique_id",
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: "Valid email address is required" },
                notEmpty: { msg: "Email is required" },
                isUnique: dbHelper.isUnique("employee", "email", {
                    msg: "email is already in use"
                })
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "user_id",
        },
        departmentId: {
            type: DataTypes.INTEGER,
            field: "department_id",
        },
        firstName: {
            type: DataTypes.STRING,
            field: "first_name",
            validate: {
                notEmpty: { msg: "firstName is required" },
            }
        },
        lastName: {
            type: DataTypes.STRING,
            field: "last_name",
            validate: {
                notEmpty: { msg: "lastName is required" },
            }
        },
        phone: {
            type: DataTypes.STRING,
            field: "phone",
            validate: {
                notEmpty: { msg: "phone number is required" },
                isUnique: dbHelper.isUnique("employee", "phone", {
                    msg: "Phone number is already in use"
                })
            }
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
        tableName: "employee",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    employee.associate = function (models) {
        employee.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
        employee.belongsTo(models.department, { foreignKey: 'departmentId', as: 'departmentDetails' });
        employee.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        employee.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    };

    return employee;
};
