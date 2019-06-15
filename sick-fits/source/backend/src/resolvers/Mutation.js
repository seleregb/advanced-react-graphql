const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

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
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // return user to the browser
    return user;
  },
  async signIn(parent, { email, password }, ctx, info) {
    // check if there is a user with that email
    const user = await ctx.db.query.user({ where: {
      email: email },
    });
    if (!user) throw new Error(`No such user found for email ${email}`);
    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password");
    }
    // generate the jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 100 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // return the user
    return user;
  },
  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async requestReset(parent, { email }, ctx, info) {
    // check if this a real user
    const user = await ctx.db.query.user({ where: { email: email } });
    if (!user) throw new Error(`No such user found for email ${email}`);
    // set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1hr from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: email },
      data: { resetToken, resetTokenExpiry }
    });
    return { message: "Thanks!" };
    // email them the reset token
  },
  async resetPassword(parent, args, ctx, info) {
    // check if the password match
    if (args.password !== args.confirmPassword) {
      throw new Error('Yo passwords don\'t match');
    }
    // check if its a legit reset token
    // check if its required
    const [ user ] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email},
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET);
    // set the jwt cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    // return the new user
    return updatedUser;
  }
};

module.exports = Mutation;
