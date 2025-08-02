import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
    name: string;
    address: string;
    available: number;
    distance?: number;
    onPressRoute: () => void;
};

export default function ParkingItem({ name, address, available, distance, onPressRoute }: Props) {
    const availableColor = available > 0 ? '#21b574' : '#df3939';

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.address}>{address}</Text>
                </View>
                {/* {typeof distance === 'number' && (
                <Text style={styles.distance}>
                    {distance < 1
                        ? `${(distance * 1000).toFixed(0)} m`
                        : `${distance.toFixed(2)} km`}
                </Text>
            )} */}
                <View style={styles.row}>
                    <MaterialCommunityIcons
                        name="car"
                        size={20}
                        color={availableColor}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.available, { color: availableColor }]}>
                        {available} lugares disponibles
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.routeBtn} onPress={onPressRoute}>
                <Text style={styles.routeBtnText}>Ver ruta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        color: '#232a33',
        marginBottom: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    address: {
        color: '#888',
        fontSize: 13,
        marginBottom: 3,
    },
    distance: {
        color: '#26B3CE',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
    },
    availableRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    available: {
        fontWeight: '400',
        fontSize: 12,
        color: '#21b574',
    },
    routeBtn: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#f2cb2b',
        borderRadius: 6,
        paddingVertical: 5,
        paddingHorizontal: 18,
        marginTop: 3,
        backgroundColor: '#fff',
    },
    routeBtnText: {
        color: '#b8b8b8',
        fontWeight: '500',
        fontSize: 14,
        letterSpacing: 0.3,
    },
});
