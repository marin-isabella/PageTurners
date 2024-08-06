import { StyleSheet, Text, View, Image, Animated } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import images from '../constants/images';
import Footer from '../components/footer';

const ThankYou = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const transYAnim = useRef(new Animated.Value(-70)).current;
    
    const [seconds, setSeconds] = useState(10);
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    
        Animated.timing(transYAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const countdown = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(countdown);
    }, [fadeAnim, transYAnim]);

    useEffect(() => {
        if (seconds <= 0) {
            navigation.navigate('Home');
        }
    }, [seconds, navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: transYAnim }] }]}>
                <Image source={images.logoWithoutText} style={styles.logo} />
                <Text style={styles.title}>Thank you for using PageTurners.</Text>
                <Text style={styles.redirect}> Restarting session in {seconds} seconds...</Text>
            </Animated.View>
            <Footer />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5E6E1',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 450,
        height: 250,
        marginBottom: 20,
    },
})

export default ThankYou;
