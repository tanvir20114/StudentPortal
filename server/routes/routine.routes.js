const { classRoutineCollection } = require("../config/db");
const makeEmailScopedRouter = require("../utils/simpleGetRoute");

module.exports = makeEmailScopedRouter(classRoutineCollection, { single: true });
