import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Short-hand for the current user's ObjectId used in $match stages */
const ownerMatch = (userId) => ({ owner: new mongoose.Types.ObjectId(userId) });

/**
 * Build the start and end of a calendar month boundary as UTC Date objects.
 * @param {number} year
 * @param {number} month - 0-indexed (0 = January)
 * @returns {{ start: Date, end: Date }}
 */
const monthBounds = (year, month) => ({
  start: new Date(Date.UTC(year, month, 1)),
  end:   new Date(Date.UTC(year, month + 1, 1)), // exclusive upper bound
});

/**
 * Build a "Jan 2025" label from a year and 0-indexed month number.
 * @param {number} year
 * @param {number} monthIdx - 0-indexed
 * @returns {string}
 */
const monthLabel = (year, monthIdx) => {
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${MONTH_NAMES[monthIdx]} ${year}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all leads for the authenticated user with dynamic filtering,
 * sorting, and cursor-based pagination.
 *
 * @route   GET /api/leads
 * @access  Private
 *
 * @param {string}  [req.query.page=1]        - Page number (1-indexed)
 * @param {string}  [req.query.limit=20]       - Records per page
 * @param {string}  [req.query.sortBy=createdAt] - Field to sort on
 * @param {string}  [req.query.sortOrder=desc] - 'asc' or 'desc'
 * @param {string}  [req.query.status]         - Filter by status value
 * @param {string}  [req.query.search]         - Free-text search on name/company/email
 * @param {string}  [req.query.source]         - Filter by lead source
 * @param {string}  [req.query.dateFrom]       - ISO date string – lower bound on createdAt
 * @param {string}  [req.query.dateTo]         - ISO date string – upper bound on createdAt
 *
 * @returns {{ success, data, pagination: { total, page, limit, pages, hasNext, hasPrev } }}
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      search,
      source,
      dateFrom,
      dateTo,
      page      = 1,
      limit     = 20,
      sortBy    = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeads] user=${req.user._id} page=${page} limit=${limit}`);
    }

    // Always scope to the authenticated owner ─────────────────────────────────
    const filter = {};
    // Status filter ───────────────────────────────────────────────────────────
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Source filter ───────────────────────────────────────────────────────────
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Date range filter on createdAt ──────────────────────────────────────────
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo)   filter.createdAt.$lte = new Date(dateTo);
    }

    // Free-text search (case-insensitive regex across name / company / email) ─
    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum  = parseInt(page,  10);
    const limitNum = parseInt(limit, 10);
    const sortObj  = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Run count and data fetch in parallel for performance ────────────────────
    const [leads, total] = await Promise.all([
      Lead.find(filter)
          .sort(sortObj)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new lead owned by the authenticated user.
 *
 * @route   POST /api/leads
 * @access  Private
 *
 * @param {string}  req.body.name
 * @param {string}  req.body.company
 * @param {string}  req.body.email
 * @param {string}  [req.body.phone]
 * @param {string}  [req.body.status]
 * @param {string}  [req.body.source]
 * @param {string}  [req.body.notes]
 *
 * @returns {{ success: true, lead: Lead }}
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[createLead] user=${req.user._id}`);
    }

    const { name, company, email, phone, status, source, notes } = req.body;

    const lead = await Lead.create({
      name, company, email, phone, status, source, notes,
      owner: req.user._id,
    });

    return res.status(201).json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get a single lead by ID (owner-isolated).
 *
 * @route   GET /api/leads/:id
 * @access  Private
 * @returns {{ success, data: Lead }}
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadById] id=${req.params.id} user=${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    return successResponse(res, lead, 'Lead fetched successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace an entire lead document (PUT semantics).
 *
 * @route   PUT /api/leads/:id
 * @access  Private
 * @param   {Object} req.body - All updatable lead fields
 * @returns {{ success, data: Lead }}
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLead] id=${req.params.id} user=${req.user._id}`);
    }

    const updates = { ...req.body };
    delete updates.owner; // Never allow ownership transfer

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!lead) return errorResponse(res, 'Lead not found', 404);
    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Patch only the status field of a lead.
 *
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 * @param   {string} req.body.status - New status value
 * @returns {{ success, data: Lead }}
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLeadStatus] id=${req.params.id} user=${req.user._id}`);
    }

    const { status } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) return errorResponse(res, 'Lead not found', 404);
    return successResponse(res, lead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hard-delete a lead by ID (owner-isolated).
 *
 * @route   DELETE /api/leads/:id
 * @access  Private
 * @returns {{ success: true, message: string }}
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[deleteLead] id=${req.params.id} user=${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    await lead.deleteOne();
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get comprehensive lead statistics for the dashboard in a SINGLE DB query
 * using MongoDB $facet to run parallel sub-pipelines.
 *
 * @route   GET /api/leads/stats/summary
 * @access  Private
 *
 * @returns {{
 *   totalLeads:      number,
 *   statusBreakdown: { [status: string]: number },
 *   sourceBreakdown: { [source: string]: number },
 *   conversionRate:  number,   // (Won / total) * 100, rounded to 1 dp; 0 if no leads
 *   thisMonthLeads:  number,
 *   lastMonthLeads:  number,
 *   growthRate:      number,   // ((thisMonth - lastMonth) / lastMonth) * 100; null if lastMonth=0
 * }}
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadStats] user=${req.user._id}`);
    }

    const now  = new Date();
    const thisYear  = now.getUTCFullYear();
    const thisMonth = now.getUTCMonth(); // 0-indexed

    const { start: thisMonthStart, end: thisMonthEnd }   = monthBounds(thisYear, thisMonth);
    const { start: lastMonthStart, end: lastMonthEnd }   = monthBounds(
      thisMonth === 0 ? thisYear - 1 : thisYear,
      thisMonth === 0 ? 11            : thisMonth - 1
    );

    // Single aggregation using $facet for parallel sub-pipelines ──────────────
    const [result] = await Lead.aggregate([
      // Step 1: isolate this user's leads
      { $match: ownerMatch(req.user._id) },

      // Step 2: fan out into 4 independent sub-pipelines simultaneously
      {
        $facet: {
          // ── (a) Total count and status + source breakdown ────────────────────
          totals: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                wonLeads:   { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
              },
            },
          ],

          // ── (b) Per-status breakdown ─────────────────────────────────────────
          statusGroups: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],

          // ── (c) Per-source breakdown ─────────────────────────────────────────
          sourceGroups: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
          ],

          // ── (d) This-month vs last-month counts ──────────────────────────────
          monthCounts: [
            {
              $group: {
                _id: null,
                thisMonthLeads: {
                  $sum: {
                    $cond: [
                      { $and: [
                        { $gte: ['$createdAt', thisMonthStart] },
                        { $lt:  ['$createdAt', thisMonthEnd]   },
                      ]},
                      1, 0,
                    ],
                  },
                },
                lastMonthLeads: {
                  $sum: {
                    $cond: [
                      { $and: [
                        { $gte: ['$createdAt', lastMonthStart] },
                        { $lt:  ['$createdAt', lastMonthEnd]   },
                      ]},
                      1, 0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    // ── Post-processing: reshape facet arrays into clean scalars / maps ────────

    const { totalLeads = 0, wonLeads = 0 } = result.totals[0] ?? {};

    // Edge-case: avoid division by zero
    const conversionRate = totalLeads > 0
      ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1))
      : 0;

    // Convert [{ _id: 'New', count: 5 }, ...] → { New: 5, ... }
    const statusBreakdown = result.statusGroups.reduce((acc, { _id, count }) => {
      if (_id) acc[_id] = count;
      return acc;
    }, {});

    const sourceBreakdown = result.sourceGroups.reduce((acc, { _id, count }) => {
      if (_id) acc[_id] = count;
      return acc;
    }, {});

    const { thisMonthLeads = 0, lastMonthLeads = 0 } = result.monthCounts[0] ?? {};

    // Edge-case: avoid division by zero on growth rate
    const growthRate = lastMonthLeads > 0
      ? parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1))
      : null; // null signals "no prior data" to the client

    const stats = {
      totalLeads,
      wonLeads,
      statusBreakdown,
      sourceBreakdown,
      conversionRate,
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
    };

    return successResponse(res, stats, 'Lead stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get per-month aggregated statistics for the last 6 calendar months,
 * including months with zero leads so the chart always renders 6 bars.
 *
 * @route   GET /api/leads/stats/monthly
 * @access  Private
 *
 * @returns {Array<{
 *   month:          string,  // e.g. "Jan 2025"
 *   total:          number,
 *   won:            number,
 *   lost:           number,
 *   conversionRate: number,  // (won/total)*100, 0 if total=0
 * }>}  Sorted oldest → newest (left-to-right for charts)
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getMonthlyStats] user=${req.user._id}`);
    }

    // Build the start of the window: beginning of the month 5 months ago ──────
    const now = new Date();
    const windowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

    // ── Aggregate: group by calendar year+month ───────────────────────────────
    const dbRows = await Lead.aggregate([
      {
        $match: {
          ...ownerMatch(req.user._id),
          createdAt: { $gte: windowStart },
        },
      },
      {
        $group: {
          _id: {
            year:  { $year:  '$createdAt' },
            month: { $month: '$createdAt' }, // 1-indexed in Mongo
          },
          total: { $sum: 1 },
          won:   { $sum: { $cond: [{ $eq: ['$status', 'Won']  }, 1, 0] } },
          lost:  { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
      // Sort oldest to newest so we can process in order
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // ── Build a lookup map keyed by "YYYY-M" (e.g. "2025-1") ─────────────────
    const dbMap = new Map(
      dbRows.map((row) => [
        `${row._id.year}-${row._id.month}`,
        row,
      ])
    );

    // ── Generate the canonical 6-month array, padding missing months with 0 ──
    const months = [];

    for (let offset = 5; offset >= 0; offset--) {
      const d    = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
      const year  = d.getUTCFullYear();
      const month = d.getUTCMonth(); // 0-indexed
      const key   = `${year}-${month + 1}`; // Mongo uses 1-indexed

      const row = dbMap.get(key);

      const total = row?.total ?? 0;
      const won   = row?.won   ?? 0;
      const lost  = row?.lost  ?? 0;

      months.push({
        month:          monthLabel(year, month),
        total,
        won,
        lost,
        conversionRate: total > 0
          ? parseFloat(((won / total) * 100).toFixed(1))
          : 0,
      });
    }

    return successResponse(res, months, 'Monthly stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quick autocomplete search: returns up to 5 matching leads with only
 * the fields needed to render a dropdown suggestion list.
 *
 * Intended to be called by the React SearchBar's debounced handler.
 *
 * @route   GET /api/leads/search?q=ali&limit=5
 * @access  Private
 *
 * @param {string} req.query.q     - The search term (minimum 1 character)
 * @param {string} [req.query.limit=5] - Max results (hard-capped at 10)
 *
 * @returns {Array<{ _id, name, company, email, status }>}
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q = '', limit = 5 } = req.query;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[searchLeads] q="${q}" user=${req.user._id}`);
    }

    // Return empty results immediately if no query provided
    if (!q.trim()) {
      return successResponse(res, [], 'No search term provided');
    }

    // Hard-cap the limit so a client can't request unbounded results
    const limitNum = Math.min(parseInt(limit, 10) || 5, 10);

    const leads = await Lead.find(
      {
        owner: req.user._id,
        $or: [
          { name:    { $regex: q, $options: 'i' } },
          { company: { $regex: q, $options: 'i' } },
          { email:   { $regex: q, $options: 'i' } },
        ],
      },
      // Projection: return only the 5 specified fields ─────────────────────────
      { _id: 1, name: 1, company: 1, email: 1, status: 1 }
    )
      .limit(limitNum)
      .lean();

    return successResponse(res, leads, `Found ${leads.length} result(s)`);
  } catch (error) {
    next(error);
  }
};
