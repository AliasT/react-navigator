import React from "react"
import ReactDom from "react-dom"
import Iscroll from "iscroll"
import $ from "jquery"
import Tween from './tween'

function addClass ($ele, name) {
  $ele.className += ` ${name}`;
}

function removeClass ($ele, name) {
  const className = $ele.className;
  const classNameArray = className.split(' ');
  const indexOfName = classNameArray.indexOf(name);

  $ele.className = className.splice(indexOfName).join(' ')
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

  onClick() {
    // this.props.onClick && this.props.onClick();
  }

  render () {
    return <a ref={ ele => this.ele = ele } onClick={this.onClick}className="link" href="#">{this.props.name}</a>
  }
}


/**
 *
 * 子链接组合
 *
 */


class LinkGroup extends React.Component {

  componentDidMount () {
    const { $wrapper, $ele } = this.refs

    const eleWidth     = $ele.offsetWidth;
    const wrapperWidth = $wrapper.offsetWidth;
    const maxDelta     = eleWidth - wrapperWidth;

    var start      = { x: 0, y: 0 };
    var end        = { x: 0, y: 0 };
    var translateX = 0;

    function onupdate () {

    }

    $ele.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      start.x = touch.pageX;
      end.x = start.x;
    })

    $ele.addEventListener('touchmove', (e) => {
      end.x = e.touches[0].pageX;
      const deltaX = end.x - start.x;
      setTranslateX($wrapper, translateX + deltaX);
    })

    $ele.addEventListener('touchend', (e) => {
      translateX += end.x - start.x;
      // 如果左右超出，产生一个动画回弹
      var o = { x: translateX };
      var x = null;

      if (translateX >= 0) { x = 0; }
      else if (translateX <= maxDelta) { x = maxDelta; }

      if (x != null) {
        Tween.to(o, 0.5, { x: x, onUpdate: function() {
          setTranslateX($wrapper, o.x);
        }, onComplete: function () {
          translateX = x;
        }})
      }

      start.x = end.x;
    })
  }

  render () {
    const result = this.props.links.map((link, i) => {
      return <Link name={link.name} key={i}></Link>
    })

    return (
      <div ref="$ele" className="sub-menus flex-item">
        <div ref="$wrapper">{ result }</div>
      </div>
    )
  }
}


export default class TabNavigator extends React.Component {
  render () {
    return (
      <div className="react-navigator">
        <div className="title">
          <Link name={this.props.title.name} key="title"></Link>
          <span className="shadow"></span>
        </div>
        <LinkGroup links={this.props.links}></LinkGroup>
      </div>
    )
  }
}
