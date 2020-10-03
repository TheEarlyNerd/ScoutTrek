import React, {useState, useRef} from 'react';
import {Alert, Keyboard} from 'react-native';

import RTE from '../../../components/RichTextEditor';

import RichInputContainer from '../../../components/containers/RichInputContainer';
import {eventData} from '../event_components/ChooseName';
import NextButton from '../../../components/buttons/NextButton';

const SpecialEventDetails = ({navigation, route}) => {
  const [description, setDescription] = useState('');

  const nextForm = () => {
    if (!description) {
      Alert.alert(
        'Looks like you forgot something.',
        "Are you sure you don't want to tell us anything about the event."
      );
    } else {
      const prevData = eventData();
      eventData({
        ...prevData,
        description: description,
      });
      Keyboard.dismiss();
      navigation.navigate(
        route.params.edit === 'create'
          ? 'ConfirmEventDetails'
          : route.params.edit === 'edit'
          ? 'EditEvent'
          : route.params.nextView
      );
    }
  };

  return (
    <RichInputContainer icon="back" back={navigation.goBack}>
      <RTE
        heading="What additional information do you want people to know about this special event?"
        description={description}
        setDescription={setDescription}>
        <NextButton
          inline
          text="Next"
          iconName="ios-arrow-round-forward"
          onClick={nextForm}
        />
      </RTE>
    </RichInputContainer>
  );
};

export default SpecialEventDetails;
