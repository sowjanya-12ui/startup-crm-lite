/**
 * Helper function for successful API responses
 * 
 * @param {Object} res - Express response object
 * @param {any} data - The payload to send
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper function for error API responses
 * 
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Detailed validation errors or null
 */
export const errorResponse = (res, message = 'Server error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Helper function for paginated API responses
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array of records
 * @param {Number} total - Total number of records across all pages
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of records per page
 */
/**
 * Helper function for paginated API responses with navigation flags
 *
 * @param {Object} res    - Express response object
 * @param {Array}  data   - Array of records for the current page
 * @param {Number} total  - Total records across all pages
 * @param {Number} page   - Current page (1-indexed)
 * @param {Number} limit  - Records per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const pageNum   = Number(page);
  const limitNum  = Number(limit);
  const totalPages = Math.ceil(total / limitNum) || 1;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page:    pageNum,
      limit:   limitNum,
      pages:   totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  });
};
