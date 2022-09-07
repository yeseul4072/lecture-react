import { on, qs } from "../helpers.js";
import View from "./View.js";

const tag = "[SearchFormView]";

export default class SearchFormView extends View {
  constructor() {
    console.log(tag, "constructor");

    super(qs("#search-form-view"));

    this.inputElement = qs("[type=text]", this.element);
    this.resetElement = qs("[type=reset]", this.element);

    this.showResetButton(false);
    this.bindEvents();
  }

  showResetButton(visible = true) {
    this.resetElement.style.display = visible ? "block" : "none";
  }

  bindEvents() {
    on(this.inputElement, "keyup", () => this.handleKeyup());
    on(this.element, "submit", event => this.handleSubmit(event));
    on(this.resetElement, "click", () => this.handleReset());
  }

  handleKeyup() {
    const { value } = this.inputElement;
    this.showResetButton(value.length > 0);

    // 검색어 삭제
    if(value.length == 0) {
      this.handleReset();
    }
  }

  handleSubmit(event) {
    // submit하면 페이지 리로딩되는 것 막아줌
    event.preventDefault();
    console.log(tag, "handleSubmit");
    const {value} = this.inputElement;
    this.emit("@submit", {value}); // View.js에 emit() 호출 
  }

  handleReset() {
    console.log(tag, "handleReset");
    this.showResetButton(false);
    this.emit("@reset");
  }

  show(value = "") {
    console.log(tag, "show", value);

    this.inputElement.value = value;
    this.showResetButton(this.inputElement.value.length > 0);

    super.show();
  }
  
}
