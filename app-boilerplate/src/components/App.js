import React from "react";

import Header from "./Header";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";
import { useAuth0 } from "./Auth/react-auth0-spa";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

/* 
We are creating an HttpLink to connect ApolloClient with the GraphQL server. As you know already, our GraphQL server is running at https://hasura.io/learn/graphql

At the end, we instantiate ApolloClient by passing in our HttpLink and a new instance of InMemoryCache (recommended caching solution). We are wrapping all of this in a function which will return the client.
*/
const createApolloClient = authToken => {
  return new ApolloClient({
      link: new WebSocketLink({
        uri: "wss://hasura.io/learn/graphql",
        options: {
          reconnect: true,
          connectionParams: {
            headers: {
              Authorization: `Bearer ${authToken}`
          }
          }
        }
    }),
    cache: new InMemoryCache()
  });
};
const App = ({ idToken }) => {
  const { loading, logout } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }
  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        <div className="row container-fluid p-left-right-0 m-left-right-0">
          <div className="row col-md-9 p-left-right-0 m-left-right-0">
            <div className="col-md-6 sliderMenu p-30">
              <TodoPrivateWrapper />
            </div>
            <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
              <TodoPublicWrapper />
            </div>
          </div>
          <div className="col-md-3 p-left-right-0">
            <div className="col-md-12 sliderMenu p-30 bg-gray">
              <OnlineUsersWrapper />
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
