import React from "react"
import ReactDom from "react-dom"
import Tween from './tween'
import RCTG from 'react-addons-css-transition-group'


function addClass ($ele, name) {
  if ($ele) {
    $ele.className += ` ${name}`;
  }
}

function removeClass ($ele, name) {
  if ($ele) {
    const className      = $ele.className;
    const classNameArray = className.split(' ');
    const indexOfName    = classNameArray.indexOf(name);

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

    this.state.$wrapper = $wrapper;
    this.state.$ele     = $ele;

    const eleWidth     = $ele.offsetWidth;
    const wrapperWidth = $wrapper.offsetWidth;
    const maxDelta     = eleWidth - wrapperWidth;

    var start      = { x: 0, y: 0 };
    var end        = { x: 0, y: 0 };

    $ele.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      start.x = touch.pageX;
      end.x = start.x;
    })

    $ele.addEventListener('touchmove', (e) => {
      end.x = e.touches[0].pageX;
      const deltaX = end.x - start.x;
      setTranslateX($wrapper, this.state.translateX + deltaX);
    })

    // 如果左右超出，产生一个动画回弹
    $ele.addEventListener('touchend', (e) => {
      const deltaX = end.x - start.x
      this.state.translateX += deltaX;

      var x = null;

      if (this.state.translateX >= 0) { x = 0; }
      else if (this.state.translateX <= maxDelta) { x = maxDelta; }

      if (x != null && deltaX != 0) {
        this.updateTranslateX(x, 0.5)
      }

      start.x = end.x;
    })
  }

  updateTranslateX (x, timeout) {
    var o = { x: this.state.translateX };
    Tween.to(o, timeout, { x: x, onUpdate: () => {
      setTranslateX(this.state.$wrapper, o.x);
    }, onComplete:  () => {
      this.state.translateX = x;
    }})
  }

  onClick ($target) {
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

    this.updateTranslateX(this.state.translateX - result, 0.2)
  }

  render () {
    const result = this.props.links.map((link, i) => {
      return <Link current={this.props.current} name={link.name} key={i} onClick={this.onClick.bind(this)}></Link>
    })

    return (
      <div ref="$ele" className="sub-menus flex-item">
        <div ref="$wrapper">{ result }</div>
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
