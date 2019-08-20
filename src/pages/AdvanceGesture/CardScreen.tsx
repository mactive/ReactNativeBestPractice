import React, { Component } from 'react'
import { PanResponder, Animated, PanResponderInstance } from 'react-native';
import styled from "styled-components/native";
import Card from './Card'
interface Props {
    name?: string
}
interface State {
    pan: Animated.ValueXY
}
export class CardScreen extends Component<Props, State> {

    public panResponder!: PanResponderInstance;

    constructor(props: Props) {
        super(props);
    } 

    state = {
        pan: new Animated.ValueXY()
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            // onPanResponderGrant: (e,gestureState) => {},
            onPanResponderMove: Animated.event([
                null,
                { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: () => {
                Animated.spring(this.state.pan, { 
                    toValue: { x: 0, y: 0}
                }).start()
            },
        })
    }

    public render() {
        return (
            <Container>
                <Animated.View
                    style={{
                        transform: [
                            { translateX: this.state.pan.x },
                            { translateY: this.state.pan.y },
                        ]
                    }}
                    {...this.panResponder.panHandlers}
                >
                <Card
                    title="Price Tag"
                    image={require("../../assets/background5.jpg")}
                    author="Liu Yi"
                    text="Thanks to Design+Code, I improved my design skill and learned to do animations for my app Price Tag, a top news app in China."
                />
                </Animated.View>
            </Container>
        )
    }
}

const Container = styled.View`
    background: #f0f3f5;
    align-items: center;
    justify-content: center;
    flex: 1;
`;