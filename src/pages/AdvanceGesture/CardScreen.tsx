import React, { Component } from 'react'
import { Text, View, PanResponder, Animated, PanResponderStatic } from 'react-native';
import styled from "styled-components/native";
import Card from './Card'
interface Props {
    name?: string
}
export class CardScreen extends Component<Props> {

    public panResponder!: PanResponderStatic;

    constructor(props: Props) {
        super(props);
    } 

    state = {
        pan: new Animated.ValueXY()
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true
        })
    }

    public render() {
        return (
            <Container>
                <Card
                    title="Price Tag"
                    image={require("../../assets/background5.jpg")}
                    author="Liu Yi"
                    text="Thanks to Design+Code, I improved my design skill and learned to do animations for my app Price Tag, a top news app in China."
                />
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