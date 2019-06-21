const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

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
    return ctx.db.query.user(
      {
        where: { id: userId }
      },
      info
    );
  },
  // users: forwardTo('db'),
  async users(parent, args, ctx, info) {
    //  check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSION_UPDATE"]);
    // if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    //  check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    // check if the have the permission to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You can't see this budd!");
    }
    // return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    //  check if they are logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }
    return await ctx.db.query.orders(
      {
        where: { user: { id: userId } }
      },
      info
    );
  }
};

module.exports = Query;
