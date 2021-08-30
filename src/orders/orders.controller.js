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
  if (dishes === undefined || !Array.isArray(dishes) || dishes.length === 0)
    return next({
      status: 400,
      message: "dishes",
    });

  dishes.map((dish, index) => {
    if (
      dish.quantity === undefined ||
      dish.quantity === 0 ||
      !Number.isInteger(dish.quantity)
    )
      return next({
        status: 400,
        message: `dish quantity at index ${index}  invalid`,
      });
  });

  res.locals.order = req.body.data;
  next();
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

  //   const newOrder = { ...res.locals.order, id: nextId() };
  orders.push(newOrder);

  res.status(201).json({ data: newOrder });
}

function validateOrderId(req, res, next) {
  const { orderId } = req.params;
  const findOrder = orders.find((order) => (order.id = orderId));

  if (findOrder) {
    res.locals.findOrder = findOrder;
    next();
  }

  next({
    status: 404,
    message: "no matching order found",
  });
}

function read(req, res, next) {
  const findOrder = res.locals.findOrder;
  res.status(200).json({ data: findOrder });
}

module.exports = {
  list,
  create: [validateOrder, create],
  read: [validateOrderId, read],
};
