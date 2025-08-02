// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Simula carga de recursos, por ejemplo, validar sesión o inicializar
    setTimeout(() => {
      router.replace('/(tabs)'); // Redirige al listado después de 2 seg
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Logo.png')} // Pon tu logo aquí
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ParkEasy</Text>
      <Text style={styles.slogan}>Tu solución en el caos del tráfico</Text>
      <ActivityIndicator size="large" color="#00294d" style={{ marginTop: 32 }} />
      <Text style={styles.info}>Información segura y actualizada</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00294d' },
  slogan: { fontSize: 18, color: '#666', marginTop: 8 },
  info: { position: 'absolute', bottom: 32, fontSize: 13, color: '#b3b3b3' }
});

export default SplashScreen;
