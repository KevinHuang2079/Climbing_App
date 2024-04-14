const { MongoClient, ServerApiVersion } = require('mongodb');
const password = "Schwein09";
const uri = `mongodb+srv://kevhuang2402212:${password}@database.o9ff4tb.mongodb.net/?retryWrites=true&w=majority`;
const asyncHandler = require('express-async-handler');
const dbHandler = require("../database/dbHandler.js");

//Create User: Insert a new user into the database with all the provided user attributes.
//createDocument(collectionName, documentInfo)
const createUser = async (collectionName, documentInfo, emailInput, userNameInput) => {
    const client = new MongoClient(uri);
    try{
      const database = client.db('climbingApp');  

      //TODO: find out if this user (by email and username check, 2 separate checks) exists in database already, if it does, then handle
      const existingUserEmail = await dbHandler.readDocument('users', 'email', userNameInput);
      const existingUserName = await dbHandler.readDocument('users', 'username', emailInput);
      console.log(existingUserEmail.length);
      console.log(existingUserName.length);
      if ( existingUserEmail.length ){
        console.log("Email already registered");
        return existingUserEmail;
      }
      else if (existingUserName.length){
        console.log("Username already exists");
        return existingUserName;
      }

      dbHandler.createDocument('users', documentInfo);
    } 
    catch (err) {
      console.error('Error creating user:', err);
      throw err;
    } 
    finally {
      await client.close();
    }
  };

// Get User by Username: Retrieve user information based on their username.
  const getUserByUsernameOrEmail = async (userNameInput, emailInput) => {
    const client = new MongoClient(uri);
    try {

      const database = client.db('climbingApp');
      const usersCollection = database.collection('users');
  
      const emailExisting = await dbHandler.readDocument('users', 'username', userNameInput);
      const userNameExisting = await dbHandler.readDocument('users', 'email', emailInput);

      if (emailExisting.length !== 0) {
        return emailExisting;
      }
      else if (userNameExisting.length !== 0){
        return userNameExisting;
      }
      console.log("Service: No existing email or username");

      return userNameExisting;
    } 
    catch (err) {
      console.error('Error fetching user:', err);
    } 
    finally {
      await client.close();
    }
  };

  module.exports = {
    createUser,
    getUserByUsernameOrEmail
  }