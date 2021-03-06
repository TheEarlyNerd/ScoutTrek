import React, {useState} from 'react';
import moment from 'moment';
import {eventData} from '../../../App';
import DateAndTimePicker from '../formfields/DateAndTimePicker';
import DefaultInputButton from '../buttons/DefaultInputButton';
import DateTimeLineItem from '../DateTimeLineItem';
import InputModalContainer from '../containers/InputModalContainer';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import {CalendarList} from 'react-native-calendars';

const ChooseDate = ({id, setModalVisible, questionText}) => {
  const [date, setDate] = useState(
    moment(+eventData()?.[id], 'MM-DD-YYYY').isValid()
      ? moment(+eventData()?.[id])
      : moment()
  );

  const back = () => setModalVisible(false);
  const nextForm = () => {
    eventData({
      ...eventData(),
      [id]: date,
    });
    setModalVisible(false);
  };

  return (
    <InputModalContainer title={questionText} onPress={nextForm} cancel={back}>
      <CalendarList
        current={date.format('YYYY-MM-DD')}
        theme={{
          textDayFontFamily: Fonts.primaryText,
          textMonthFontFamily: Fonts.primaryTextBold,
        }}
        headerStyle={{fontSize: 30, fontFamily: Fonts.primaryTextBold}}
        markingType={'custom'}
        markedDates={{
          [moment().format('YYYY-MM-DD')]: {
            customStyles: {
              container: {
                backgroundColor: Colors.lightGray,
                elevation: 2,
              },
              text: {
                color: 'black',
              },
            },
          },
          [date.format('YYYY-MM-DD')]: {
            selected: true,
            disableTouchEvent: true,
          },
        }}
        onDayPress={(day) => {
          setDate(moment(day.dateString));
        }}
      />
    </InputModalContainer>
  );
};

export default {
  InitialButton: DefaultInputButton,
  EditingComponent: ChooseDate,
  CompletedComponent: (props) => <DateTimeLineItem {...props} format="date" />,
};
