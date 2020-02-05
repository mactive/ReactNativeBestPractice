// 此组件改写自 https://github.com/leecade/react-native-swiper
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ViewPagerAndroid,
  Platform,
  ActivityIndicator
} from 'react-native'

import carouselStyle from './styles'

export interface CarouselProps {
  children?: JSX.Element[]
  horizontal?: boolean
  style?: any
  containerStyle?: any
  scrollViewStyle?: any
  showPagination?: boolean
  loadMinimal?: boolean
  loadMinimalSize?: number
  loadMinimalLoader?: JSX.Element
  loop?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
  autoplayDirection?: boolean
  index?: number
  renderPagination?: (index, total, context) => JSX.Element
  dotStyle?: any
  activeDotStyle?: any
  dotColor?: any
  activeDotColor?: any
  activeDot?: JSX.Element
  dot?: any
  paginationStyle?: any
  onIndexChanged?: (index: number) => void
  onScrollBeginDrag?: (e, state, context) => void
  onMomentumScrollEnd?: (e, state, context) => void
}

const styles = StyleSheet.create<any>(carouselStyle)

export class Carousel extends Component<CarouselProps, any> {
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    showPagination: true,
    loop: true,
    loadMinimal: false,
    loadMinimalSize: 1,
    autoplay: false,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    index: 0,
    onIndexChanged: () => null
  }

  private internals: any
  private scrollView: any
  private autoplayTimer = null
  private loopJumpTimer = null
  // iOS 上 loop=false 时，第一张向左滑和最后一张向右滑，会触发子 View 的点击事件
  private beginDragCapture = false
  private ignoreScrollEndEvent = false
  private propsChangeCallback
  private androidResetPagerIndex: boolean = false

  constructor (props: CarouselProps) {
    super(props)
    this.state = this.initState(this.props)
  }

  componentWillUnmount () {
    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.loopJumpTimer && clearTimeout(this.loopJumpTimer)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.index !== nextState.index) this.props.onIndexChanged(nextState.index)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.autoplay && this.autoplayTimer) clearTimeout(this.autoplayTimer)

    if (this.internals.isScrolling) {
      // 闭包缓存对 nextProps 的处理，修复同时存在两个轮播互相影响导致渲染不正确的问题
      this.propsChangeCallback = () => {
        this.setState(this.initState(nextProps, this.shouldUpdateIndex(nextProps)))
        this.internals.autoplay = nextProps.autoplay
        if (nextProps.autoplay) this.autoplay()
      }
    } else {
      this.setState(this.initState(nextProps, this.shouldUpdateIndex(nextProps)))
      this.internals.autoplay = nextProps.autoplay
      if (nextProps.autoplay) this.autoplay()
    }
  }

  shouldUpdateIndex (nextProps) {
    if (this.props.index !== nextProps.index) {
      return true
    }

    // children 内容变更的额时候 index 也要变更
    const oldChildren = this.props.children
    const newChildren = nextProps.children

    // 只有一个元素的时候 index 都是 0 不需要变更
    // 只有数组需要统计
    if (Array.isArray(oldChildren) && Array.isArray(newChildren)) {
      const oldKeys = oldChildren.map(child => child.key)
      const newKeys = newChildren.map(child => child.key)
      return oldKeys.toString() !== newKeys.toString()
    }

    return false
  }

  autoplay = () => {
    if (!Array.isArray(this.props.children) || !this.internals.autoplay || this.internals.isScrolling || this.state.autoplayend) {
      return
    }

    this.autoplayTimer && clearTimeout(this.autoplayTimer)
    this.autoplayTimer = setTimeout(() => {
      if (!this.props.loop && (
        this.props.autoplayDirection
          ? this.state.index === this.state.total - 1
          : this.state.index === 0
      )) {
        this.setState({
          autoplayEnd: true
        })
        return
      }
      this.scrollBy(this.props.autoplayDirection ? 1 : -1)
    }, this.props.autoplayTimeout * 1000)
  }

  scrollBy = (index, animated = true) => {
    if (this.internals.isScrolling || this.state.total < 2) {
      return
    }
    const state = this.state
    const diff = (this.props.loop ? 1 : 0) + index + this.state.index
    let x = 0
    let y = 0
    if (state.dir === 'x') x = diff * state.width
    if (state.dir === 'y') y = diff * state.height

    if (Platform.OS === 'android') {
      this.scrollView && this.scrollView[animated ? 'setPage' : 'setPageWithoutAnimation'](diff)
    } else {
      this.scrollView && this.scrollView.scrollTo({ x, y, animated })
    }

    this.internals.isScrolling = true
    this.setState({
      autoplayEnd: false
    })

    if (!animated || Platform.OS === 'android') {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff
          }
        })
      })
    }
  }

  onScrollBegin = e => {
    this.beginDragCapture = true
    this.internals.isScrolling = true
    this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.fullState(), this)
  }

  onScrollEnd = e => {
    const ignore = this.ignoreScrollEndEvent
    this.ignoreScrollEndEvent = false

    if (ignore) {
      return
    }

    e.persist && e.persist()

    if (!e.nativeEvent.contentOffset) {
      if (this.state.dir === 'x') {
        e.nativeEvent.contentOffset = {
          x: e.nativeEvent.position * this.state.width
        }
      } else {
        e.nativeEvent.contentOffset = {
          y: e.nativeEvent.position * this.state.height
        }
      }
    }

    this.updateIndex(e.nativeEvent.contentOffset, this.state.dir, () => {
      if (this.internals.isScrolling && this.propsChangeCallback) {
        this.propsChangeCallback()
        this.propsChangeCallback = null
      } else {
        this.internals.isScrolling = false
        this.autoplay()
        this.loopJump()
        this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.fullState(), this)
      }
    })
  }

  onScrollEndDrag = e => {
    const {
      contentOffset
    } = e.nativeEvent
    const {
      horizontal,
      children
    } = this.props
    const {
      index
    } = this.state
    const {
      offset
    } = this.internals
    const previousOffset = horizontal ? offset.x : offset.y
    const newOffset = horizontal ? contentOffset.x : contentOffset.y

    if (previousOffset === newOffset &&
      (index === 0 || index === children.length - 1)) {
      this.internals.isScrolling = false
    }
  }

  updateIndex = (offset, dir, cb) => {
    if (offset === undefined || this.internals.offset === undefined) {
      return
    }
    const state = this.state
    let index = state.index
    const diff = offset[dir] - (this.internals.offset[dir] || 0)
    const step = dir === 'x' ? state.width : state.height
    let loopJump = false

    if (!diff) return
    index = parseInt(index + Math.round(diff / step), 10)
    if (this.props.loop) {
      if (index <= -1) {
        index = state.total - 1
        offset[dir] = step * state.total
        loopJump = true
        this.androidResetPagerIndex = true
      } else if (index >= state.total) {
        index = 0
        offset[dir] = step
        loopJump = true
        this.androidResetPagerIndex = true
      }
    }

    const newState: any = {}
    newState.index = index
    newState.loopJump = loopJump

    this.internals.offset = Object.assign({}, offset)

    if (loopJump) {
      // when swiping to the beginning of a looping set for the third time,
      // the new offset will be the same as the last one set in state.
      // Setting the offset to the same thing will not do anything,
      // so we increment it by 1 then immediately set it to what it should be,
      // after render.
      // 注意： 在安卓下如果触发 componentWillReceiveProps 后 不会触发 setState callback 导致无法无限轮播
      if (offset[dir] === this.internals.offset[dir]) {
        newState.offset = {
          x: 0,
          y: 0
        }
        newState.offset[dir] = offset[dir] + 1
        this.setState(newState, () => {
          this.setState({
            offset: offset
          }, cb)
        })
      } else {
        newState.offset = offset
        this.setState(newState, cb)
      }
    } else {
      this.setState(newState, cb)
    }
  }

  loopJump = () => {
    if (!this.state.loopJump) {
      return
    }
    const i = this.state.index + (this.props.loop ? 1 : 0)
    const scrollView = this.scrollView
    this.loopJumpTimer = setTimeout(() => scrollView.setPageWithoutAnimation && scrollView.setPageWithoutAnimation(i), 50)
  }

  initState (props, updateIndex = false) {
    const state = this.state || {
      width: 0,
      height: 0,
      offset: {
        x: 0,
        y: 0
      }
    }
    const initState: any = {
      autoplayEnd: false,
      loopJump: false,
      offset: {
        x: 0,
        y: 0
      }
    }

    initState.total = props.children ? props.children.length || 1 : 0

    if (state.total === initState.total && !updateIndex) {
      initState.index = state.index
    } else {
      initState.index = initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0
    }

    const {
      width,
      height
    } = Dimensions.get('window')

    initState.dir = props.horizontal === false ? 'y' : 'x'

    if (props.width) {
      initState.width = props.width
    } else if (this.state && this.state.width) {
      initState.width = this.state.width
    } else {
      initState.width = width
    }

    if (props.height) {
      initState.height = props.height
    } else if (this.state && this.state.height) {
      initState.height = this.state.height
    } else {
      initState.height = height
    }

    const offsetSetup = initState.index + (props.loop ? 1 : 0)
    initState.offset[initState.dir] = initState.dir === 'y'
      ? initState.height * offsetSetup
      : initState.width * offsetSetup

    this.internals = {
      ...this.internals,
      isScrolling: false,
      offset: initState.offset,
      autoplay: this.props.autoplay
    }

    // 强制修复同样内容的 index 问题
    if (Platform.OS !== 'android' && initState.total > 1 && updateIndex) {
      setTimeout(() => {
        this.scrollView.scrollTo({
          ...initState.offset,
          animated: false
        })
      }, 0)
    }

    return initState
  }

  fullState () {
    return Object.assign({}, this.state, this.internals)
  }

  onLayout = (event) => {
    const {
      width,
      height
    } = event.nativeEvent.layout
    const offset = this.internals.offset = {}
    const state: any = {
      width,
      height
    }
    if (this.state.total > 1) {
      let setup = this.state.index
      if (this.props.loop) {
        setup++
      }
      offset[this.state.dir] = this.state.dir === 'y'
        ? height * setup
        : width * setup
    }

    if (!this.state.offset || width !== this.state.width || height !== this.state.height) {
      state.offset = offset
    }

    this.setState(state)

    // onLayout 事件 发生在 componentDidMount 之后  会导致滚动一帧后重新计算布局 重新进行渲染的问题
    // web 环境中不支持 ScrollView 的 contentOffset 属性
    if (Platform.OS === 'web') {
      this.ignoreScrollEndEvent = true
      this.scrollView && this.scrollView.scrollTo(this.state.offset)
    }
    this.autoplay()
  }

  pageScrollStateChanged = (state) => {
    // 修复在安卓下如果触发 componentWillReceiveProps 后 不会触发 setState callback 导致无法无限轮播的问题
    if (state === 'idle' && this.androidResetPagerIndex) {
       // 兼容 Android 下先触发 onScrollEnd，再触发动画，导致第一轮结束后，由于 scroll 的距离没有初始化，第二帧轮播动画不正确的问题
      this.scrollView && this.scrollView['setPageWithoutAnimation'](this.state.index + 1)
      this.androidResetPagerIndex = false
    }
  }

  scrollViewPropOverrides = () => {
    const props = this.props
    let overrides = {}

    for (let prop in props) {
      if (typeof props[prop] === 'function' &&
        prop !== 'onMomentumScrollEnd' &&
        prop !== 'renderPagination' &&
        prop !== 'onScrollBeginDrag'
      ) {
        let originResponder = props[prop]
        overrides[prop] = (e) => originResponder(e, this.fullState(), this)
      }
    }

    return overrides
  }

  renderPagination = () => {
    if (this.state.total <= 1) {
      return null
    }

    let dots = []
    const ActiveDot = this.props.activeDot || <View style={[{
      backgroundColor: this.props.activeDotColor || '#fff',
      width: 8,
      height: 4,
      borderRadius: 2,
      marginLeft: 5,
      marginRight: 5,
      borderColor: 'rgba(0, 0, 0, .07)',
      borderWidth: StyleSheet.hairlineWidth
    }, this.props.activeDotStyle]} />
    const Dot = this.props.dot || <View style={[{
      backgroundColor: this.props.dotColor || 'rgba(255, 255, 255, .3)',
      width: 4,
      height: 4,
      borderRadius: 3,
      marginLeft: 5,
      marginRight: 5,
      borderColor: 'rgba(0, 0, 0, .07)',
      borderWidth: StyleSheet.hairlineWidth
    }, this.props.dotStyle]} />
    for (let i = 0; i < this.state.total; i++) {
      dots.push(i === this.state.index
        ? React.cloneElement(ActiveDot, {
          key: i
        })
        : React.cloneElement(Dot, {
          key: i
        })
      )
    }

    return (
      <View
        pointerEvents='none'
        style={[
          styles['pagination' + this.state.dir.toUpperCase()],
          this.props.paginationStyle
        ]}
      >
        {dots}
      </View>
    )
  }

  refScrollView = view => {
    this.scrollView = view
  }

  renderScrollView = pages => {
    // 动态设置帧数时，安卓下如果帧数设置为1，会出现不展示的情况
    if (pages.length === 1) {
      return (
        <View
        style={this.props.scrollViewStyle}>
          {pages}
        </View>
      )
    }
    if (Platform.OS !== 'android') {
      return (
        <ScrollView ref={this.refScrollView}
          {...this.props}
          {...this.scrollViewPropOverrides()}
          contentContainerStyle={[styles.wrapperIOS, this.props.style]}
          contentOffset={this.state.offset}
          onMoveShouldSetResponderCapture={() => this.beginDragCapture}
          onScrollBeginDrag={this.onScrollBegin}
          onTouchEnd={() => this.beginDragCapture = false }
          onMomentumScrollEnd={this.onScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          style={this.props.scrollViewStyle}>
          {pages}
        </ScrollView>
      )
    }
    return (
      <ViewPagerAndroid ref={this.refScrollView}
        {...this.props}
        initialPage={this.props.loop ? this.state.index + 1 : this.state.index}
        onPageSelected={this.onScrollEnd}
        onPageScrollStateChanged={this.pageScrollStateChanged}
        key={pages.length}
        style={[styles.wrapperAndroid, this.props.style]}>
        {pages}
      </ViewPagerAndroid>
    )
  }

  render () {
    const {
      index,
      total,
      width,
      height
    } = this.state
    const {
      children,
      containerStyle,
      loop,
      loadMinimal,
      loadMinimalSize,
      loadMinimalLoader,
      renderPagination,
      showPagination
    } = this.props
    const loopVal = loop ? 1 : 0
    let pages: any = []
    const pageStyle = [{ width, height }, styles.slide]
    const pageStyleLoading: any = {
      width,
      height,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
    if (total > 1) {
      pages = Object.keys(children)
      if (loop) {
        pages.unshift(String(total - 1))
        pages.push('0')
      }

      pages = pages.map((page, i) => {
        if (loadMinimal) {
          if (i >= (index + loopVal - loadMinimalSize) && i <= (index + loopVal + loadMinimalSize)) {
            return <View style={pageStyle} key={i}>{children[page]}</View>
          } else {
            return (
              <View style={pageStyleLoading} key={i}>
                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
              </View>
            )
          }
        } else {
          return <View style={pageStyle} key={i}>{children[page]}</View>
        }
      })
    } else {
      pages = [<View style={pageStyle} key={0}>{children}</View>]
    }

    return (
      <View
        style={[
          styles.container,
          containerStyle
        ]}
        onLayout={this.onLayout}
      >
        {this.renderScrollView(pages)}
        {showPagination && (renderPagination
          ? renderPagination(index, total, this)
          : this.renderPagination())}
      </View>
    )
  }
}