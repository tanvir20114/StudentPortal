const { transactionsCollection } = require("../config/db");
const makeEmailScopedRouter = require("../utils/simpleGetRoute");

module.exports = makeEmailScopedRouter(transactionsCollection, {
  sortField: "date",
  sortOrder: 1,
});
