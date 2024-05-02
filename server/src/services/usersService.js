const asyncHandler = require('express-async-handler');
const dbHandler = require("../database/dbHandler.js");
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB library

const getUserByID = async(userID) =>{
    const objectID = new ObjectId(userID); 
    return dbHandler.readDocument('users', '_id', objectID); //collectionName, fieldName, fieldValue

};


module.exports = {
    getUserByID,
}