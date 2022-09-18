import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';

import reportWebVitals from './reportWebVitals';
import { configureStore } from './redux/store';

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './App'));

const Main = () => {
  const token = process.env.REACT_APP_PLURALSIGHT_TOKEN;

  const httpLink = new HttpLink({
    uri: 'https://paas-api.pluralsight.com/graphql',
  });

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return forward(operation);
  });

  const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Provider store={configureStore()}>
        <Suspense fallback={<div className="loading" />}>
          <App />
        </Suspense>
      </Provider>
    </ApolloProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
