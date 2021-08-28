const router = require("express").Router();

// TODO: Implement the /dishes routes needed to make the tests pass
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:dishId").get(controller.read).all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
