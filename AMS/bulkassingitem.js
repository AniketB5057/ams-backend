const assignItems = async (req) => {

    let responseData = statusConst.error;
    let { employeeId, itemIds, remarks } = req.body;
    const createdBy = req.tokenUser.id
    try {
      if (!Array.isArray(itemIds)) { throw new Error("itemIds is not a array") }
  
      const employeeAssigmentDetail = await sequelize.transaction(async (t) => {
        const employee = await models.employee.findOne({ where: { id: employeeId }, transaction: t })
        if (!employee) { throw new Error("employee does not exist") }
  
        let assignItems = [];
        for (let i = 0; i < itemIds.length; i++) {
          const element = itemIds[i];
          let neIndex = itemIds[([i] <= 0) ? [i] : [i] - 1];
          let oldItem
          if (i > 0) {
            oldItem = await models.item.findOne({ where: { id: neIndex }, transaction: t });
          }
          const item = await models.item.findOne({ where: { id: element }, transaction: t });
        
          if (!item) { throw new Error(`Item does not exist`) };
          if ((oldItem && oldItem.itemName == item.itemName) || item.isAssigned) { throw new Error(`This ${item.itemName} is already assing to another employee`) }
  
          let itemInfo = { itemId: element, employeeId: employeeId, createdBy: createdBy, userId: createdBy, remarks: remarks }
          assignItems.push(itemInfo)
        }
        let alreadyAssigned = await models.employeeAssignment.findAll({
          where: { employeeId: employee.id },
          include: [{
            model: models.item,
            as: "itemDetail",
            attributes: ["itemName"]
          }],
          transaction: t
        })
        let employeeAssigment = await models.employeeAssignment.bulkCreate(assignItems, { returning: true }, { transaction: t })
  
        if (!employeeAssigment) { throw new Error("Unable to assign item to employee"); }
        await models.item.update({ isAssigned: true }, { where: { id: { [Op.in]: itemIds } }, transaction: t })
  
        return employeeAssigment
      });
  
      responseData = { status: 200, message: "items assign successfully", success: true, data: employeeAssigmentDetail }
    } catch (error) {
      responseData = { status: 400, message: error.message, success: false };
    }
    return responseData;
  };