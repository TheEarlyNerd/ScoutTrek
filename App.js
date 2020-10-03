import React, {useState, useEffect, useContext} from 'react';

import {setCustomText} from 'react-native-global-props';
import {ActivityIndicator, View, AsyncStorage} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import {Ionicons} from '@expo/vector-icons';

import {AuthContext} from './src/modules/auth/JoinPatrol';

import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  from,
} from '@apollo/client';

import {createUploadLink} from 'apollo-upload-client';

import {onError} from '@apollo/client/link/error';

import AuthNavigator from './src/modules/auth/AuthNavigator';
import MainTabNavigator from './src/modules/navigation/MainTabNavigator';
import ViewEventStackNavigator from './src/modules/navigation/ViewEventStack';

import * as Sentry from 'sentry-expo';

// Global Apollo Variable that determines if the user is signed in or not.
import {eventData} from './src/modules/events/event_components/ChooseName';

Sentry.init({
  dsn:
    'https://02780727dd3a4192a8b5014eee036ca1@o412271.ingest.sentry.io/5288757',
  enableInExpoDevelopment: false,
  debug: true,
});

const httpLink = new createUploadLink({
  uri: 'https://scouttrek-node-api.appspot.com/:4000',
  // uri: 'http://localhost:4000/',
});

const errorMiddleware = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      graphQLErrors.map(({message, locations, path}) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      return forward(operation);
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const authMiddleware = new ApolloLink(async (operation, forward) => {
  // add the authorization to the headers
  const token = await AsyncStorage.getItem('userToken');
  operation.setContext({
    headers: {
      authorization: token,
    },
  });
  return forward(operation);
});

const AppLoadingContainer = () => {
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');

  try {
    AsyncStorage.getItem('userToken').then((token) => {
      setAuthToken(token);
    });
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    loadResourcesAsync().then(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );

  return (
    <AuthContext.Provider value={{authToken, setAuthToken}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => ({
            headerShown: false,
          })}>
          {!authToken ? (
            <Stack.Screen
              name="AuthNav"
              component={AuthNavigator}
              options={{
                animationTypeForReplace: 'push',
              }}
            />
          ) : (
            <Stack.Screen name="Home" component={MainTabNavigator} />
          )}
          <Stack.Screen name="ViewEvents" component={ViewEventStackNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      ...Ionicons.font,
      montserrat: require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
      'montserrat-med': require('./assets/fonts/Montserrat/Montserrat-Medium.ttf'),
      'montserrat-light': require('./assets/fonts/Montserrat/Montserrat-Light.ttf'),
      'montserrat-bold': require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
      'raleway-bold': require('./assets/fonts/Raleway/Raleway-Bold.ttf'),
      'raleway-black': require('./assets/fonts/Raleway/Raleway-Black.ttf'),
    }),
  ]);

  const customTextProps = {
    style: {
      fontFamily: 'montserrat-med',
    },
  };
  setCustomText(customTextProps);
}

const Stack = createStackNavigator();

export default function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            eventFormState: {
              read() {
                return eventData();
              },
            },
            upcomingEvents: {
              merge(_ignored, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    link: from([authMiddleware, errorMiddleware, httpLink]),
  });

  return (
    <ApolloProvider client={client}>
      <AppLoadingContainer />
    </ApolloProvider>
  );
}
