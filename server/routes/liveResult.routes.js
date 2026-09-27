const { liveResultsCollection } = require("../config/db");
const makeEmailScopedRouter = require("../utils/simpleGetRoute");

module.exports = makeEmailScopedRouter(liveResultsCollection);
