const router = require("express").Router();

// TODO: Implement the /dishes routes needed to make the tests pass
const controller = require("./dishes.controller");

router.route("/").get(controller.list);

module.exports = router;
