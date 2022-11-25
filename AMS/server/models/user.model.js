"use strict";
import dbHelper from '../common/dbHelper';

export default (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        uniqueId: {
            type: DataTypes.STRING,
            field: "unique_id",
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: { msg: "Valid email address is required" },
                notEmpty: { msg: "Email is required" },
                isUnique: dbHelper.isUnique("user", "email", {
                    msg: "email is already in use"
                })
            }
        },
        password: {
            type: DataTypes.STRING,
            field: "password",
            validate: {
                notEmpty: { msg: "Password is required" },
            }
        },
        token: {
            field: 'token',
            type: DataTypes.TEXT,
            defaultStatus: null
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
                isUnique: dbHelper.isUnique("user", "phone", {
                    msg: "Phone number is already in use"
                })
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active",
            defaultValue: true,
        },
        updated_by: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        created_by: {
            type: DataTypes.INTEGER,
            defaultValue: null
        }
    }, {
        freezeTableName: true,
        tableName: "user",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    user.associate = function (models) {
        user.hasMany(models.categoryDetails, { foreignKey: "userId", as: "categoryDetails" });
    };

    return user;
};
