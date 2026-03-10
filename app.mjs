//app.mjs
//we are in ES6, use this. 
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// const { MongoClient, ServerApiVersion } = require('mongodb');
//const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;


app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Connection failed', error);
    // Ensures that the client will close when you finish/error
    process.exit(1);
  }
}
// run();




// middlewares aka endpoints aka 'get to slash' {http verb} to slash {you name ur endpoint}
app.get('/', (req, res) => {

  // res.send('Hello Express'); //string response
  // res.sendFile('index.html'); // <- this don't work w/o imports, assign, and arguements
  res.sendFile(join(__dirname, 'public', 'index.html'));

})

// OLD TEST CODE !!!
// app.get('/inject', (req, res) => {
//   // Inject a server variable into barry.html: templating view like ejs or pug
//   readFile(join(__dirname, 'public', 'index.html'), 'utf8')
//     .then(html => {
//       // Replace a placeholder in the HTML (e.g., {{myVar}})
//       const injectedHtml = html.replace('{{myVar}}', myVar);
//       res.send(injectedHtml);
//     })
//     .catch(err => {
//       res.status(500).send('Error loading page');
//     });

//   res.send('Hello World | Final Test to ci/cd <a href="https://github.com/andrewmcelvey2/legendary-memory-yar" target="blank">legendary-memory-yar</a>')

// })

// API Health/Endpoints Documentation
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Reaction Challenge',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/scores',
      'POST /api/scores',
      'PUT /api/scores/:id',
      'DELETE /api/scores/:id'
    ]
  });
});

// CRUD Operations

// CREATE
app.post('/api/scores', async (req, res) => {
  try {
    const { playerName, score } = req.body;

    if (!playerName || score === undefined) {
      return res.status(400).json({ error: 'playerName and score are required' });
    }

    const db = client.db('cis486');
    const collection = db.collection('scores');

    const scoreRecord = {
      playerName,
      score: Number(score),
      createdAt: new Date()
    };

    const result = await collection.insertOne(scoreRecord);

    res.status(201).json({
      message: 'Score saved successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// READ
app.get('/api/scores', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('scores');

    const scores = await collection
      .find({})
      .sort({ score: -1, createdAt: 1 })
      .toArray();

    res.json(scores);
  } catch (error) {
    console.error('Error reading scores:', error);
    res.status(500).json({ error: 'Failed to get scores' });
  }
});

// UPDATE
app.put('/api/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { playerName, score } = req.body;

    const db = client.db('cis486');
    const collection = db.collection('scores');

    const updateFields = {
      updatedAt: new Date()
    };

    if (playerName !== undefined) updateFields.playerName = playerName;
    if (score !== undefined) updateFields.score = Number(score);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// DELETE
app.delete('/api/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db('cis486');
    const collection = db.collection('scores');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
});



//start the server. 
run().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
