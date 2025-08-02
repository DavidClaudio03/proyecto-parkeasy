import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Image, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ORS_API_KEY = '5b3ce3597851110001cf62485b7972694d3446b99bf6cd9f09a5ee34';
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

export default function MapScreen() {
    const router = useRouter();
    const { lat, lng, nombre, direccion } = useLocalSearchParams();

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationDenied, setLocationDenied] = useState(false);

    // --- Función para solicitar permisos y ubicación ---
    const requestLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationDenied(true);
                setLoading(false);
                return;
            }
            setLocationDenied(false);
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.log(`Exception while doing something: ${error}`);
            setLocationDenied(true);
            setLoading(false);
        }
    };

    // Solicita ubicación solo al cargar la pantalla
    useEffect(() => {
        requestLocation();
    }, []);

    // Si se obtiene la ubicación, busca la ruta
    useEffect(() => {
        const fetchRoute = async () => {
            if (!userLocation || !lat || !lng) return;
            try {
                const body = {
                    coordinates: [
                        [userLocation.longitude, userLocation.latitude], // [lng, lat]
                        [Number(lng), Number(lat)],
                    ],
                };

                const res = await fetch(ORS_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': ORS_API_KEY,
                        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (!res.ok) {
                    throw new Error('Error solicitando la ruta');
                }

                const data = await res.json();
                if (
                    data &&
                    data.features &&
                    data.features.length > 0 &&
                    data.features[0].geometry &&
                    Array.isArray(data.features[0].geometry.coordinates)
                ) {
                    const coords = data.features[0].geometry.coordinates.map(
                        (coord: [number, number]) => ({
                            latitude: coord[1],
                            longitude: coord[0],
                        })
                    );
                    setRouteCoords(coords);
                } else {
                    Alert.alert('Ruta', 'No se encontraron datos de ruta.');
                }
            } catch (error) {
                console.error('Error fetching route:', error);
                Alert.alert('Ruta', 'No se pudo generar la ruta.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [userLocation, lat, lng]);

    // --- Renderizado ---
    if (locationDenied) {
        return (
            <View style={styles.loaderContainer}>
                <Image
                    source={require('../../assets/images/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={{ color: '#232a33', marginBottom: 12, fontWeight: '500', fontSize: 17 }}>Mapa deshabilitado</Text>
                <Text style={{ color: '#aaa', textAlign: 'center', fontSize: 13, marginBottom: 16 }}>
                    Para ver la ruta, por favor permite el acceso a tu ubicación.
                </Text>
                <TouchableOpacity style={styles.retryBtn} onPress={requestLocation}>
                    <Text style={styles.retryBtnText}>Permitir ubicación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.backBtnMini} onPress={() => router.back()}>
                    <MaterialCommunityIcons name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'} size={30} color="#232a33" />
                </TouchableOpacity>
            </View>
        );
    }

    if (loading || !userLocation) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={{ marginTop: 10, color: '#232a33' }}>Mapa deshabilitado</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={require('../../assets/images/Logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            {/* Botón volver */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <MaterialCommunityIcons name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'} size={34} color="#232a33" />
            </TouchableOpacity>
            <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                }}
                showsUserLocation
                showsMyLocationButton
            >
                {/* Marcador destino */}
                {lat && lng && (
                    <Marker
                        coordinate={{ latitude: Number(lat), longitude: Number(lng) }}
                        title={nombre as string}
                        description={direccion as string}
                        pinColor="#26B3CE"
                    />
                )}
                {/* Polyline de la ruta */}
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor="#26B3CE"
                        strokeWidth={4}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
        paddingHorizontal: 28,
    },
    logo: {
        position: 'absolute',
        top: 22,
        left: 18,
        width: 60,
        height: 50,
        zIndex: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        padding: 3,
    },
    backBtn: {
        position: 'absolute',
        top: 42,
        left: 16,
        zIndex: 20,
        backgroundColor: '#fff',
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 7,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryBtn: {
        marginTop: 4,
        backgroundColor: '#26B3CE',
        paddingHorizontal: 22,
        paddingVertical: 9,
        borderRadius: 6,
        marginBottom: 16,
    },
    retryBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    backBtnMini: {
        marginTop: 18,
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 5,
        elevation: 2,
    },
});
