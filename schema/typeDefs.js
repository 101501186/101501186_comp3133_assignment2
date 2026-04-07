const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
  }

  type Query {
    login(username: String, email: String, password: String!): String
    getEmployees: [Employee]
    getEmployeeById(id: ID!): Employee
    searchEmployee(department: String, designation: String): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): String
    addEmployee(
      first_name: String!
      last_name: String!
      email: String
      gender: String
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
    ): Employee

    updateEmployee(id: ID!, designation: String, salary: Float): Employee
    deleteEmployee(id: ID!): String
  }
`;
