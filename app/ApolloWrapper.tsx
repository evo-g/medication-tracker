'use client';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'https://api-us-west-2.hygraph.com/v2/cmct0jtka07c808wgi6i6xqki/master',
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
