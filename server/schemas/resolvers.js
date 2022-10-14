const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // Returns all logged in user information
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // Returns array of all users and their savedBooks
    users: async () => {
      return User.find().populate("savedBooks");
    }

    // NEXT STEP IS TO CREATE THE LOGIN MUTATION RESOLVER TO TEST OUT "ME"
  },

  Mutation: {
    login: async (parent, { email, password }) => {

      // Checks to see if a user exists with this email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address")
      }

      // Checks if the user found matches with the password provided
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect login credentials");
      }

      // Creates jwt if all checks pass
      const token = signToken(user);

      return { token, user }
    }
  }
}

module.exports = resolvers;