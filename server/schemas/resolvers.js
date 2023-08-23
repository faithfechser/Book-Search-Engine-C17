const { AuthenticationError } = require("apollo-server-express");
const { User } = require('../models');
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
  },
  Mutation: {
    // add user 
    addUser: async (parent, { username, email, password }) => {
      //const user
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      
      return { token, user};
    },
    // login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Account not Found');
      }

      const passwordVer = await user.isCorrectPassword(password);

      if (!passwordVer) {
        throw new AuthenticationError('Incorrect Password');
      }

      const token = signToken(user);
      return { token, user };
    },
    // save book
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove book
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('Please Log In');
    },
  }
};

module.exports = resolvers;