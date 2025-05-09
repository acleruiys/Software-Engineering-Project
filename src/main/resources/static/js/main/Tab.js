import Component from "./Component.js";

export default class MenuEntityTabs extends Component {
    setup() {
        this.state = {
            tabs: ['번호', '메뉴', '수량', '가격']
        };
    }

    template() {
        return `
      <div class="menuEntity-tabs">
        ${this.state.tabs.map(tab => this.createTabTemplate(tab)).join('')}
      </div>
    `;
    }

    createTabTemplate(label) {
        return `<div class="tab">${label}</div>`;
    }
}