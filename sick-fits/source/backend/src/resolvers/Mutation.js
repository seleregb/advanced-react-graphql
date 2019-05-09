const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const Mutation = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    ); // accessing the db

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method

    return await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item(
      { where },
      `{ 
            id 
            title
        }`
    );
    // check if they have the permission to the item

    // delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signUp(parent, args, ctx, info) {
    // lowercase the user email
    args.email = args.email.toLowerCase();
    // hash the user password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: { ...args, password, permissions: { set: ["USER"] } }
      },
      info
    );
    // create jwt for the user
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // return user to the browser
    return user;
  }
};

module.exports = Mutation;
