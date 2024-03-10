const asyncHandler = require('express-async-handler');
const climbService = require("../services/climbsService.js");

const getAllClimbs = asyncHandler(async (req, res) => {
    res.send("get all climbs");
    const allClimbs = await climbService.getAllClimbs();
});

const createNewClimb = asyncHandler(async (req, res) => {
    res.send("create new climb");
    const newClimb = await climbService.createNewClimb();
});

const updateOneClimb = asyncHandler(async (req, res) => {
    res.send("Update an existing climb");
    const updatedClimb = await climbService.updateClimb();
});

const deleteOneClimb = asyncHandler(async (req, res) => {
    res.send("delete a climb");
    await climbService.deleteClimb();
});

module.exports = {
    getAllClimbs,
    createNewClimb,
    updateOneClimb,
    deleteOneClimb,
};
