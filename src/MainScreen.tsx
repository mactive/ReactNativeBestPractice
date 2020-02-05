import React, { Component } from 'react'
import { Text, ScrollView, TouchableHighlight, View } from 'react-native';
import { NavigationScreenProps } from "react-navigation";

export class DestinationAndTitle {
    constructor(destination: string, title?: string) {
        this.destination = destination;
        if (title === undefined) {
            this.title = destination;
        } else {
            this.title = title;
        }
    }
    public destination: string;
    public title: string;
}

// tslint:disable-next-line: max-classes-per-file
export class MainScreen extends Component<NavigationScreenProps> {

    public static navigationOptions = {
        title: "Home"
    };

    public render() {
        return (
            <ScrollView
                style={{
                    backgroundColor: "#fff",
                    flex: 1,
                }}
            >
                {this.destinationAndTitlePairs.map(item => (
                    <TouchableHighlight 
                        key={item.destination}
                        onPress={() => 
                            this.props.navigation.navigate(item.destination)
                        }
                    >
                        <View
                            style ={{
                                height: 60,
                                width:160,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#F0F0F0',
                                borderBottomColor: '#666666',
                                borderBottomWidth: 1
                            }}
                        >
                            <Text>{item.title}</Text>
                        </View>
                        
                    </TouchableHighlight>
                ))}
            </ScrollView>
        )
    }

    private destinationAndTitlePairs: Array<DestinationAndTitle> = [
        new DestinationAndTitle("RepeatAnimationWithMask",'遮罩循环动画'),
        new DestinationAndTitle("ShakeRotateScreen",'抖三抖绕一圈'),
        new DestinationAndTitle("FindFood"),
        new DestinationAndTitle("TheoryRender"),
        new DestinationAndTitle("CardScreen"),
        new DestinationAndTitle("Accordion"),
    ];
}

