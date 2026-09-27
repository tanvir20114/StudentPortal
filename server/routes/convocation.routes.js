const { convocationCollection } = require("../config/db");
const makeEmailScopedRouter = require("../utils/simpleGetRoute");

module.exports = makeEmailScopedRouter(convocationCollection, { single: true });
