const express = require('express');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
//obligatoire
app.use(express.json());
app.use(cors());

// 2) connexion de notre serveur à la base mongo
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1';  // ou 127.0.0.1 pour certains
const dbName = 'fullstack2023';


let db

MongoClient.connect(url, function (err, client) {
    console.log("Connexion réussi avec Mongo DB et compass");
    db = client.db(dbName);
});
app.listen(85, () => {
    console.log('API Rest- Projet MEAN STACK')
  })
  
// // 3.1)Get All countries
app.get('/equipes', (req, res) => {
    db.collection('equipe').find({}).toArray(function (err, data) {
        if (err) {
            console.log(err)
            throwerr
        }
        res.status(200).json(data)
    })
})

// //3.2) Post new Country
app.post('/equipes', async (req, res) => {
    try {
        const equipeData = req.body
        const equipe = await db.collection('equipe').insertOne(equipeData)
        res.status(201).json(equipe)
    } catch (err) {
        console.log(err)
        throw err
    }
})


// // 3.1)Get One equipe
// Assuming you have initialized your Express app and connected to MongoDB using 'db' variable

// 3.1) Get One equipe
app.get('/equipes/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming db.collection returns a promise, you need to await it
        const equipe = await db.collection('equipe').findOne({ "_id": ObjectId(id) });

        // Check if equipe is null (not found)
        if (!equipe) {
            return res.status(404).json({ error: "Equipe not found" });
        }

        console.log(equipe);
        return res.status(200).json(equipe);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// // Delete equipe
app.delete('/equipes/:id', async (req, res) => {
    try{
        const id = req.params.id
        const equipe = await db.collection('equipe').deleteOne({ "_id": ObjectId(id) })
        res.status(200).json(equipe)
    }catch (err) {
        console.log(err)
        throw err
    }
})

// // 3.1)Get One equipe
app.put('/equipes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const remplacementEquipe = req.body;
        console.log(remplacementEquipe);
        const filter = { _id: ObjectId(id) };

        // Use updateOne to update a single document
        const result = await db.collection('equipe').updateOne(filter, { $set: {"name":remplacementEquipe.name,"country":remplacementEquipe.country} });

        // Check if the document was found and updated
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Equipe not found or not updated" });
        }

        res.status(200).json({ message: "Equipe updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});