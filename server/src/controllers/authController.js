const authService = require("../services/authService"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async(req,res) =>{
    try{
        const {usernameInput, emailInput, nameInput, passwordInput} = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(passwordInput, salt);

        const documentInfo = {
            username: usernameInput,
            email: emailInput,
            password: hashedPassword,
            name: nameInput,
            friends: [],
        }
        //getUserByUsernameOrEmail if it doesn't exist then create
        userDocument = await authService.getUserByUsernameOrEmail(usernameInput, emailInput);
        if (userDocument.length){
            console.log("User already been registered");
            return res.status(409).json("User already been registered");
        }
        //create user
        await authService.createUser('users', documentInfo, emailInput, usernameInput); 
        userDocument = await authService.getUserByUsernameOrEmail(usernameInput, emailInput);
        console.log("New user has been registered");
        console.log(documentInfo);
        return res.status(200).json(userDocument[0]);
    }
    catch(err){
        return res.status(500).json(err);
    }
}


const login = async(req,res) =>{
    try{
        const { usernameInput, passwordInput } = req.body;
        // userNameInput = "kevhuang@chapman.edu";
        // passwordInput = "1234";
        
        //check username and email for its corresponding account

        const userDocument = await authService.getUserByUsernameOrEmail(usernameInput, usernameInput); //array of all documents that have this is returned, but since it's always a single user/document, array[0] is needed
        console.log(`Controller: ${userDocument[0]}, userDocument length: ${userDocument.length}`);

        console.log(userDocument.length);
        console.log(userDocument[0].password);

        if (userDocument.length === 0){
            setUserNameError('returning 404 User not found');
            return res.status(404).json("User not found");
        }

        //if exists, test the password entry for account
        const checkPassword = bcrypt.compareSync(passwordInput, userDocument[0].password);
        console.log(checkPassword);
        if (!checkPassword) {
            console.log('returning 401 Incorrect password');
            return res.status(401).json("Incorrect Password");
        }

        console.log(`Logging In ${usernameInput}`);
        const token = jwt.sign({id:userDocument[0]._id}, "secretkey");
        const {password, ...others} = userDocument[0];
        res.cookie("accessToken", token, { httpOnly: false });
        console.log(userDocument[0]);
        return res.status(200).json(userDocument[0]);

    }
    catch(err){
        return res.status(500).json(err);
    }
    
}

const logout = async(req,res) =>{
    res.clearCookie("accessToken",{
        secure: true,
        sameSite: "none"
    })
    .status(200).json("User has been logged out");
};

module.exports = {
    login,
    register,
    logout
}

