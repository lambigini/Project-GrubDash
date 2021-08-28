const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res, next) {
  res.status(200).json({ data: orders });
}

function validateOrder(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  console.log("dishes ", dishes);
  if (deliverTo && mobileNumber && dishes) next();

  if (deliverTo === undefined || deliverTo === "")
    return next({
      status: 400,
      message: "deliverTo",
    });
  if (mobileNumber === undefined || mobileNumber === "")
    return next({
      status: 400,
      message: "mobileNumber",
    });
  if (dishes === undefined || typeof dishes !== "array" || dishes.length === 0)
    return next({
      status: 400,
      message: "dishes",
    });
}

function isDishesQuantityValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  console.log("dishes ", dishes);

  // if (
  //   dishes[0].quantity === undefined ||
  //   dishes[0].quantity <= 0 || !Number.isInteger(dishes[0].quantity)

  // )
  //   return next({
  //     status: 400,
  //     message: `${dishes[0].quantity}`,
  //   });
}

function create(req, res, next) {
  // create the data from order with the new id
  // attach the data to req.body
  // push the new order to the data
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  orders.push(newOrder);
  console.log("newOrder ", newOrder);
  console.log("orders ", orders);

  res.status(201).json({ data: newOrder });
}

module.exports = {
  list,
  create: [validateOrder, create],
};
