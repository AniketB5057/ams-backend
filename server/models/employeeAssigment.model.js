"use strict";
export default (sequelize, DataTypes) => {
    const employeeAssignment = sequelize.define("employeeAssignment", {
        itemId: {                 
            type: DataTypes.INTEGER,       // item reference
            field: "item_id",
        },
        employeeId: {
            type: DataTypes.INTEGER,      // employee reference
            field: "employee_id",
        },
        qty: {
            type: DataTypes.INTEGER,
            field: "qty",
        },
        condition: {
            type: DataTypes.STRING(30),
            field: "condition",
        },
        remarks: {
            type: DataTypes.STRING(20),
            field: "remarks",
        },
        dateAssigned: {
            type: DataTypes.DATE,
            field: "date_assigned",
        },
        userId: {
            type: DataTypes.INTEGER,      // user reference
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
        tableName: "employee_assignment",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    employeeAssignment.associate = function (models) {
        employeeAssignment.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
        employeeAssignment.belongsTo(models.employee, { foreignKey: 'employeeId', as: 'employeeDetail' });
        employeeAssignment.belongsTo(models.item, { foreignKey: 'itemId', as: 'itemDetail' });

        employeeAssignment.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        employeeAssignment.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    };

    return employeeAssignment;
};
