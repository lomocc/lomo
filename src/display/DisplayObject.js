import EventDispatcher from "./EventDispatcher";
import HashMap from "hashmap";

class DisplayObject extends EventDispatcher {
  static styleRules = {
    perInstanceStyles : {
      'backgroundColor': 1,
      'backgroundImage': 1,
      'color': 1,
      'fontFamily': 1,
      'fontWeight': 1,
      'fontSize': 1,
      'fontStyle': 1
    },
    colorStyles : {
      'backgroundColor': 1,
      'borderColor': 1,
      'color': 1
    },
    skipStyles : {
      'constructor': 1
    },
    numericStyles : {
      'fontWeight': 1
    }
  };
  static toHexColor(value){
    var hexVal = value.toString(16);
    if(value > 16777215)
    {
      //rgba -- return rgba notation
      var rgba = hexVal.match(/.{2}/g);
      for(var i = 0; i < 4; i++)
      {
        rgba[i] = parseInt(rgba[i], 16);
      }
      rgba[3] = parseInt(""+(rgba[3]/255)*1000, 10) / 1000;
      return "rgba(" + rgba.join(",") + ")";
    }
    return "#" + hexVal.padStart(6, '0');
  }
  constructor() {
    super();

    this.createElement();
  }
  _element;

  get element(){
    return this._element;
  }

  set element(value) {
    if (this._element != value) {
      this._element = value;
    }
  }

  _props;
  get props() {
    if(!this._props){
      this._props = new HashMap();
    }
    return this._props;
  }

  get lomo_wrapper() {
    return this;
  }
  set lomo_wrapper(value) {
  }

  createElement(){
    this.positioner = this.element = document.createElement('div');
    this.positioner.style.display = 'block';
    //positioner.style.position = 'relative';
  }

  _x;

  set x(value)
  {
    //this.positioner.style.position = 'absolute';
    this.positioner.style.left = value.toString() + 'px';
  }

  get x() {
    let strpixels = this.positioner.style.left;
    let pixels = parseFloat(strpixels);
    if (isNaN(pixels))
      pixels = this.positioner.offsetLeft;
    return pixels;
  }

  _y;

  set y(value) {
    //this.positioner.style.position = 'absolute';
    this.positioner.style.top = value.toString() + 'px';
  }

  get y() {
    let strpixels = this.positioner.style.top;
    let pixels = parseFloat(strpixels);
    if (isNaN(pixels))
      pixels = this.positioner.offsetTop;
    return pixels;
  }


  $displayStyleForLayout;

  get visible() {
    return this.positioner.style.display !== 'none';
  }

  set visible(value) {
    let oldValue = this.positioner.style.display !== 'none';
    if (value !== oldValue) {
      if (value) {
        this.positioner.style.display = this.$displayStyleForLayout;
      } else {
        this.$displayStyleForLayout = this.positioner.style.display;
        this.positioner.style.display = 'none';
      }
      this.dispatchEvent('visibleChanged');
    }
  }

  internalChildren() {
    return this.element.childNodes;
  }

  _name;

  get name() {
    return this._name;
  }

  set name(value) {
    if (this._name != value) {
      this._name = value;
    }
  }
  getElementByName(name){
    let children = this.internalChildren();
    for (let i = 0; i < children.length; i++) {
      let wrapper = children[i].lomo_wrapper;
      if(wrapper){
        if (wrapper.name == name)
          return wrapper;
        else{
          let element = wrapper.getElementByName(name);
          if(element){
            return element;
          }
        }
      }
    }
  }

  get style() {
    return this.positioner.style;
  }

  get className() {
    return this.positioner.className;
  }

  set className(value) {
    if (this.positioner.className != value) {
      this.positioner.className = value;
    }
  }

  addElement(c) {
    this.element.appendChild(c.positioner);
  }

  addElementAt(c, index) {
    let children = this.internalChildren();
    if (index >= children.length)
      this.addElement(c);
    else {
      this.element.insertBefore(c.positioner, children[index]);
    }
  }

  getElementAt(index) {
    let children = this.internalChildren();
    if (children.length == 0) {
      return null;
    }
    return children[index].lomo_wrapper;
  }

  getElementIndex(c) {
    let children = this.internalChildren();
    for (let i = 0; i < children.length; i++) {
      if (children[i] == c.positioner)
        return i;
    }
    return -1;
  }

  removeElement(c) {
    this.element.removeChild(c.positioner);
  }

  removeElementAt(index) {
    let child = this.getElementAt(index);
    this.removeElement(child);
  }

  get numElements() {
    let children = this.internalChildren();
    return children.length;
  }

  _positioner;

  get positioner() {
    return this._positioner;
  }

  set positioner(value) {
    if(this._positioner != value) {
      this._positioner = value;

      if (process.env.NODE_ENV !== 'production') {
        this.positioner.setAttribute('data-lomo', this.constructor.name || 'DisplayObject');
      }
      this.positioner.lomo_wrapper = this;
    }
  }

  get alpha(){
    let strAlpha = this.positioner.style.opacity;
    return parseFloat(strAlpha);
  }

  set alpha(value) {
    this.positioner.style.opacity = value;
  }

  get parent() {
    let positioner = this.positioner;
    while(positioner = positioner.parentNode, positioner){
      if(positioner.lomo_wrapper)
        return positioner.lomo_wrapper;
    }
  }
  $internalSetStyle(name, value) {
    let {skipStyles, colorStyles, numericStyles} = DisplayObject.styleRules;
    if (value === undefined || skipStyles[name])
      return;
    if (typeof(value) == 'number') {
      if (colorStyles[name])
        value = DisplayObject.toHexColor(value);
      else if (numericStyles[name])
        value = value.toString();
      else
        value = value.toString() + 'px';
    } else if (name == 'backgroundImage') {
      if (name.indexOf('url') !== 0)
        value = 'url(' + value + ')';
    }
    this.positioner.style[name] = value;
  }
  setStyle(nameOrStyles, value){
    if(typeof nameOrStyles == 'string' && value != null){
      this.$internalSetStyle(nameOrStyles, value);
    }else if(typeof nameOrStyles == 'object'){
      for (let name in nameOrStyles) {
        if(nameOrStyles.hasOwnProperty(name)){
          this.$internalSetStyle(name, nameOrStyles[name]);
        }
      }
    }
  }
  addDOMListener(type,listener,useCapture){
    this.positioner.addEventListener(type,listener,useCapture);
  }
  removeDOMListener(type,listener,useCapture){
    this.positioner.removeEventListener(type,listener,useCapture);
  }
  dispatchDOMEvent(event){
    this.positioner.dispatchEvent(event);
  }
}
module.exports = DisplayObject;
