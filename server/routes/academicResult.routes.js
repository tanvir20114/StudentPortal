const { academicResultCollection } = require("../config/db");
const makeEmailScopedRouter = require("../utils/simpleGetRoute");

module.exports = makeEmailScopedRouter(academicResultCollection, {
  sortField: "order",
  sortOrder: 1,
});
