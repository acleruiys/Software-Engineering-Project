export default class Component {
  constructor({ target, props = {} }) {
    this.$target = target;
    this.props = props;
    this.state = {};

    this.setup();
    this.render();
    this.mounted();
    this.setEvent();
  }

  setup() {}
  template() { return ""; }

  render() {
    this.$target.innerHTML = this.template();
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState
    };
    this.render(); // 상태 변경 후 다시 렌더링
  }

  setEvent() {}
  mounted() {}
}
