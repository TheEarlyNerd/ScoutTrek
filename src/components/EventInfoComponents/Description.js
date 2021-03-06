import React from 'react';
import {View, StyleSheet} from 'react-native';

import {WebView} from 'react-native-webview';
import FormHeading from '../Headings/FormHeading';
import Colors from '../../../constants/Colors';

const Description = ({description}) => {
  return (
    <View style={styles.description}>
      <FormHeading indented title="Additional event info" />
      <WebView
        originWhitelist={['*']}
        style={styles.webview}
        source={{
          html: `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=0.99">
                        </head>
                        <body style="background-color: ${Colors.offWhite}; padding: 10px; font-size: 15px; font-family: Montserrat, Raleway, serif">
                            ${description}
                        </body>
                    </html>`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    borderRadius: 4,
    backgroundColor: Colors.offWhite,
    marginVertical: 30,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  webview: {
    marginTop: 10,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: 180,
  },
});

export default Description;
