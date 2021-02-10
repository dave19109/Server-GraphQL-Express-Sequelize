const typeDefinitions = `
  directive @auth on QUERY | FIELD_DEFINITION | FIELD
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }
  
  directive @cacheControl (
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE
  scalar Upload


  type User @cacheControl(maxAge: 120) {
    id: Int
    avatar: String @cacheControl(maxAge: 240)
    username: String
    email: String
  }

  type AuthResponse {
    token: String
  }
  

  input UserInput {
      username: String!
      email: String!
      password: String!
  }
  
  type RootMutation {
    addUser(user: UserInput): AuthResponse
  }
  type RootQuery {
    getUser(id: Int!): User
    currentUser: User @auth
  }
  type RootSubscription {
    test: String
  }
  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubscription
  }
`;

export default [typeDefinitions];
