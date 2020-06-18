import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {gql} from '@apollo/client';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {GET_EVENTS} from '../CalendarView';
import Colors from '../../../../constants/Colors';
// import AccessoryBtn from './AccessoryBtn';
import {GET_EXPO_TOKEN} from '../../events/hike/HikeDetails';
// import CustomActions from './CustomActions';
// import CustomView from './CustomView';

const GET_CURR_USER_BRIEF = gql`
  query GetCurrUserBrief {
    user: currUser {
      id
      name
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation AddMessage($eventId: ID!, $name: String!, $message: String!) {
    addMessage(eventId: $eventId, name: $name, message: $message) {
      _id
      text
      createdAt
      user {
        name
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($id: ID!) {
    messages(id: $id) {
      _id
      text
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export default function ChatModule({navigation, route}) {
  const {data: user} = useQuery(GET_CURR_USER_BRIEF);

  const {data: eventMessages, loading, error} = useQuery(GET_MESSAGES, {
    pollInterval: 1000,
    variables: {id: route.params.id},
  });

  const [addMessage] = useMutation(SEND_MESSAGE, {
    // update(cache, {data: {addMessage}}) {
    //   try {
    //     const {events} = cache.readQuery({query: GET_EVENTS});
    //     cache.writeQuery({
    //       query: GET_EVENTS,
    //       data: {events: events.concat([addMessage])},
    //     });
    //   } catch {
    //     cache.writeQuery({
    //       query: GET_EVENTS,
    //       data: {events: [addHike]},
    //     });
    //   }
    // },
  });

  const [messages, setMessages] = useState([]);

  const [loadEarlier, setLoadEarlier] = useState(true);
  const [typingText, setTypingText] = useState(null);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);

  useEffect(() => {
    if (eventMessages) {
      const messages = eventMessages.messages.map((message) => {
        return {
          ...message,
          createdAt: new Date(+message.createdAt),
          user: {
            _id: parseInt(message.user.id, 16),
            name: message.user.name,
          },
        };
      });
      setMessages(messages);
    }
  }, [eventMessages]);

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true);

    setTimeout(() => {
      setLoadEarlier(false);
      setIsLoadingEarlier(false);
    }, 1000); // simulating network
  };

  const onSend = (messages = []) => {
    messages.map(async (message) => {
      await addMessage({
        variables: {
          eventId: route.params.id,
          name: route.params.name,
          message: message.text,
        },
      });
      setMessages((prev) => GiftedChat.append(messages, prev));
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.lightGray,
          },
        }}
      />
    );
  };

  // renderCustomView(props) {
  //   return <CustomView {...props} />;
  //   return <CustomView {...props} />;
  // }

  const renderFooter = (props) => {
    if (typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{typingText}</Text>
        </View>
      );
    }
    return null;
  };

  if (error) return <Text>Error: {error}</Text>;
  if (loading) return <Text>Loading...</Text>;

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      // loadEarlier={loadEarlier}
      // onLoadEarlier={onLoadEarlier}
      isLoadingEarlier={isLoadingEarlier}
      inverted={false}
      alignTop={false}
      user={{
        _id: parseInt(user.user.id, 16),
        name: user.user.name,
      }}
      // renderAccessory={() => <AccessoryBtn onSend={onSend} />} // renderActions={this.renderCustomActions}
      renderBubble={renderBubble}
      // renderCustomView={this.renderCustomView}
      renderFooter={renderFooter}
      minInputToolbarHeight={60}
      textInputStyle={{
        minHeight: 50,
        textAlignVertical: 'center',
        padding: 15,
      }}
    />
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
