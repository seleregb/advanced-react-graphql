const { forwardTo } = require("prisma-binding");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current userId
    const { userId } = ctx.request;
    if (!userId) {
      return null;
    }
    return ctx.db.query.user({
        where: { id: userId },
    }, info);
  },
  users: forwardTo('db'),
};

module.exports = Query;
