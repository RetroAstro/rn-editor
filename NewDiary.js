import React, { Component } from 'react'

import {
  View,
  Image,
  Animated,
  StyleSheet,
  DatePickerIOS,
  TouchableOpacity
} from 'react-native'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'
import Editor from './Editor'
import { formatDate } from '../../common/util'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

class DownBox extends Component {
    state = {
        opacity: new Animated.Value(0),
        downBoxY: new Animated.Value(-340)
    }
    easedownBox(show) {
        Animated.parallel([
            Animated.spring(
                this.state.downBoxY,
                {
                    toValue: show ? 0 : -340,
                    duration: 300
                }
            ).start(),
            Animated.timing(
                this.state.opacity,
                {
                    toValue: show ? 0.48 : 0,
                    duration: 300
                }
            ).start(() => !show ? this.props.hidedownBox() : null)       
        ])
    }
    _hidedownBox = () => {
        this.easedownBox(false)
    }
    componentDidUpdate() {
        this.props.showdownBox ? this.easedownBox(true) : null
    }
    render() {
        return (
            this.props.showdownBox ?
            <Animated.View
                style={{
                    width: WIDTH,
                    height: HEIGHT,
                    zIndex: 100,
                    backgroundColor: '#000',
                    opacity: this.state.opacity
                }}
            >
                <Animated.View style={{
                    zIndex: 120,
                    width: WIDTH,
                    position: 'absolute',
                    bottom: this.state.downBoxY,
                    height: getResponsiveHeight(340),
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    paddingTop: getResponsiveWidth(26),
                    paddingHorizontal: getResponsiveWidth(24)
                }}>
                    <View style={styles.flex_between}>
                        <TouchableOpacity onPress={this._hidedownBox}>
                            <TextPingFang style={styles.text_cancel}>取消</TextPingFang>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._hidedownBox}>
                            <TextPingFang style={styles.text_done}>完成</TextPingFang>
                        </TouchableOpacity>
                    </View>
                    {this.props.children}
                </Animated.View>
            </Animated.View> : null
        )
    }
}

export default class NewDiary extends Component {
    state = {
        date: new Date(),
        content: 'datePicker',
        pubHole: false,
        showdownBox: false
    }
    _renderPrivacy() {
        const items = [
            {
                icon: 'friends',
                text_p1: '好友可见',
                text_p2: '只有你和匹配对象能够看到'
            },
            {
                icon: 'treehole',
                text_p1: '发布到树洞',
                text_p2: '匿名发到树洞并在树洞广场保留 48 小时'
            }
        ]
        return (
            items.map((item) => (
                <View style={[
                    styles.flex_between,
                    { marginBottom: item.icon === 'friends' ? getResponsiveWidth(35) : 0 }
                ]}>
                    <View style={styles.flex_start}>
                        <View>
                            <Image
                                style={{
                                    width: getResponsiveWidth(28),
                                    height: getResponsiveWidth(28)
                                }}
                                resizeMode="contain"
                                source={item.icon === 'friends' ? 
                                require('./images/icon-editor-state.png') : require('./images/icon-treehole.png')}
                            />
                        </View>
                        <View style={[
                            styles.flex_column_start,
                            { marginLeft: getResponsiveWidth(30) }
                        ]}>
                            <TextPingFang style={styles.text_p1}>{item.text_p1}</TextPingFang>
                            <TextPingFang style={styles.text_p2}>{item.text_p2}</TextPingFang>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        item.icon === 'treehole' ?
                        this.setState({
                            pubHole: !this.state.pubHole
                        }) : null 
                    }}>
                        <Image
                            source={item.icon === 'friends' ? 
                            require('./images/oval-h.png') : this.state.pubHole ? 
                            require('./images/oval-h.png') : require('./images/oval.png')}
                        />
                    </TouchableOpacity>
                </View>
            ))
        )
    }
    render() {
        return (
            <Container>
                <DownBox
                    showdownBox={this.state.showdownBox}
                    hidedownBox={() => {
                        this.setState({
                            showdownBox: false
                        })
                    }}
                >
                    <View style={styles.date_picker}>
                        {
                            this.state.content === 'datePicker' ?
                            <DatePickerIOS
                                locale={'zh-Hans'}
                                style={styles.date_picker}
                                date={this.state.date}
                                maximumDate={new Date()}
                                mode={'date'}
                                onDateChange={date => this.setState({ date })}
                            /> : 
                            <View style={styles.privacy}>
                                { this._renderPrivacy() }
                            </View>
                        }
                    </View>
                </DownBox>
                <View style={styles.header}>
                    <View style={styles.flex_start}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                content: 'datePicker',
                                showdownBox: true
                            })
                        }}>
                            <View style={styles.flex_start}>
                                <View>
                                    <Image source={require('./images/bge.png')} />
                                    <TextPingFang style={styles.text_day}>{formatDate(this.state.date, 'dd')}</TextPingFang>
                                </View>
                                <TextPingFang style={styles.text_week}>{'周' + formatDate(this.state.date, 'W')}</TextPingFang>
                                <View style={styles.check}>
                                    <Image source={require('./images/icon-more.png')} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                content: 'privacy',
                                showdownBox: true
                            })
                        }}>
                            <View style={styles.middle}>
                                <View>
                                    <Image source={require('./images/icon-editor-state.png')} />
                                </View>
                                <TextPingFang style={styles.mate_visible}>好友可见</TextPingFang>
                                <View style={styles.check}>
                                    <Image source={require('./images/icon-more.png')} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <View>
                            <Image source={require('./images/done.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Editor />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    flex_start: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    flex_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    flex_column_start: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    header: {
        width: WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: getResponsiveWidth(24),
        marginTop: getResponsiveWidth(24),
        marginBottom: getResponsiveWidth(24)
    },
    check: {
        marginLeft: getResponsiveWidth(6)
    },
    privacy: {
        marginTop: getResponsiveWidth(45)
    },
    text_p1: {
        fontSize: 17,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: getResponsiveWidth(3)
    },
    text_p2: {
        fontSize: 12,
        color: '#666'
    },
    text_cancel: {
        color: '#aaa',
        fontSize: 17
    },
    text_done: {
        color: '#00B377',
        fontSize: 17,
        fontWeight: 'bold'
    },
    text_day: {
        color: '#aaa',
        fontSize: 11,
        position: 'absolute',
        top: getResponsiveWidth(5),
        left: getResponsiveWidth(5.5)
    },
    text_week: {
        color: '#aaa',
        fontSize: 12,
        marginLeft: getResponsiveWidth(5)
    },
    date_picker: {
        marginTop: getResponsiveWidth(15)
    },
    middle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: getResponsiveWidth(45)
    },
    mate_visible: {
        color: '#aaa',
        fontSize: 12,
        marginLeft: getResponsiveWidth(5)
    }
})
