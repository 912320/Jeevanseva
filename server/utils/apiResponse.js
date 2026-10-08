exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};
exports.error = (res, message = 'Server Error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};
exports.paginate = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
  });
};