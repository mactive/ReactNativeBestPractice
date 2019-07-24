import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Tip } from 'beeshell';

export default class FindFood extends Component {
    onFindPress = () => {
        console.log('onFindPress');
        Tip.show('正在为您寻找...', 2000, false, 'center')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Food in your area</Text>
                <Text style={styles.subTitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</Text>
                <TouchableHighlight onPress={this.onFindPress}>
                    <Text style={styles.buttonText}>Let's find</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 100,
	},
    title: {
        fontSize: 20,
        color: 'purple',
    },
    subTitle: {
        fontSize: 12,
        color: 'gray',
    },
    buttonText: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'yellow',
        lineHeight: 30,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});