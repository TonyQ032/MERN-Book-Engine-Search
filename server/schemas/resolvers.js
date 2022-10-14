const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    users: async () => {
      return User.find().populate('savedBooks');
    }

    // NEXT STEP IS TO CREATE THE LOGIN MUTATION RESOLVER TO TEST OUT 'ME'
  },

}

module.exports = resolvers;