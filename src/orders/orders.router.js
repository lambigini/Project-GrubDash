const router = require("express").Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /orders routes needed to make the tests pass
const controller = require("./orders.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:orderId")
  .get(controller.read)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
