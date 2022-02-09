import gql from "graphql-tag";

export const FETCH_USERS_QUERY = gql`
  query getUsers {
    getUsers {
      id
      username
      avatar
    }
  }
`;
