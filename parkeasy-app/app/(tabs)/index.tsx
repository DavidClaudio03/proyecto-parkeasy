import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl, TouchableOpacity, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ParkingItem from '../../components/ParkingItem';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Función para calcular distancia (Haversine)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export default function ParkingListScreen() {
  const [parkings, setParkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();

  // 1. Solicita permisos de ubicación y guarda la ubicación si es permitido
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationAllowed(false);
        setUserLocation(null);
        return;
      }
      setLocationAllowed(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log(`Exception while doing something: ${error}`);
      setLocationAllowed(false);
      setUserLocation(null);
    }
  };

  // 2. Carga y ordena parqueaderos según la ubicación
  const fetchParkings = async (withLocation = false) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.14:3000/api/parqueaderos/disponibilidad-general');
      const data = await response.json();
      let parqueaderos = data.parqueaderos || [];
      if (withLocation && userLocation) {
        parqueaderos = parqueaderos.map((item: any) => ({
          ...item,
          distancia: getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            item.latitud,
            item.longitud
          ),
        }));
        // Ordenar por distancia (cercanía) y luego por espacios libres (si empatan)
        parqueaderos.sort((a: any, b: any) => {
          if (a.distancia === b.distancia) return b.libres - a.libres;
          return a.distancia - b.distancia;
        });
      } else {
        // Si no hay ubicación, ordenar solo por espacios libres
        parqueaderos.sort((a: any, b: any) => b.libres - a.libres);
      }
      setParkings(parqueaderos);
    } catch (error) {
      console.error('Error fetching parkings:', error);
    }
    setLoading(false);
    setRefreshing(false);
  };

  // 3. Cuando la pantalla se monta, pide permisos y carga parqueaderos
  useEffect(() => {
    (async () => {
      await requestLocationPermission();
    })();
  }, []);

  // 4. Cada vez que cambia locationAllowed o userLocation, recarga parqueaderos
  useEffect(() => {
    if (locationAllowed === null) return;
    fetchParkings(locationAllowed === true && !!userLocation);
  }, [locationAllowed, userLocation, fetchParkings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchParkings(locationAllowed === true && !!userLocation);
  }, [locationAllowed, userLocation, fetchParkings]);

  const handleRoute = (parking: any) => {
    router.push({
      pathname: '/(tabs)/Mapa',
      params: {
        lat: parking.latitud,
        lng: parking.longitud,
        nombre: parking.nombre,
        direccion: parking.direccion,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={onRefresh}>
          <MaterialCommunityIcons name="refresh" size={34} color="#232a33" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Parqueaderos Cercanos</Text>
      <Text style={styles.subtitle}>
        Encuentra espacios disponibles cerca de ti
      </Text>

      {/* Mensaje si no dio permisos */}
      {locationAllowed === false && (
        <Text style={styles.warnText}>
          Permiso de ubicación denegado. Listado ordenado solo por espacios libres.
        </Text>
      )}

      <FlatList
        data={parkings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkingItem
            name={item.nombre}
            address={item.direccion}
            available={item.libres}
            distance={item.distancia} // puedes mostrar la distancia si quieres
            onPressRoute={() => handleRoute(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noData}>No hay parqueaderos disponibles.</Text>
          ) : null
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f2cb2b" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingHorizontal: 13,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 5,
  },
  logo: {
    width: 60,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    color: '#bcbcbc',
    marginTop: 10,
    marginBottom: 2,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#bcbcbc',
    marginBottom: 10,
  },
  warnText: {
    color: '#da7b29',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 5,
  },
  noData: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 45,
    fontSize: 15,
  },
});
