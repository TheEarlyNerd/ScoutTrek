import React, {useRef, useEffect} from 'react';
import {View, SectionList, SafeAreaView, StyleSheet, Text} from 'react-native';
import EventListItem from '../../components/EventListItem';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import * as Notifications from 'expo-notifications';
import {gql, useMutation, useQuery} from '@apollo/client';
import Colors from '../../../constants/Colors';

export const EVENT_FIELDS = gql`
  fragment EventFragment on Event {
    id
    type
    title
    description
    date
    startTime
    distance
    uniqueMeetLocation
    meetTime
    leaveTime
    endTime
    endDate
    location {
      lat
      lng
      address
    }
    meetLocation {
      lat
      lng
      address
    }
    creator {
      id
      name
    }
  }
`;

export const GET_UPCOMING_EVENTS = gql`
  query UpcomingEvents {
    upcomingEvents {
      ...EventFragment
    }
  }
  ${EVENT_FIELDS}
`;

export const UPDATE_EXPO_TOKEN = gql`
  mutation UpdateExpoToken($token: UpdateUserInput!) {
    updateCurrUser(input: $token) {
      id
    }
  }
`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function UpcomingEvents({navigation}) {
  const {loading, error, data} = useQuery(GET_UPCOMING_EVENTS, {
    fetchPolicy: 'network-only',
  });

  const [updateToken] = useMutation(UPDATE_EXPO_TOKEN);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const notificationType =
            response.notification.request.content.data.type;
          const eventType =
            response.notification.request.content.data?.eventType;
          const ID = response.notification.request.content.data.ID;

          console.log('Notification ', ID, notificationType);
          switch (notificationType) {
            case 'event':
              navigation.navigate('ViewEvents', {
                screen: 'Event',
                params: {currItem: ID},
              });
              break;
            case 'message':
              navigation.navigate('ViewEvents', {
                screen: 'Threads',
                params: {id: ID, name: ''},
              });
              break;
          }
        }
      );
    })();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const viewEvent = (item) => {
    navigation.navigate('ViewEvents', {
      screen: 'Event',
      params: {currItem: item.id},
    });
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;

      if (Constants.isDevice) {
        await updateToken({
          variables: {
            token: {
              expoNotificationToken: token,
            },
          },
        });
      }
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  if (error) return <Text>Error: {error}</Text>;
  if (loading) return <Text>Loading...</Text>;
  const eventListData = [
    {
      title: 'Happening Now',
      data: data.upcomingEvents.filter(
        ({date}) => new Date(+date) - new Date() < 0
      ),
    },
    {
      title: 'Upcoming Events',
      data: data.upcomingEvents.filter(
        ({date}) => new Date(+date) - new Date() >= 0
      ),
    },
  ];
  return (
    <SafeAreaView style={styles.screen}>
      <SectionList
        sections={eventListData}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <EventListItem
            key={item.id}
            id={item.id}
            title={item.title}
            type={item.type}
            date={item.date}
            creator={item.creator.name}
            onSelect={viewEvent}
          />
        )}
        renderSectionHeader={({section: {title, data}}) =>
          data.length > 0 ? <Text style={styles.heading}>{title}</Text> : null
        }
        ListFooterComponent={() => <View style={{margin: 10}} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.offWhite2,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'raleway-bold',
    padding: 12,
    paddingBottom: 10,
  },
});
