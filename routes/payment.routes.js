const express= require('express');
const router= express.Router();

const { createOrder}=require('../controllers/payment.controller');

router.post('/create-order', createOrder);
router.post('/verify-payment', veriFyPayment);

module.exports=router;


