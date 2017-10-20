/**
 * Created by vincent on 17/3/11.
 */
import DisplayObject from "./DisplayObject";

/**
 * Created by vincent on 17/3/11.
 */
const DOMNamespaces = {
  html: 'http://www.w3.org/1999/xhtml',
  mathml: 'http://www.w3.org/1998/Math/MathML',
  svg: 'http://www.w3.org/2000/svg'
};

const namespaceURIMap = {
  // SVG
  circle: DOMNamespaces.svg,
  clipPath: DOMNamespaces.svg,
  defs: DOMNamespaces.svg,
  ellipse: DOMNamespaces.svg,
  g: DOMNamespaces.svg,
  image: DOMNamespaces.svg,
  line: DOMNamespaces.svg,
  linearGradient: DOMNamespaces.svg,
  mask: DOMNamespaces.svg,
  path: DOMNamespaces.svg,
  pattern: DOMNamespaces.svg,
  polygon: DOMNamespaces.svg,
  polyline: DOMNamespaces.svg,
  radialGradient: DOMNamespaces.svg,
  rect: DOMNamespaces.svg,
  stop: DOMNamespaces.svg,
  svg: DOMNamespaces.svg,
  text: DOMNamespaces.svg,
  tspan: DOMNamespaces.svg,
  // MATH
  math: DOMNamespaces.mathml
};
const defaultNodeType = 'div';

function createDOMNode(type) {
  let element;
  type = type || defaultNodeType;
  let namespaceURI = namespaceURIMap[type];
  if(namespaceURI){
    element = document.createElementNS(namespaceURI, type);
  }else{
    element = document.createElement(type);
  }
  return element;
}

module.exports = function createElement(nodeType, Props, ...children) {
  let element;
  let component;

  let {style, className, ...props} = Props || {};
  if(typeof nodeType == 'string'){
    element = createDOMNode(nodeType);
    component = new DisplayObject();
    component.positioner = component.element = element;

    for (let key in props) {
      if(props.hasOwnProperty(key)) {
        element.setAttribute(key, props[key]);
      }
    }
    // 如果有 name 属性，就指定给 组件，父节点可以通过 getElementByName 查找
    if(props.hasOwnProperty('name')){
      component.name = props.name;
    }
  }else{
    component = new nodeType();
    for (let key in props) {
      if(props.hasOwnProperty(key)) {
        Object.assign(component, props[key]);
      }
    }
  }
  if(className){
    component.className = className;
  }
  if(style){
    component.setStyle(style);
  }

  if(children.length > 0){
    children.forEach((child)=>{
      if(typeof child == 'string'){
        var textNode = document.createTextNode(child);
        element.appendChild(textNode);
      }else if(child instanceof DisplayObject){
        component.addElement(child);
      }
    });
  }
  return component;
};