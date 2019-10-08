import React, { Component } from 'react'
import { Button, ScrollView } from 'react-native';
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
                    <Button 
                        key={item.destination}
                        onPress={() => 
                            this.props.navigation.navigate(item.destination)
                        }
                        title={item.title}
                    />
                ))}
            </ScrollView>
        )
    }

    private destinationAndTitlePairs: Array<DestinationAndTitle> = [
        new DestinationAndTitle("FindFood"),
        new DestinationAndTitle("TheoryRender"),
        new DestinationAndTitle("CardScreen"),
    ];
}

