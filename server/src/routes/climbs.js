const express = require("express");
const router = express.Router();
const climbsController = require("../controllers/climbController.js");

router.get("/", (req,res) =>{
    res.send("get all climbs")
});

router.get("/:climbID", (req,res) =>{
    res.send("get specific climb")
});

router.post("/", (req, res) =>{
    res.send("create climb")
});

router.patch("/:climbID", (req, res) =>{
    res.send("update climb")
});

router.delete("/:climbID", (req, res) => {
    res.send("delete existing climb")
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const usersController = require("./controllers/climbsController.js");

// router.get("");

// module.exports = router;