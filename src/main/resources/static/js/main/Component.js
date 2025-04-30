export default class Component {
  constructor($target) {
    this.$target = $target;
    this.setup();
    this.render();     // template() 실행 및 DOM 삽입
    this.setEvent();   // 이벤트 연결
    this.mounted();
  }

  setup() {}
  template() { return ""; }

  render() {
    this.$target.innerHTML = this.template();
  }

  setEvent() {}
  mounted() {}
}
