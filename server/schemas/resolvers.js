const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
    Mutations: {
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
      saveBook: async (parent, book, context) => {
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: context.user._id},
            { $addToSet: { savedBooks: book} },
            { new: true, runValidators: true }
          );
        }
        throw new AuthenticationError('Please Log In');
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
  }
};

module.exports = resolvers;