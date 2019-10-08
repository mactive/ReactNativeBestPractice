import React, { Component } from 'react'
import { Animated, TouchableOpacity, View, Text, Button, StyleSheet, Easing } from 'react-native';

interface Props {
    animatedValue: Animated.Value
}

export class FindFoodScreen extends Component<Props, any> {

    public animatedValue: Animated.Value;
    public animatedShake: Animated.Value;
    public translateX: any;
    public translateY: any;
    public buttonRotate: any;

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.animatedShake = new Animated.Value(0);

        var range = 1, snapshot = 50, radius = 100;
        /// translateX
        var inputRange = [], outputRange = [];
        for (var i = 0; i <= snapshot; ++i) {
            var value = i / snapshot;
            var move = Math.sin(value * Math.PI * 2) * radius;
            inputRange.push(value);
            outputRange.push(move);
        }
        this.translateX = this.animatedValue.interpolate({ inputRange, outputRange });

        /// translateY
        var inputRange = [], outputRange = [];
        for (var i = 0; i <= snapshot; ++i) {
            var value = i / snapshot;
            var move = -Math.cos(value * Math.PI * 2) * radius;
            inputRange.push(value);
            outputRange.push(move);
        }
        this.translateY = this.animatedValue.interpolate({ inputRange, outputRange });
        this.buttonRotate = this.animatedShake.interpolate({
            inputRange: [-1, 1],
            outputRange: ['-0.2rad', '0.2rad']
        })
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 600,
        }).start();

        this.animatedShake.setValue(0);
        // A loop is needed for continuous animation
        Animated.loop(
            // Animation consists of a sequence of steps
            Animated.sequence([
                // start rotation in one direction (only half the time is needed)
                Animated.timing(this.animatedShake, { toValue: 1.0, duration: 30, easing: Easing.linear, useNativeDriver: true }),
                // rotate in other direction, to minimum value (= twice the duration of above)
                Animated.timing(this.animatedShake, { toValue: -1.0, duration: 60, easing: Easing.linear, useNativeDriver: true }),
                // return to begin position
                Animated.timing(this.animatedShake, { toValue: 0.0, duration: 30, easing: Easing.linear, useNativeDriver: true })
            ]), {
                iterations: 3
            }
        ).start();
    }


    render() {
        const transform = [{ translateY: this.translateY }, { translateX: this.translateX }];
        return (
            <View style={styles.container}>
                <Animated.View style={[{ transform }]}>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={{fontSize: 30}}>蜜蜂</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{
                    transform: [{
                        rotate: this.buttonRotate
                    }],
                }}>
                    <Button title="梁架" onPress={() => {
                        this.animate()
                    }} />
                </Animated.View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    btn: {
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    }
});