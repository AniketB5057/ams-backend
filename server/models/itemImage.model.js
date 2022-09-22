"use strict";

export default (sequelize, DataTypes) => {
    const itemImage = sequelize.define("itemImage", {
        // attributes
        imageName: {
            type: DataTypes.STRING(100),
            field: "image_name",
        },
        imagePath: {
            type: DataTypes.STRING(100),
            field: "image_path",
        },
        description: {
            type: DataTypes.STRING(100),
            field: "description",
        },
        itemId: {
            type: DataTypes.INTEGER,    // item reference
            field: "item_id",
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
        }
    }, {
        freezeTableName: true,
        tableName: "item_image",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });

    // Modal associations
    itemImage.associate = function (models) {
        itemImage.belongsTo(models.item, { foreignKey: 'itemId', as: 'itemImageDetail' });

        itemImage.belongsTo(models.user, { foreignKey: 'createdBy', as: 'createdby' });
        itemImage.belongsTo(models.user, { foreignKey: 'modifiedBy', as: 'modifiedby' });
    }

    itemImage.prototype.toJSON = function () {
        var values = Object.assign({}, this.get({ plain: true }));

        if (values.imagePath) {
            values.imagePath = process.env.BASE_URL + imgUrl;
        }
        return values;
    }

    return itemImage;
};
