const Mutation = {
    async createItem(parent, args, ctx, info) {
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args,
            }
        }, info); // accessing the db

        return item;
    }
};

module.exports = Mutation;
