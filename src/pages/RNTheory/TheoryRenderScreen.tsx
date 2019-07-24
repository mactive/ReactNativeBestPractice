import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, ScrollView, TouchableHighlightBase } from 'react-native';
import { NavigationScreenProps } from "react-navigation";
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

interface KindofRenderProps {
    theme?: string,
    title?: string,
    subTitle?: string,
}

enum RenderColor {
    blue = "#37B6FF",
    darkblue = "#00A2FF",
    green = "#60D937",
    darkgreen = "#1EB100",
    yellow = "#F8BB00",
    darkyellow = "#FF9400",

}

/**
 * React Stateless Functional
 * 渲染 DSL 组件
 */
const RenderComponent:React.SFC<KindofRenderProps> = (props) => {
    return(
        <View style={[styles.compWarpper, {backgroundColor: props.theme} ]}>
            <View style={styles.compTitleWarpper}>
                <Text style={styles.compTitle}>{props.title}</Text>
                <Text style={styles.compSubTitle}>{props.subTitle}</Text>
            </View>
            <Ionicons name="md-arrow-down" size={20} color="#fff" />
        </View>
    );
}

RenderComponent.defaultProps = {
    theme: RenderColor.blue, //默认主题色
}

export class TheoryRenderScreen extends Component<NavigationScreenProps, any> {
    public static navigationOptions = {
        title: "React.JS和React.Native渲染对比"
    };

    constructor(props: NavigationScreenProps, context?: any) {
        super(props, context);
    
        this.state = {
          renderPattern: 'React.JS'
        };
      }

    public switchRender = () => {
        const thePattern = this.state.renderPattern === 'React.JS' ?  'React.Native': 'React.JS' ; 
        this.setState({
            renderPattern: thePattern
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.stepWrapper}>
                        <Text style={styles.stepTitle}>1. 组件式开发方式</Text>
                        <RenderComponent title="Component" subTitle="业务组件"/>
                        <RenderComponent title="Props & State" subTitle="外参内参"/>
                        <RenderComponent title="LifeCycle" subTitle="生命周期"/>
                        <RenderComponent title="JSX" subTitle="render内容"/>
                    </View>
                    <View style={styles.stepWrapper}>

                        <Text style={styles.stepTitle}>2. React转义和节点引擎</Text>
                        <RenderComponent title="ReactElement" subTitle="react基础元素" 
                            theme={RenderColor.darkblue}/>
                        <RenderComponent title="Fiber" subTitle="节点协调算法" 
                            theme={RenderColor.darkblue}/>
                    </View>
                    {
                        this.state.renderPattern === 'React.JS' ?
                        <View style={styles.stepWrapper}>
                            <Text style={styles.stepTitle}>3. {this.state.renderPattern}渲染过程</Text>
                            <RenderComponent title="ReactDom.render()" subTitle="Dom节点渲染" 
                                theme={RenderColor.green} />
                            <RenderComponent title="浏览器JS引擎" subTitle="浏览器JS引擎" 
                                theme={RenderColor.darkgreen} />
                            <RenderComponent title="TouchEvent" subTitle="浏览器交互手势" 
                                theme={RenderColor.darkgreen} />
                            <RenderComponent title="Webkit-Dom" subTitle="Webkit-Dom渲染" 
                                theme={RenderColor.darkgreen} />
                            <RenderComponent title="Webkit-CSS" subTitle="Webkit-CSS渲染" 
                                theme={RenderColor.darkgreen} />
                        </View>
                        : <View style={styles.stepWrapper}>
                            <Text style={styles.stepTitle}>3. {this.state.renderPattern}渲染过程</Text>
                            <RenderComponent title="AppRegistry.registerComponent" subTitle="AppRegistry注册" 
                                theme={RenderColor.yellow} />
                            <RenderComponent title="JSCore" subTitle="RN容器JS引擎" 
                                theme={RenderColor.darkyellow} />
                            <RenderComponent title="Gesture" subTitle="Native交互手势" 
                                theme={RenderColor.darkyellow} />
                            <RenderComponent title="Layout" subTitle="支持Flexbox的layout引擎,yoga" 
                                theme={RenderColor.darkyellow} />
                            <RenderComponent title="StyleSheet" subTitle="支持有线的CSS属性" 
                                theme={RenderColor.darkyellow} />
                        </View>
                    }
                                    
                </ScrollView>
                <View style={{height: 84}}>
                    <TouchableOpacity style={styles.switchRender}
                        onPress={this.switchRender}
                >
                        <Text>{this.state.renderPattern}渲染过程</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    compWarpper: { 
        backgroundColor: RenderColor.blue ,
        padding: 10,
        flexDirection: "row", 
        marginBottom: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    compTitleWarpper:{
        flexDirection: "column", 
    },
    compTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", lineHeight: 34, }, 
    compSubTitle: { fontSize: 12, color: "#fff", },
    stepWrapper: {marginHorizontal: 20, marginTop: 10, marginBottom: 10, },
    stepTitle: { fontSize: 20, fontWeight: "bold", color: "#333", lineHeight: 34, }, 
    switchRender: {
        height: 64,
        backgroundColor: "#eee",
        borderColor: "#666",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems:"center"
    },
});