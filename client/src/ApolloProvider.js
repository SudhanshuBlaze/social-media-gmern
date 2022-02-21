// this setup to access our server
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
// http://localhost:5000/
const httpLink = createHttpLink({
  uri: "https://social-media-server-v2.herokuapp.com/", //our server running in this port
});

// this function acts as a middleware, this function is executed every time we send a http request from client to server, in this way our "Authorization Header" gets updated with the "token"
const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");

  // this will merge the existing headers of the request with this headers object
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // Apollo Client stores the results of your GraphQL queries in a local, normalized, in-memory cache. This enables Apollo Client to respond almost immediately to queries for already-cached data, without even sending a network request. The Apollo Client cache is highly configurable.
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
