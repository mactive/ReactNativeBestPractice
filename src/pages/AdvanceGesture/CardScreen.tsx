import React, { Component } from 'react'
import { Text, View } from 'react-native';
import styled from "styled-components";

export class CardScreen extends Component {
    public render() {
        return (
            <Container>
                <Text>CardScreen</Text>
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