const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');


// Connect to the database
mongodb.connect("mongodb://localhost:27017/eldohub", (err, client) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
  const db = client.db("eldohub");
  const customers = db.collection('customers');
  const accounts = db.collection('accounts');
  const cards = db.collection('cards');

// Parse incoming request bodies
app.use(bodyParser.json());

// Create a customer
app.post('/customers', (req, res) => {
  const customer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  customers.insertOne(customer, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error creating customer',
        error: err
      });
    } else {
      res.status(201).json({
        message: 'Customer created successfully',
        customer: result.ops[0]
      });
    }
  });
});

// Create a customer account
app.post('/accounts', (req, res) => {
  const account = {
    customerId: req.body.customerId,
    balance: req.body.balance
  };
  accounts.insertOne(account, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error creating account',
        error: err
      });
    } else {
      res.status(201).json({
        message: 'Account created successfully',
        account: result.ops[0]
      });
    }
  });
});

// Top up a customer account
app.put('/accounts/:accountId/top-up', (req, res) => {
  const accountId = new mongodb.ObjectID(req.params.accountId);
  const topUpAmount = req.body.amount;
  accounts.findOneAndUpdate(
    { _id: accountId },
    { $inc: { balance: topUpAmount } },
    { returnOriginal: false },
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: 'Error topping up account',
          error: err
        });
      } else if (!result.value) {
        res.status(404).json({
          message: 'Account not found',
          error: err
        });
    } else {
    res.status(200).json({
    message: 'Account topped up successfully',
    account: result.value
    });
    }
    }
    );
    });
    
    // Withdraw from a customer account
    app.put('/accounts/:accountId/withdraw', (req, res) => {
    const accountId = new mongodb.ObjectID(req.params.accountId);
    const withdrawalAmount = req.body.amount;
    accounts.findOneAndUpdate(
    { _id: accountId },
    { $inc: { balance: -withdrawalAmount } },
    { returnOriginal: false },
    (err, result) => {
    if (err) {
    res.status(500).json({
    message: 'Error withdrawing from account',
    error: err
    });
    } else if (!result.value) {
    res.status(404).json({
    message: 'Account not found',
    error: err
    });
    } else {
    res.status(200).json({
    message: 'Withdrawal from account successful',
    account: result.value
    });
    }
    }
    );
    });
    
    // Create a customer card
    app.post('/cards', (req, res) => {
    const card = {
    customerId: req.body.customerId,
    cardNumber: req.body.cardNumber,
    cardType: req.body.cardType
    };
    cards.insertOne(card, (err, result) => {
    if (err) {
    res.status(500).json({
    message: 'Error creating card',
    error: err
    });
    } else {
    res.status(201).json({
    message: 'Card created successfully',
    card: result.ops[0]
    });
    }
    });
    });

    // Get a customer by ID
  app.get('/customers/:customerId', (req, res) => {
  const customerId = new mongodb.ObjectID(req.params.customerId);
  customers.findOne({ _id: customerId }, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error getting customer',
        error: err
      });
    } else if (!result) {
      res.status(404).json({
        message: 'Customer not found'
      });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get an account by ID
app.get('/accounts/:accountId', (req, res) => {
  const accountId = new mongodb.ObjectID(req.params.accountId);
  accounts.findOne({ _id: accountId }, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error getting account',
        error: err
      });
    } else if (!result) {
      res.status(404).json({
        message: 'Account not found'
      });
    } else {
      res.status(200).json(result);
    }
  });
});

// Get a card by ID
app.get('/cards/:cardId', (req, res) => {
  const cardId = new mongodb.ObjectID(req.params.cardId);
  cards.findOne({ _id: cardId }, (err, result) => {
    if (err) {
      res.status(500).json({
        message: 'Error getting card',
        error: err
      });
    } else if (!result) {
      res.status(404).json({
        message: 'Card not found'
      });
    } else {
      res.status(200).json(result);
    }
  });
});

    
    // Start the server
    app.listen(3000, () => {
    console.log('Microservice listening on port 3000');
    })
});
