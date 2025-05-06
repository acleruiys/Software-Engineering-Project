import Component from "./Component.js";

export default class MenuGrid extends Component {
    setup() {
        this.state = {
            menuItems: this.props.menuItems || []  // 초기 menuItems 상태 설정
        };
    }

    setMenuItems(newItems) {
        console.log(1);
        console.log(newItems);
        this.setState({ menuItems: newItems }); // 상태 변경
    }

    template() {
        const totalItems = 7 * 9;
        const items = Array.from({ length: totalItems }, (_, i) => {
            return this.state.menuItems[i] || "";
        });

        return `
      <div class="menuEntity-grid">
        ${items.map(item => `<div class="menuEntity-item">${item}</div>`).join("")}
      </div>
    `;
    }

    setState(newState) {
        super.setState(newState);
        this.render();
    }
}
