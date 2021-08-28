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
  console.log("newDish ", newDish);
  console.log("Dishes ", dishes);

  res.status(201).json({ data: newDish });
}

module.exports = {
  list,
  create: [validateDish, create],
};
