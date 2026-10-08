exports.generateSlug = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
exports.formatDate = (date) => new Date(date).toISOString().split('T')[0];
exports.calculateAge = (dob) => { const diff = Date.now() - new Date(dob).getTime(); return Math.abs(new Date(diff).getUTCFullYear() - 1970); };