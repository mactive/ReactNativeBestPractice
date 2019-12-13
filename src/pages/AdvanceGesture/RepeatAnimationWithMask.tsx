import React, { Component } from 'react'
import { Animated, TouchableOpacity, View, Text, Button, StyleSheet, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    animatedValue: Animated.Value
}
const BUTTON_HEIGHT = 80;

export class RepeatAnimationWithMask extends Component<Props, any> {

    public animatedValue: Animated.Value;
    public translateX: any;
    public translateY: any;
    public buttonRotate: any;

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0);

        var range = 1, snapshot = 5, radius = 100;
        /// translateX
        // var inputRange = [], outputRange = [];
        // for (var i = 0; i <= snapshot; ++i) {
        //     var value = i / snapshot;
        //     var move = Math.sin(value * Math.PI * 2) * radius;
        //     inputRange.push(value);
        //     outputRange.push(move);
        // }
        // this.translateX = this.animatedValue.interpolate({ inputRange, outputRange });

        /// translateY
        const inputRange = [-1, 0, 1];
        const outputRange = [-BUTTON_HEIGHT, 0, BUTTON_HEIGHT];
        this.translateY = this.animatedValue.interpolate({ inputRange, outputRange });
    }

    animate() {
        this.animatedValue.setValue(0);        

        Animated.loop(
            Animated.sequence([
                // 向下移动出去
                Animated.timing(this.animatedValue, { toValue: 1.0, duration: 300, easing: Easing.easeOut, useNativeDriver: true }),
                // 回到顶部外侧
                Animated.timing(this.animatedValue, { toValue: -1, duration: 0, useNativeDriver: true }),
                // 向下移动出去
                Animated.timing(this.animatedValue, { toValue: 0, duration: 300, easing: Easing.easeIn, useNativeDriver: true }),
                Animated.delay(500)
            ])
        ).start();
    }

    render() {
        // { translateX: this.translateX },
        const transform = [{ translateY: this.translateY }];
        return (
            <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            this.animate()
                        }}
                    >
                        <View style={styles.textView}>
                            <Text style={{color: '#ffffff', fontSize: 20 }}>Download</Text>
                        </View>
                        <View style={styles.iconView}>
                            <Animated.View style={[{ transform }]}>
                                <Ionicons name="md-arrow-down" size={36} color="white" />
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor: '#0511E0',
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: 300,
        height: BUTTON_HEIGHT,
        borderRadius: 10,
        overflow: 'hidden'
    },
    textView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: BUTTON_HEIGHT
    },
    iconView: {
        backgroundColor: '#555555',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: BUTTON_HEIGHT,
    },
    
});