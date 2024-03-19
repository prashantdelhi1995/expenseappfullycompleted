const express = require("express");

const purchaseMembershipController = require("../controller/purchaseMemberShipController");

const authenticatemiddleware = require("../middleware/middleware");

const router = express.Router();

router.get(
  "/premiumMembership",
  authenticatemiddleware,
  purchaseMembershipController.purchasePremium
);

router.post(
  "/updateTransactionStatus",
  authenticatemiddleware,
  purchaseMembershipController.updateTransactionStatus
);

module.exports = router;
