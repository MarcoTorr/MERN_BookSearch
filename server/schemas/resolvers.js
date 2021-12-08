
   
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {

    me: async (parent, args, context) => {
        if (context.user) {
          return await User.findOne({ _id: context.user._id }).select(
            "-__v -password");
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  
    },
    Mutation: {
      addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          const token = signToken(user);
    
          return { token, user };
        },
        login: async (parent, args) => {
          const user = await User.findOne({
            $or: [{ username: args.username }, { email: args.email }],
          });
    
          if (!user) {
            throw new AuthenticationError('No user with this email found!');
          }
    
          const correctPw = await user.isCorrectPassword(password);
    
          if (!correctPw) {
            throw new AuthenticationError('Incorrect password!');
          }
    
          const token = signToken(user);
          return { token, user };
        },
    
      removeUser: async (parent, { userId }) => {
        return User.findOneAndDelete({ _id: userId });
      },
      saveBook: async (parent, { userId, book }, context) => {
        // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: userId },
            {
              $addToSet: { savedBooks: book },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }
        // If user attempts to execute this mutation and isn't logged in, throw an error
        throw new AuthenticationError('You need to be logged in!');
      },
  
      deleteBook: async (parent, { userId, book }) => {
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: userId },
            { $pull: { savedBooks: book } },
            { new: true }
            );
          }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  };


module.exports = resolvers;
