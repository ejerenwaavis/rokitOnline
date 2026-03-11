const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminCheck');
const upload = require('../middleware/upload');
const {
  getStats, getAllOrders, updateOrder, acceptOffer, getAllQuotations, updateQuotation,
  getAllDesigns, getAllCustomers, updateUserRole, getMessages, markMessageRead,
  getClients, createClient, deleteClient,
} = require('../controllers/adminController');
const { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } = require('../controllers/portfolioController');
const { createTutorial, updateTutorial, deleteTutorial } = require('../controllers/tutorialsController');
const { createService, updateService, deleteService } = require('../controllers/servicesController');

router.use(protect, adminOnly);

router.get('/stats', getStats);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:id', updateOrder);
router.post('/orders/:id/accept-offer', acceptOffer);

// Quotations
router.get('/quotations', getAllQuotations);
router.patch('/quotations/:id', updateQuotation);

// Design requests
router.get('/designs', getAllDesigns);

// Portfolio
router.post('/portfolio', upload.array('images', 10), createPortfolioItem);
router.put('/portfolio/:id', updatePortfolioItem);
router.delete('/portfolio/:id', deletePortfolioItem);

// Tutorials
router.post('/tutorials', upload.single('thumbnail'), createTutorial);
router.put('/tutorials/:id', upload.single('thumbnail'), updateTutorial);
router.delete('/tutorials/:id', deleteTutorial);

// Services
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Customers
router.get('/customers', getAllCustomers);
router.patch('/customers/:id/role', updateUserRole);

// Contact messages
router.get('/messages', getMessages);
router.patch('/messages/:id/read', markMessageRead);

// Client logos
router.get('/clients', getClients);
router.post('/clients', createClient);
router.delete('/clients/:id', deleteClient);

module.exports = router;
