const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminCheck');
const upload = require('../middleware/upload');
const {
  getStats,
  getAllOrders,
  updateOrder,
  deleteOrder,
  bulkDeleteOrders,
  bulkUpdateOrderStatus,
  acceptOffer,
  forwardOrder,
  getAllQuotations,
  updateQuotation,
  deleteQuotation,
  bulkDeleteQuotations,
  bulkUpdateQuotationStatus,
  getAllDesigns,
  updateDesign,
  deleteDesign,
  bulkDeleteDesigns,
  bulkUpdateDesignStatus,
  getAllCustomers,
  updateUserRole,
  updateUserStatus,
  deleteCustomer,
  bulkDeleteCustomers,
  bulkUpdateCustomerStatus,
  getMessages,
  markMessageRead,
  deleteMessage,
  bulkDeleteMessages,
  bulkMarkMessagesRead,
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/adminController');
const { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } = require('../controllers/portfolioController');
const { createTutorial, updateTutorial, deleteTutorial } = require('../controllers/tutorialsController');
const { createService, updateService, deleteService } = require('../controllers/servicesController');

router.use(protect, adminOnly);

router.get('/stats', getStats);

// Orders
router.get('/orders', getAllOrders);
router.post('/orders/bulk-delete', bulkDeleteOrders);
router.post('/orders/bulk-status', bulkUpdateOrderStatus);
router.patch('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);
router.post('/orders/:id/accept-offer', acceptOffer);
router.post('/orders/:id/forward', forwardOrder);

// Quotations
router.get('/quotations', getAllQuotations);
router.post('/quotations/bulk-delete', bulkDeleteQuotations);
router.post('/quotations/bulk-status', bulkUpdateQuotationStatus);
router.patch('/quotations/:id', updateQuotation);
router.delete('/quotations/:id', deleteQuotation);

// Design requests
router.get('/designs', getAllDesigns);
router.post('/designs/bulk-delete', bulkDeleteDesigns);
router.post('/designs/bulk-status', bulkUpdateDesignStatus);
router.patch('/designs/:id', updateDesign);
router.delete('/designs/:id', deleteDesign);

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
router.post('/customers/bulk-delete', bulkDeleteCustomers);
router.post('/customers/bulk-status', bulkUpdateCustomerStatus);
router.patch('/customers/:id/role', updateUserRole);
router.patch('/customers/:id/status', updateUserStatus);
router.delete('/customers/:id', deleteCustomer);

// Contact messages
router.get('/messages', getMessages);
router.post('/messages/bulk-delete', bulkDeleteMessages);
router.post('/messages/bulk-read', bulkMarkMessagesRead);
router.patch('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

// Client logos
router.get('/clients', getClients);
router.post('/clients', upload.single('logo'), createClient);
router.put('/clients/:id', upload.single('logo'), updateClient);
router.delete('/clients/:id', deleteClient);

module.exports = router;
