import express from 'express';
import { createConsult, createOrder, createOrderA, deleteOrder, getOrderData, updateOrder } from '../controllers/orderControllers.js';

const orderRouter = express.Router();

orderRouter.get('/data', getOrderData);
orderRouter.post('/create-order', createOrder);
orderRouter.post('/create-orderA', createOrderA);
orderRouter.post('/consult', createConsult);
orderRouter.put('/update-order', updateOrder);
orderRouter.post('/delete-order', deleteOrder);

export default orderRouter;