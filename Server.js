const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.get('/Register', (req, res) => {
    res.send('This is the Sign In page.');
});

app.get('/Login', (req, res) => {
    res.send('This is the Login page.');
});

app.get('/Home', (req, res) => {
    res.send('This is the Home page.');
});

app.get('/Search', (req, res) => {
    res.send('This is the Search page.');
});

app.get('/Add', (req, res) => {
    res.send('This is the Shopping Bag page.');
});

app.get('/Logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


app.get('/Checkout', (req, res) => {
    res.send('This is the Checkout page.');
});

app.get('/Payments', (req, res) => {
    res.send('This is the Payments page.');
});

app.get('/Invoice', (req, res) => {
    res.send('This is the Invoice page.');
});


// Define Seller schema
const sellerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
});

// Define Customer schema
const customerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
});

const Seller = mongoose.model('Seller', sellerSchema);
const Customer = mongoose.model('Customer', customerSchema);

// Define routes
app.get('/', (req, res) => {
    res.send('Welcome to ConstructConnect!');
});

app.post('/register-seller', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new seller
        const seller = new Seller({ username, password: hashedPassword, email, phone });
        await seller.save();

        res.send('Seller registered successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/register-customer', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer
        const customer = new Customer({ username, password: hashedPassword, email, phone });
        await customer.save();

        res.send('Customer registered successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user is a seller
        const seller = await Seller.findOne({ username });
        if (seller && await bcrypt.compare(password, seller.password)) {
            req.session.user = seller;
            return res.send('Seller login successful!');
        }

        // Check if the user is a customer
        const customer = await Customer.findOne({ username });
        if (customer && await bcrypt.compare(password, customer.password)) {
            req.session.user = customer;
            return res.send('Customer login successful!');
        }

        res.status(401).send('Invalid credentials');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
