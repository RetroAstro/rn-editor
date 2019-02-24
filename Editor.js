import React, { Component } from 'react'

import {
  View,
  TextInput,
  StyleSheet,
  PixelRatio,
} from 'react-native'

import { WIDTH, getResponsiveWidth } from '../../common/styles'
import { RichTextEditor, RichTextToolbar, actions } from './react-native-zss-rich-text-editor'
import KeyboardSpacer from 'react-native-keyboard-spacer'

const Actions = [
  actions.insertImage,
  actions.identifyDiary,
  actions.line,
  actions.setBold,
  actions.setBlockquote,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.setStrikethrough
]

const Images = {
  [actions.insertImage]: [require('./images/icon-editor-photo-active.png')],
  [actions.identifyDiary]: [require('./images/ocr.png')],
  [actions.line]: [require('./images/line.png')],
  [actions.setBold]: [require('./images/icon-editor-bold.png'), require('./images/icon-editor-bold-active.png')],
  [actions.setBlockquote]: [require('./images/icon-editor-quote.png'), require('./images/icon-editor-quote-active.png')],
  [actions.insertBulletsList]: [require('./images/icon-editor-ul.png'), require('./images/icon-editor-ul-active.png')],
  [actions.insertOrderedList]: [require('./images/icon-editor-ol.png'), require('./images/icon-editor-ol-active.png')],
  [actions.setStrikethrough]: [require('./images/icon-editor-strikethrough.png'), require('./images/icon-editor-strikethrough-active.png')]
}

export default class NewDiary extends Component {
  state = {
    onFocus: false,
    preload: {
      [actions.insertImage]: Images[actions.insertImage][0],
      [actions.identifyDiary]: Images[actions.identifyDiary][0],
      [actions.line]: Images[actions.line][0],
      [actions.setBold]: Images[actions.setBold][0],
      [actions.setBlockquote]: Images[actions.setBlockquote][0],
      [actions.insertBulletsList]: Images[actions.insertBulletsList][0],
      [actions.insertOrderedList]: Images[actions.insertOrderedList][0],
      [actions.setStrikethrough]: Images[actions.setStrikethrough][0],
    }
  }
  onEditorInitialized = () => {
    this.richtext.setContentFocusHandler(() => {
      this.setState({
        onFocus: true
      })
    })
    this.richtext.setContentBlurHandler(() => {
      this.setState({
        onFocus: false
      })
    })
  }
  addImage = () => {

  }
  identifyDiary = () => {

  }
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.line_separator} />
          <TextInput
            style={styles.text_title}
            placeholder='标题（选填）'
            placeholderTextColor='#aaa'
          />
          <RichTextEditor
              ref={(r) => this.richtext = r}
              style={styles.richText}
              contentPlaceholder={'今天过得如何？'}
              editorInitializedCallback={this.onEditorInitialized}
          />
          <RichTextToolbar
            style={{
              backgroundColor: '#F2F2F2',
              height: this.state.onFocus ? 50 : 0
            }}
            actions={Actions}
            getEditor={() => this.richtext}
            selectedButtonStyle={{ backgroundColor: '' }}
            iconMap={this.state.preload}
            onPressAddImage={this.addImage}
            onPressIdentifyDiary={this.identifyDiary}
            selectedAction={(action, selected, selectedItems) => {
              let addtion = {}
              if (
                action === actions.insertOrderedList && selectedItems.includes(actions.insertBulletsList)
              ) {
                addtion = {
                  [actions.insertBulletsList]: Images[actions.insertBulletsList][0]
                }
              }
              if (
                action === actions.insertBulletsList && selectedItems.includes(actions.insertOrderedList)
              ) {
                addtion = {
                  [actions.insertOrderedList]: Images[actions.insertOrderedList][0]
                }
              }
              this.setState({
                preload: {
                  ...this.state.preload,
                  ...addtion,
                  [action]: Images[action][selected],
                }
              })
            }}
          />
          <KeyboardSpacer/>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  richText: {
    width: WIDTH,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  line_separator: {
    width: WIDTH - getResponsiveWidth(48),
    height: 1 / PixelRatio.get(),
    backgroundColor: '#d5d5d5',
    marginLeft: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(40)
  },
  text_title: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    marginBottom: getResponsiveWidth(20)
  }
})
