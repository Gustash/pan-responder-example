/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useMemo, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  PanResponder,
  Animated,
  useWindowDimensions,
  Switch,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const [showIndicator, setShowIndicator] = useState(true);
  const {width} = useWindowDimensions();
  const pan = useRef(new Animated.Value(0)).current;
  const opacity = useMemo(
    () =>
      pan.interpolate({
        inputRange: [0, width],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [pan, width],
  );
  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        pan.setOffset(gestureState.x0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        pan.flattenOffset();
      },
    }),
  ).current;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const textColorStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  const toggleIndicator = () => {
    setShowIndicator(show => !show);
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.size}>
        <Image
          source={require('./assets/paris.jpg')}
          style={[styles.image, styles.size]}
          resizeMode="cover"
        />
        <Animated.Image
          source={require('./assets/london.webp')}
          style={[styles.image, styles.size, {opacity}]}
          resizeMode="cover"
        />
        <Animated.View
          style={[
            styles.divider,
            !showIndicator && styles.hidden,
            {transform: [{translateX: pan}]},
          ]}
        />
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </View>
      <Text style={[styles.text, textColorStyle]}>
        Slide your finger across the image to toggle between images
      </Text>
      <View style={styles.toggleContainer}>
        <Text style={textColorStyle}>Toggle Progress Indicator</Text>
        <Switch value={showIndicator} onValueChange={toggleIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
  },
  hidden: {
    display: 'none',
  },
  text: {
    textAlign: 'center',
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  size: {
    height: 300,
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#000',
  },
});

export default App;
