import DisplayObject from "./DisplayObject";

class Text extends DisplayObject {
  get text() {
    return this.element.innerText;
  }
  set text(value) {
    if(this.element.innerText !== value) {
      this.element.innerText == value;
    }
  }
  get htmlText() {
    return this.element.innerHTML;
  }
  set htmlText(value) {
    if(this.element.innerHTML !== value) {
      this.element.textContent = value;
    }
  }
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(value) {
    if(this._wordWrap !== value){
      this._wordWrap = value;
      this.element.style.whiteSpace = this._wordWrap?'inherit':"nowrap";
    }
  }
  createElement() {
    this.element = document.createElement('span');
    this.wordWrap = false;
  }
}
module.exports = Text;
