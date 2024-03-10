const usersService = require("../services/usersService");

const getUser = async (req, res) => {
    const userID  = req.params.userID; // Extract userID from request parameters
    try {
        // Call service function to retrieve user data based on userID
        //console.log(userID);
        const userData = await usersService.getUserByID(userID);
        console.log(userData);
        
        // Check if user data exists
        if (userData) {
            // If user data is found, send it as the response
            res.status(200).json(userData);
            //return userData;
        } else {
            // If user data is not found, send a 404 Not Found response
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

module.exports = {
    getUser
};
