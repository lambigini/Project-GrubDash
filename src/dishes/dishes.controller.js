const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next) {
  res.json({ data: dishes });
}

function validateDish(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (
    name &&
    description &&
    price &&
    Number.isInteger(price) &&
    price > 0 &&
    image_url
  ) {
    return next();
  }

  if (name === undefined || name === "")
    return next({
      status: 400,
      message: "name",
    });
  if (description === undefined || description === "")
    return next({
      status: 400,
      message: "description",
    });
  if (price === undefined || price <= 0)
    return next({
      status: 400,
      message: "price",
    });

  if (image_url === undefined || image_url === "")
    return next({
      status: 400,
      message: "image_url",
    });
}

function create(req, res, next) {
  // create the data from dishes with the new id
  // attach the data to req.body
  // push the new dish to the data
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishes.push(newDish);
  // console.log("newDish ", newDish);
  // console.log("Dishes ", dishes);

  res.status(201).json({ data: newDish });
}

function validateDishId(req, res, next) {
  const dishId = req.params.dishId;

  const findDish = dishes.find((dish) => dish.id === dishId);
  if (findDish) {
    res.locals.findDish = findDish;
    next();
  }
  next({
    status: 404,
    message: "dish not found",
  });
}

function read(req, res, next) {
  //get the id from param
  //find the id in the dish
  // return the dish matched the id

  const findDish = res.locals.findDish;

  res.status(200).json({ data: findDish });
}

function validateUpdateId(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  if (
    name &&
    description &&
    price &&
    Number.isInteger(price) &&
    price > 0 &&
    image_url
  ) {
    return next();
  }

  const dishId = req.params.dishId;
  if (dishId === undefined) {
    return next({
      status: 404,
      message: `Dish does not exist: $dishId}`,
    });
  }

  if (id !== dishId) {
    return next({
      status: 404,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }

  if (name === undefined || name === "")
    return next({
      status: 400,
      message: "name",
    });
  if (description === undefined || description === "")
    return next({
      status: 400,
      message: "description",
    });
  if (price === undefined || price <= 0)
    return next({
      status: 400,
      message: "price",
    });

  if (image_url === undefined || image_url === "")
    return next({
      status: 400,
      message: "image_url",
    });
}

function update(req, res, next) {
  // find the dish matched the id
  // update the dish
  const findDish = res.locals.findDish;

  // const { data: { id, name, description, image_url, price } = {} } = req.body;
  const dataFromBody = req.body.data;

  // if (dataFromBody.id !== findDish.id) {
  //   return next({
  //     status: 400,
  //     message: `Dish id does not match route id. Dish: ${dataFromBody.id}, Route: ${dishId}`,
  //   });
  // }
  console.log("findDish,", findDish);
  console.log("dataFromBody,", dataFromBody);

  if (
    findDish.id != dataFromBody.id ||
    findDish.name !== dataFromBody.name ||
    findDish.description !== dataFromBody.description ||
    findDish.image_url !== dataFromBody.image_url ||
    findDish.price !== dataFromBody.price
  ) {
    findDish.id = dataFromBody.id;
    findDish.name = dataFromBody.name;
    findDish.description = dataFromBody.description;
    console.log(
      " findDish.description,dataFromBody.description ",
      findDish.description,
      dataFromBody.description
    );
    findDish.image_url = dataFromBody.image_url;
    findDish.price = dataFromBody.price;
  }
  console.log("findDish updated,", findDish);
  res.status(200).json({ data: findDish });
}

module.exports = {
  list,
  create: [validateDish, create],
  read: [validateDishId, read],
  update: [validateUpdateId, update],
};
