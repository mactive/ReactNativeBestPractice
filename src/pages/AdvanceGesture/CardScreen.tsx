import React, { Component } from 'react'
import { PanResponder, Animated, PanResponderInstance } from 'react-native';
import styled from "styled-components/native";
import Card from './Card'
interface Props {
    name?: string
}
interface State {
    pan: Animated.ValueXY
    scale: Animated.Value
    translateY: Animated.Value
    thirdScale: Animated.Value
    thirdTranslateY: Animated.Value
    index: number
}
export class CardScreen extends Component<Props, State> {

    public panResponder!: PanResponderInstance;

    constructor(props: Props) {
        super(props);
    } 

    state = {
        // original
        pan: new Animated.ValueXY(),
        // second
        scale: new Animated.Value(0.9),
        translateY: new Animated.Value(44),
        // third
        thirdScale: new Animated.Value(0.8),
        thirdTranslateY: new Animated.Value(-50),
        index: 0
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onPanResponderGrant: () => {
                Animated.spring(this.state.scale, { toValue: 1 }).start();
                Animated.spring(this.state.translateY, { toValue: 0}).start();
                Animated.spring(this.state.thirdScale, { toValue: 0.9 }).start();
                Animated.spring(this.state.thirdTranslateY, { toValue: 44 }).start();
            },
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: () => {
                const positionY = this.state.pan.y.__getValue();
                /** 超出200的位移, 那么丢掉 */
                if (positionY > 200) {
                    Animated.timing(this.state.pan, {
                        toValue: {x: 0, y: 1000}
                    }).start(() => {
                        this.state.pan.setValue({x: 0, y: 0});
                        this.state.scale.setValue(0.9);
                        this.state.translateY.setValue(44);
                        this.state.thirdScale.setValue(0.8);
                        this.state.thirdTranslateY.setValue(-50);
                        this.setState({index: this.getNextIndex(this.state.index)});
                    });
                } else {
                    Animated.spring(this.state.pan, { toValue: { x: 0, y: 0} }).start();
                    Animated.spring(this.state.scale, { toValue: 0.9 }).start()
                    Animated.spring(this.state.translateY, { toValue: 44 }).start()
                    Animated.spring(this.state.thirdScale, { toValue: 0.8 }).start();
                    Animated.spring(this.state.thirdTranslateY, { toValue: -50 }).start();
                }
                
            },
        })
    }

    private getNextIndex = (index: number) => {
        const nextIndex = index + 1;
        if (nextIndex > cards.length - 1) {
            return 0
        } else {
            return nextIndex
        }
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
                    title={cards[this.state.index].title}
                    image={cards[this.state.index].image}
                    author={cards[this.state.index].author}
                    text={cards[this.state.index].text}
                />
                </Animated.View>
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: -1,
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [
                            { scale: this.state.scale },
                            { translateY: this.state.translateY },
                        ]
                    }}
                >
                <Card
                    title={cards[this.getNextIndex(this.state.index)].title}
                    image={cards[this.getNextIndex(this.state.index)].image}
                    author={cards[this.getNextIndex(this.state.index)].author}
                    text={cards[this.getNextIndex(this.state.index)].text}
                />
                </Animated.View>
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: -2,
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [
                            { scale: this.state.thirdScale },
                            { translateY: this.state.thirdTranslateY },
                        ]
                    }}
                >
                <Card
                    title={cards[this.getNextIndex(this.state.index + 1)].title}
                    image={cards[this.getNextIndex(this.state.index + 1)].image}
                    author={cards[this.getNextIndex(this.state.index + 1)].author}
                    text={cards[this.getNextIndex(this.state.index + 1)].text}
                />
                </Animated.View>
            </Container>
        )
    }
}

const cards = [
    {
      title: "Price Tag",
      image: require("../../assets/background5.jpg"),
      author: "Liu Yi",
      text:
        "Thanks to Design+Code, I improved my design skill and learned to do animations for my app Price Tag, a top news app in China."
    },
    {
      title: "The DM App - Ananoumous Chat",
      image: require("../../assets/background6.jpg"),
      author: "Chad Goodman",
      text:
        "Design+Code was the first resource I used when breaking into software. I went from knowing nothing about design or code to building a production ready app from scratch. "
    },
    {
      title: "Nikhiljay",
      image: require("../../assets/background7.jpg"),
      author: "Nikhil D'Souza",
      text:
        "Recently finished the React course by @Mengto, and I 10/10 would recommend. I already rewrote my personal website in @reactjs and I'm very excited with it."
    }
  ];

const Container = styled.View`
    background: #f0f3f5;
    align-items: center;
    justify-content: center;
    flex: 1;
`;