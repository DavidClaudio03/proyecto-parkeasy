import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/(tabs)'); // Cambia según tu ruta de listado
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* LOGO */}
            <Image source={require('../assets/images/Logo.png')} style={styles.logo} />

            {/* ParkEasy Brand */}
            <View style={styles.brandContainer}>
                <Text style={styles.brandTextP}>Park</Text>
                <Text style={styles.brandTextEasy}>Easy</Text>
            </View>

            {/* Slogan */}
            <Text style={styles.slogan}>
                Tu solución en el caos{'\n'}del tráfico
            </Text>

            {/* Loader */}
            <ActivityIndicator size={80} color="#232a33" style={styles.loader} />

            {/* Texto inferior */}
            <Text style={styles.footerText}>Información segura y actualizada</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Fondo blanco
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 90,
    },
    logo: {
        width: 110,
        height: 110,
        marginBottom: 8,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    brandTextP: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#232a33',
        letterSpacing: 0.5,
    },
    brandTextEasy: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#26B3CE', // Celeste similar al de tu logo
        letterSpacing: 0.5,
    },
    slogan: {
        color: '#888',
        fontSize: 21,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 5,
    },
    loader: {
        marginBottom: 36,
    },
    footerText: {
        position: 'absolute',
        bottom: 18,
        fontSize: 12,
        color: '#bbb',
        letterSpacing: 0.2,
        textAlign: 'center',
        width: '100%',
    },
});
