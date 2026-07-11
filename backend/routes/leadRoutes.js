import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// Define validation rules for creating/updating a lead
const leadValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Invalid source value'),
];

// Define validation rules for status updates
const statusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value'),
];

// -----------------------------
// Routes
// -----------------------------

// @route   GET /api/leads/stats/summary
// @desc    Get stats summary for dashboard (must be above /:id to avoid ObjectId parse)
router.get('/stats/summary', getLeadStats);

// @route   GET /api/leads/stats/monthly
// @desc    Get monthly aggregated stats for the last 6 months
router.get('/stats/monthly', getMonthlyStats);

// @route   GET /api/leads/search?q=&limit=
// @desc    Quick autocomplete search (must be above /:id to avoid ObjectId parse)
router.get('/search', searchLeads);

// @route   GET /api/leads
// @desc    Get all leads for current user
router.get('/', getLeads);

// @route   POST /api/leads
// @desc    Create a new lead
router.post('/', validate(leadValidations), createLead);

// @route   GET /api/leads/:id
// @desc    Get a single lead by ID
router.get('/:id', getLeadById);

// @route   PUT /api/leads/:id
// @desc    Update a lead
router.put('/:id', validate(leadValidations), updateLead);

// @route   PATCH /api/leads/:id/status
// @desc    Update only the lead status
router.patch('/:id/status', validate(statusValidation), updateLeadStatus);

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
router.delete('/:id', deleteLead);

export default router;
