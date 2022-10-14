const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
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

  },

  Mutation: {
    login: async (parent, { email, password }) => {

      // Checks to see if a user exists with this email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address!")
      }

      // Checks if the user found matches with the password provided
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect login credentials!");
      }

      // Creates jwt if all checks pass
      const token = signToken(user);

      return { token, user }
    },

    addUser: async (parents, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parents, { data }, context) => {
      if (context.user) {

        // Creates new book
        const book = await Book.Create(data);

        // Adds book to logged in user
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet:
              { savedBooks: book }
          },
          {
            new: true,
            runValidators: true
          }
        )

        return user;
      }

      throw new AuthenticationError("You need to be logged in!")
    },

    removeBook: async (parent, { bookId }, context) => {
      // Checks if user is logged in
      if (context.user) {
        // Finds logged in user and pulls the book
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId }
            }
          },
          {
            new: true,
          }
        )

        return user;
      }

      throw new AuthenticationError("You need to be logged in!")
    }
  }
}

module.exports = resolvers;