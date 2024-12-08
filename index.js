const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app= express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', ( req, res) =>{
    res.send('Coffee is running')
})

app.listen(port, ()=>{
    console.log('server running on port', port)
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.bhp2qs5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // my code start here

    const coffeeCollection = client.db('b9-coffee').collection('coffee_list')

    //post
    app.post('/addcoffee', async(req, res)=>{
        const coffee = req.body;
        console.log('coffee data',coffee)
        const result =await coffeeCollection.insertOne(coffee);
        res.send(result);
    })

    //show
    app.get('/coffees', async(req, res) =>{
        const coffees = coffeeCollection.find();
        const result = await coffees.toArray();
        res.send(result)
    })

    // Delete
    app.delete('/coffees/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('delete item =',id);
        const query = {_id : new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result); 
    })

    // update
    app.get('/coffees/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result)
    })

    app.put('/coffees/:id', async (req, res) =>{
        const id = req.params.id;
        const coffee = req.body;
        console.log('update data',coffee)
        const filter ={_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateCoffee ={
            $set:{
                name: coffee.name,
                chef: coffee.chef,
                supplier: coffee.supplier,
                taste: coffee.taste,
                category: coffee.category,
                details: coffee.details,
                photoUrl: coffee.photoUrl
            }
        }
        const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
        res.send(result)
    })



    // my code end here


    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//all done
