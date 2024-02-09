const express = require("express");
const auth = require("../middleware/auth");
const { handleUserSignup,handleUserLogin,dummyTestApi} = require("../controllers/user");
const userRoles = require("../middleware/userRoles");

const router = express.Router();

router.post("/signUp", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/dummyTestApi",[auth,userRoles],dummyTestApi);

module.exports = router;
