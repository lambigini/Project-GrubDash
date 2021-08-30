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
  const findOrder = orders.find((order, index) => order.id === orderId);

  if (findOrder) {
    res.locals.findOrder = findOrder;
    next();
  }

  next({
    status: 404,
    message: `no matching order found at order ${orderId}`,
  });
}

function read(req, res, next) {
  const findOrder = res.locals.findOrder;
  res.status(200).json({ data: findOrder });
}

function validateDestroy(req, res, next) {
  const findOrder = res.locals.findOrder;

  if (findOrder.status !== "pending")
    next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
    });

  next();
}

function destroy(req, res, next) {
  // go to orders, look for order id match with the order provided
  // delete the order
  // send the response back
  const { orderId } = req.params;
  const index = orders.findIndex((order) => (order.id = orderId));

  orders.splice(index, 1);

  res.sendStatus(204);
}

function validateUpdate(req, res, next) {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;

  if (id === null || id === undefined || id === "") {
    return next();
  }

  console.log("id, orderId ", id, orderId);
  if (id !== orderId)
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
    });
  else next();
}

function isStatusValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const { orderId } = req.params;

  // if (
  //   status === null ||
  //   status === undefined ||
  //   status === ""
  // ) {
  //   return next({
  //     status: 400,
  //     message: `Order must have a status of pending, preparing, out-for-delivery, delivered`
  //   })
  // }

  if (
    status !== ("pending" || "preparing" || "out-for-delivery" || "delivered")
  ) {
    next({
      status: 400,
      message:
        " Order must have a status of pending, preparing, out-for-delivery, delivered.",
    });
  }

  if (status === "delivered")
    next({
      status: 400,
      message: `A delivered order cannot be changed`,
    });
  next();
}

function update(req, res, next) {
  // not working with the second verified
  // const findOrder = res.locals.findOrder;
  // const dataFromBody = req.body.data;

  // findOrder.id = dataFromBody.id;
  // findOrder.deliverTo = dataFromBody.deliverTo;
  // findOrder.mobileNumber = dataFromBody.mobileNumber;
  // findOrder.status = dataFromBody.status;
  // findOrder.dishes = dataFromBody.dishes;

  // res.status(200).json({ data: findOrder });

  const { orderId } = req.params;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const updatedOrder = {
    id: orderId,
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  return res.json({ data: updatedOrder });
}

module.exports = {
  list,
  create: [validateOrder, create],
  read: [validateOrderId, read],
  destroy: [validateOrderId, validateDestroy, destroy],
  update: [
    validateOrderId,
    validateOrder,
    validateUpdate,
    isStatusValid,
    update,
  ],
};
