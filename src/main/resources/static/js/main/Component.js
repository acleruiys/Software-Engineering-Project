export default class Component {
  constructor({ target, props = {} }) {
    this.$target = target;
    this.props = props;

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

  setEvent() {}
  mounted() {}
}
