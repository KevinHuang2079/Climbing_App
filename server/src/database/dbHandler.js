const { MongoClient, ServerApiVersion } = require('mongodb');
const password = "Schwein09";
const uri = `mongodb+srv://kevhuang2402212:${password}@database.o9ff4tb.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error(err); 
        throw err;
    } 
}

async function createCollection(CollectionName) {
    try {
        const database = client.db('climbingApp');

        console.log(`Collection created: ${CollectionName}`)
    } catch(err) {
        console.error(err);
        throw err;
    }
}

async function createCollections() {
    try {
        await createCollection('users');
        await createCollection('friends');
        await createCollection('climbs');
        await createCollection('posts');
        await createCollection('comments');
        await createCollection('notifications');        
    } catch(err){
        console.error(err);
    } finally {
        await client.close()
    }
}

async function createDocument(collectionName, documentInfo) {
    try {
        const database = client.db('climbingApp');
        const collection = database.collection(collectionName);
        const newDocument = await collection.insertOne(documentInfo);
        console.log('Document created:', newDocument.insertedId);
        return newDocument.insertedId;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

async function deleteDocument(collectionName, documentID) {
    try {
        const database = client.db('ClimbingApp');
        const collection = database.collection(collectionName);
        const deletedDocument = await collection.deleteOne({_id: documentID});

        if (deletedDocument.deletedCount === 1){
            console.log("Deleted document successfully");
            return true;
        } else {
            console.log("Document delete unsuccessful")
            return false;
        }
    } catch(err) {
        console.error(err);
        throw err;
    }
}

async function updateDocument(collectionName, filter, update) {
    try {
        const database = client.db('climbingApp');
        const collection = database.collection(collectionName);
        const result = await collection.updateOne(filter, { $set: update });
        console.log(`Updated ${result.modifiedCount} document(s).`);
        return result;
    } catch (err) {
        console.error("Error updating document:", err);
        throw err;
    }
}

async function readDocument(collectionName, fieldName, fieldValue) {
    try {
        const database = client.db('climbingApp');
        const collection = database.collection(collectionName);
        
        const query = {};
        query[fieldName] = fieldValue;
        const documents = await collection.find(query).toArray();
        if (documents.length === 0){
            console.log("Read query: Document not found, returning empty document");
        }
        return documents;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    connectToDatabase,
    createCollections,
    createDocument,
    deleteDocument,
    updateDocument,
    readDocument
};

