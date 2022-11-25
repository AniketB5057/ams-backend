
import itemServices from "../services/item.service";
import { get, isEmpty } from "lodash";
// var barcode = require('jsbarcode');

const _ = { get, isEmpty };

export const createItem = async (req, res, next) => {
  itemServices.createItem(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const itemDetails = async (req, res, next) => {
  itemServices.itemDetails(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const singleItem = async (req, res) => {
  const itemId = _.get(req, "params.id", 0);
  itemServices.itemGet(itemId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const updateItem = (req, res) => {
  itemServices.updateItem(req).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const deleteItem = (req, res) => {
  const ID = _.get(req, "params.id", 0);
  itemServices.deleteItem(ID).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};
