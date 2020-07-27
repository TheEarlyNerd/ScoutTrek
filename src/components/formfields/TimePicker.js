import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';

import React, {useState} from 'react';
import CalModal from '../CalModal';

const TimePicker = ({
  chooseTime1Msg,
  chooseTime2Msg,
  nextForm,
  time1,
  setTime1,
  time2,
  setTime2,
  showModal,
  setShowModal,
}) => {
  const [showFirstModal, setShowFirstModal] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');
  return (
    <CalModal show={showModal} setShow={setShowModal}>
      {!time1 || showFirstModal ? (
        <View>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{chooseTime1Msg}</Text>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={time1}
              minuteInterval={5}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, date) => {
                setShowTimePicker(Platform.OS === 'ios');
                setTime1(new Date(date));
                if (Platform.OS === 'android') {
                  setShowFirstModal(false);
                }
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setShowTimePicker(true);
              if (Platform.OS === 'ios') {
                setShowFirstModal(false);
              }
            }}
            style={{
              padding: 12,
              alignItems: 'center',
              backgroundColor: Colors.lightGreen,
              borderRadius: 4,
            }}>
            <Text style={{fontSize: 18, fontFamily: Fonts.primaryTextBold}}>
              Confirm Meet Time
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{chooseTime2Msg}</Text>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={time2}
              minuteInterval={5}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, date) => {
                setShowTimePicker(Platform.OS === 'ios');
                setTime2(new Date(date));
                if (Platform.OS === 'android') {
                  setShowModal(false);
                  nextForm();
                }
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
              nextForm();
            }}
            style={{
              padding: 12,
              alignItems: 'center',
              backgroundColor: Colors.lightGreen,
              borderRadius: 4,
            }}>
            <Text style={{fontSize: 18, fontFamily: Fonts.primaryTextBold}}>
              Choose Leave Time
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </CalModal>
  );
};

const styles = StyleSheet.create({
  heading: {
    margin: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabIconDefault,
  },
  headingText: {
    fontSize: 18,
    lineHeight: 28,
    padding: 5,
    paddingBottom: 14,
  },
});

export default TimePicker;
