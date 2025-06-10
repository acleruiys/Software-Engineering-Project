export default class Component {
  constructor({ target, props = {} }) {
    this.$target = target;
    this.props = props;
    this.state = {};
    this.events = {};

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
    this.render();
  }

  setEvent() {}
  mounted() {}

  setProps(newProps) {
    this.props = {
      ...this.props,
      ...newProps
    };
    this.render();   // 변경된 props 기반으로 다시 렌더링
  }

  // 이벤트 구독
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  
  // 이벤트 발행
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
  
  // 이벤트 제거
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }
  
  // 이벤트 리스너 추가 헬퍼 메서드
  addEvent(eventType, selector, callback) {
    const children = [...this.$target.querySelectorAll(selector)];
    
    const isTarget = target => 
      children.includes(target) || target.closest(selector);
    
    this.$target.addEventListener(eventType, event => {
      if (!isTarget(event.target)) return false;
      callback(event);
    });
  }
}
