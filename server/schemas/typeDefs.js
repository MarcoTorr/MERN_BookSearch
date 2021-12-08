const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Books {
    _id: ID!
    authors: String
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  type Auth {
    token: ID!
    user: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks:[Books]
  }
  type Query {

    me: User
  }
  input SavedBookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    forSale: String
    link: String
    title: String
}

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: SavedBookInput): User
    removeUser: User
    deleteBook(bookId: String!): User
  }

  }
`;

module.exports = typeDefs;
