import React from "react"
import ReactDom from "react-dom"
import RCTG from 'react-addons-css-transition-group'
import Swiper from 'swiper'

function addClass ($ele, name) {
  if ($ele) {
    $ele.className += ` ${name}`
  }
}

function removeClass ($ele, name) {
  if ($ele) {
    const className      = $ele.className;
    const classNameArray = className.split(' ')
    const indexOfName    = classNameArray.indexOf(name)

    classNameArray.splice(indexOfName, 1)
    $ele.className = classNameArray.join(' ')
  }
}

function setTranslateX ($ele, x) {
  $ele.style.transform = `translate(${x}px)`;
}
/**
 * 单个子链接
 */
class Link extends React.Component {
  componentDidMount () {

  }

  onClick(e) {
    e.stopPropagation();
    this.props.onClick && this.props.onClick(e.target);
  }

  render () {
    return (
      <a ref={ ele => this.ele = ele }
        onClick={this.onClick.bind(this)}
        className="link" href="#"
      >{this.props.name}</a>
    )
  }
}


/**
 *
 * 子链接组合
 *
 */


class LinkGroup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      translateX: 0,
      $wrapper: null,
      $ele: null
    }
  }

  componentDidMount () {
    const { $wrapper, $ele } = this.refs

    this.swiper = new Swiper('.swiper-container', {
      cssWidthAndHeight: false,
      scrollContainer: true,
      freeMode: true,
      freeModeFluid: true,
      slidesPerView:'auto'
    })

    this.swiper.on('setTranslate', (swiper, translate) => {
      this.swiper.setWrapperTransition(300)
    })

    this.state.$wrapper = $wrapper;
    this.state.$ele     = $ele;
  }

  onClick ($target, i) {
    this.props.onClick && this.props.onClick($target);
    const wrapperRect = this.state.$wrapper.getBoundingClientRect()
    const targetRect  = $target.getBoundingClientRect()

    const wrapperLeft = wrapperRect.left;
    const targetLeft  = targetRect.left;

    const disToEleMid = targetLeft - wrapperLeft + $target.offsetWidth / 2 + this.state.translateX - this.state.$ele.offsetWidth / 2;

    var result = null;

    if (disToEleMid >= 0) {
      let t = this.state.translateX + this.state.$wrapper.offsetWidth - this.state.$ele.offsetWidth
      result = Math.min(t, disToEleMid)
    } else if (disToEleMid < 0) {
      result = Math.max(disToEleMid, this.state.translateX)
    }

    const translateX = this.state.translateX
    this.swiper.setWrapperTranslate(translateX - result, 0, 0)
    this.state.translateX = translateX - result
  }

  render () {
    const result = this.props.links.map((link, i) => {
      return (
        <div key={i}  className="swiper-slide">
          <Link current={this.props.current} name={link.name} onClick={ e=>this.onClick(e, i)}></Link>
        </div>
      )
    })

    return (
      <div ref="$ele" className="sub-menus container-scroll flex-item swiper-container">
        <div ref="$wrapper" className="swiper-wrapper">
          { result }
        </div>
      </div>
    )
  }
}


export default class TabNavigator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      current: null
    }
  }

  onClick ($target) {
    // 设置样式
    removeClass(this.state.current, 'active')
    addClass($target, 'active')
    this.setState({
      current: $target
    })
  }

  componentDidMount () {
    this.setState({
      current: this.refs.title
    })
  }

  render () {
    return (
      <div className="react-navigator">
        <div className="title">
          <Link current={this.state.current} refs="title" name={this.props.title.name} key="title" onClick={this.onClick.bind(this)}></Link>
          <span className="shadow"></span>
        </div>
        <LinkGroup current={this.state.current} links={this.props.links} onClick={this.onClick.bind(this)}></LinkGroup>
      </div>
    )
  }
}
