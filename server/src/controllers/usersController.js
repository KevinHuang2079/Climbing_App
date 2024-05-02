const usersService = require("../services/usersService");
const dbHandler = require("../database/dbHandler");

const getUser = async (req, res) => {
    const userID = req.params.userID; //get userID from request parameters
    try {
        const userData = await usersService.getUserByID(userID);
        console.log(userData);
        
        if (userData) {
            // If user data is found, send it as the response
            res.status(200).json(userData);
        } else {
            // If user data is not found, send a 404 Not Found response
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        console.error("getUser(): Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

const userAddFriend = async (req, res) => {
    const userID = req.params.userID;
    const friendID = req.params.friendID;
    try{
        console.log("controller:", userID, friendID);
        await dbHandler.addFriend(userID, friendID);
        res.end();
    } catch (error) {
        console.error("Error adding friend:", error);
        res.status(500).send("Failed to add friend"); // Send an error response if needed
    }
};

module.exports = {
    getUser,
    userAddFriend
};
