# Step-by-Step Guide to Build and Implement the Payment Gateway

This guide provides a step-by-step explanation to set up and implement the payment gateway functionality as demonstrated in the `payment.controller.js` file.

---

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed on your system.
2. **Razorpay Account**: Create an account on Razorpay to obtain the required API keys.
3. **Environment Variables**: Set up a `.env` file to store sensitive information like API keys.

---

## Step 1: Install Required Dependencies

Run the following command to install the necessary packages:

```bash
npm install dotenv crypto
```

- `dotenv`: To manage environment variables securely.
- `crypto`: To handle cryptographic operations like HMAC generation.

---

## Step 2: Configure Razorpay

1. Create a configuration file for Razorpay in the `config` directory (e.g., `razorpay.config.js`).
2. Use the Razorpay SDK or manually configure the Razorpay instance.

Example:

```javascript
const Razorpay = require('razorpay');

function createRazorpayInstance() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

module.exports = createRazorpayInstance;
```

---

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the root directory.
2. Add the following keys:

```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

3. Load the `.env` file in your application using `dotenv`:

```javascript
require('dotenv').config();
```

---

## Step 4: Create the Payment Controller

The `payment.controller.js` file contains two main functions:

### 4.1 Create Order

- This function generates a Razorpay order.
- Key steps:
  1. Extract `courseId` and `amount` from the request body.
  2. Define Razorpay order options (amount, currency, receipt).
  3. Use the Razorpay instance to create the order.

Example:

```javascript
const options = {
    amount: amount * 100, // Convert amount to paise
    currency: "INR",
    receipt: `receipt_order_${Math.random() * 1000}`
};

const order = await razorpayInstance.orders.create(options);
```

### 4.2 Verify Payment

- This function verifies the payment signature sent by Razorpay.
- Key steps:
  1. Extract `order_id`, `payment_id`, and `signature` from the request body.
  2. Generate an HMAC using the `crypto` module.
  3. Compare the generated signature with the received signature.

Example:

```javascript
const hash = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
hash.update(order_id + "|" + payment_id);
const generated_signature = hash.digest('hex');

if (generated_signature === signature) {
    // Payment verified
}
```

---

## Step 5: Define Routes

1. Create a `payment.routes.js` file in the `routes` directory.
2. Define routes for creating orders and verifying payments.

Example:

```javascript
const express = require('express');
const { createOrder, veriFyPayment } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', veriFyPayment);

module.exports = router;
```

---

## Step 6: Integrate Routes in the Server

1. Open the `server.js` file.
2. Import the payment routes and use them in the application.

Example:

```javascript
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payment', paymentRoutes);
```

---

## Step 7: Test the Implementation

1. Use tools like Postman to test the API endpoints:
   - `POST /api/payment/create-order`
   - `POST /api/payment/verify-payment`
2. Verify that orders are created and payments are validated successfully.

---

## Step 8: Deploy the Application

1. Choose a hosting platform (e.g., Heroku, AWS, Vercel).
2. Set up environment variables on the hosting platform.
3. Deploy the application.

---

By following these steps, you can successfully build and implement the payment gateway functionality in your application.