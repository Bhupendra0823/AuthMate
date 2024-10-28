const express = require("express");

const router = express.Router();

const {
  registerLoginControlTest,
  authLoginControl,
  authRegisterControl,
  authLogoutControl,
} = require("../controllers/registerLoginControl");

router.use(express.json());
router.get("/test", registerLoginControlTest);
router.post("/login", authLoginControl);
router.post("/register", authRegisterControl);
router.post("/logout", authLogoutControl);

module.exports = router;
