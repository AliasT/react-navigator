import TabNavigator from "../src"
import ReactDom from "react-dom"
import React from "react"

// scss file
import "../sass/react-navigator.scss"



const DATA = {
  title: {
    name: '聚划算'
  },

  links: [
    { name: "聚划算" },
    { name: "彩妆" },
    { name: "食品" },
    { name: "医药" },
    { name: "男装" },
    { name: "女装" },
    { name: "鞋帽" },
    { name: "爆破" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "炸弹" },
    { name: "鞋包" },
    { name: "饰品" },
    { name: "童装" }
  ]
}

ReactDom.render(<TabNavigator title={DATA.title} onClick={DATA.onClick} links={DATA.links} />, document.querySelector('#app'))

