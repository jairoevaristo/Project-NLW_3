import React, { useState } from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import mapMarkep from '../images/map-marker.png';
import api from '../services/api';

interface OrphangesItem {
  id: number,
  name: string,
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<OrphangesItem[]>([]);
  const navigation = useNavigation(); 

  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToOrphanagesDetails(id: number) {
    navigation.navigate('OrphanagesDetails', { id });
  }

  function handleNavigateToCreateOrphanages() {
    navigation.navigate('SelectMapPosition');
  }

  return(
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: -4.9014361,
        longitude: -40.7600634,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }} provider={PROVIDER_GOOGLE} 
      >
       {orphanages.map(orphanages => {
         return (
            <Marker
            key={orphanages.id} 
              icon={mapMarkep}
              calloutAnchor={{
                x: 2.7,
                y: 0.8,
              }}
              coordinate={{ 
                latitude: orphanages.latitude,
                longitude: orphanages.longitude,
            }}
            >
            <Callout tooltip onPress={() => handleNavigateToOrphanagesDetails(orphanages.id)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{orphanages.name}</Text>
              </View>
            </Callout>
          </Marker>
         );
       })}
          
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length } orfanatos encontrados</Text>
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanages}>
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#fff',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
  },

  footerText: {
    color: '#8af3b3',
    fontFamily: 'Nunito_700Bold',
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

  }
});
