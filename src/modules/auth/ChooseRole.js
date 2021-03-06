import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Constants from 'expo-constants';
import RichInputContainer from '../../components/containers/RichInputContainer';
import {Ionicons} from '@expo/vector-icons';
import NextButton from '../../components/buttons/NextButton';
import AddItemForm from './components/AddItemFormSmall';
import FormHeading from '../../components/Headings/FormHeading';

const ROLES = [
  'SCOUTMASTER',
  'ASST_SCOUTMASTER',
  'SENIOR_PATROL_LEADER',
  'PATROL_LEADER',
  'SCOUT',
  'PARENT',
  'ADULT_VOLUNTEER',
];

const ChooseRole = ({navigation, route}) => {
  const [role, setRole] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [childNameIsValid, setChildNameIsValid] = useState(false);
  const [childName, setChildName] = useState('');
  const [children, setChildren] = useState([]);

  const nextForm = () => {
    let signUpData;
    if (role === 'PARENT') {
      signUpData = {
        ...route.params,
        role,
        children,
      };
    } else {
      signUpData = {
        ...route.params,
        role,
      };
    }
    delete signUpData.nextView;
    navigation.navigate(route.params.nextView, signUpData);
  };

  return (
    <RichInputContainer icon="back" back={navigation.goBack}>
      <View style={styles.inputContainer}>
        <Text style={styles.formHeading}>
          What is your role within the Troop?
        </Text>
        {ROLES.map((currRole) => (
          <TouchableOpacity
            onPress={() => {
              setIsValid(currRole !== 'PARENT' || !!children.length);
              setRole(currRole);
            }}
            style={[styles.role, currRole === role && styles.active]}
            key={currRole}>
            {currRole === role && (
              <Ionicons style={styles.check} name="ios-checkmark" size={32} />
            )}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                fontFamily: Fonts.primaryTextBold,
                color: '#fff',
                paddingHorizontal: 10,
              }}>
              {currRole
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\w\S*/g, function (txt) {
                  return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                  );
                })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          padding: 15,
        }}>
        {role === 'PARENT' && (
          <AddItemForm
            value={childName}
            setValue={setChildName}
            isValid={childNameIsValid}
            setIsValid={setChildNameIsValid}
            onPress={() => {
              setIsValid(true);
              setChildName('');
              setChildren([...children, childName]);
            }}
            heading="Please add the names of the Scouts who belong to you."
            placeholder="Scout First name / Last Name"
          />
        )}
        {!!children.length && (
          <View style={{marginVertical: 15}}>
            <FormHeading indented title="Your Scouts" />
            {children.map((child) => (
              <Text
                key={child}
                style={{padding: 4, fontFamily: Fonts.primaryTextBold}}>
                {child}
              </Text>
            ))}
          </View>
        )}
        {isValid && (
          <View
            style={{
              marginVertical: 20,
            }}>
            <NextButton
              inline
              text="Select your Troop"
              iconName="arrow-forward-outline"
              onClick={nextForm}
            />
          </View>
        )}
      </View>
    </RichInputContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginTop: 15 + Constants.statusBarHeight,
    paddingHorizontal: 15,
  },
  role: {
    padding: 12,
    margin: 10,
    width: '100%',
    paddingHorizontal: 22,
    backgroundColor: Colors.green,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  troopNumber: {
    padding: 16,
    alignItems: 'flex-start',
    width: 100,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.purple,
    fontSize: 15,
    flexDirection: 'row',
    fontFamily: Fonts.primaryText,
    backgroundColor: '#fff',
  },
  formHeading: {
    borderColor: Colors.green,
    fontSize: 15,
    fontFamily: Fonts.primaryTextBold,
    margin: 18,
    marginVertical: 10,
  },
  active: {
    backgroundColor: Colors.darkGreen,
  },
  check: {
    position: 'absolute',
    top: 5,
    left: 15,
    color: '#fff',
  },
});

export default ChooseRole;
