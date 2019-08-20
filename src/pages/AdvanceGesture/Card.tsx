import React, { Component } from "react";
import { ImageSourcePropType } from 'react-native';
import styled from "styled-components/native";

interface CardProps {
    image: ImageSourcePropType
    title: string
    author: string
    text: string
}

export default class Card extends Component<CardProps> {
  render() {
    return (
      <Container>
        <Cover>
          <Image source={this.props.image} />
          <Title>{this.props.title}</Title>
          <Author>by {this.props.author}</Author>
        </Cover>
        <Detail>{this.props.text}</Detail>
      </Container>
    );
  }
}

const Container = styled.View`
  width: 315px;
  height: 460px;
  border-radius: 14px;
  background-color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const Cover = styled.View`
  height: 290px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  overflow: hidden;
`;

const Image = styled.Image`
  width: 100%;
  height: 290px;
`;

const Title = styled.Text`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  width: 300px;
`;

const Author = styled.Text`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Detail = styled.Text`
  font-size: 17px;
  margin: 20px;
  line-height: 24px;
  color: #3c4560;
`;
