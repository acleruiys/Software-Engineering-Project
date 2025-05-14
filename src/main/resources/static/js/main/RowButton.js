import Component from "./Component.js";

export default class RowButton extends Component {
    setup() {
        this.state = {
            buttons: ["지정취소", "전체취소", "수량입력"],
            operations: ["+", "-"]
        };
    }

    template() {
        return `
      <div class="button-row">
        ${this.state.buttons.map((cnt) => `<div class="button">${cnt}</div>`).join('')}
        ${this.state.operations.map(op => `<div class="operation-button">${op}</div>`).join('')}
      </div>
    `;
    }

    // 이벤트 핸들러
    setEvent() {
    }
}
