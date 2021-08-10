import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const [compassHeading, setCompassHeading] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [derajatKiblat, setDerajatKiblat] = useState('');

  useEffect(() => {
    const degree_update_rate = 0.5;

    CompassHeading.start(degree_update_rate, (degree) => {
      setCompassHeading(degree);
    Geolocation.getCurrentPosition((info) => {
      let {latitude, longitude} = info.coords;
      setLatitude(latitude); 
      setLongitude(longitude); 
      setDerajatKiblat(bearing(latitude, longitude).toString().substr(0, 3));
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles._text}>COMPASS KIBLAT v1 </Text>
        {/* <Text style={styles._text2}>Made for the one who bring me back to goodness</Text> */}
        <View
          style={{
            width: width,
            height: height / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={require('./compass.png')}
            style={{
              width: '80%',
              height: '80%',
              transform: [{rotate: `${360 - compassHeading}deg`}],
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('./arrow.png')}
              style={{
                width: 80,
                height: 350,
                transform: [
                  {
                    rotate:
                      bearing(latitude, longitude) - compassHeading + 'deg',
                  },
                ],
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

function bearing(startLat, startLng) {
  let latitudeKabah = 21.422487; 
  let longitudeKabah = 39.826206; 
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(latitudeKabah);
  destLng = toRadians(longitudeKabah);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  v = brng = brng + 360;

  fraction = modf(brng + 360.0, brng);
  brng += fraction;

  if (brng > 360) {
    brng -= 360;
  }
  return brng;
}

// Converts from degrees to radians.
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Converts from radians to degrees.
function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function modf(orig, ipart) {
  return orig - Math.floor(orig);
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  body: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: height / 2.25,
    height: height / 2,
    // flex: 1,
    // alignSelf: 'center',
  },
  _text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color:  '#EF7373',
  },
  _text2: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color:  '#EF7373',
  },
});

export default App;