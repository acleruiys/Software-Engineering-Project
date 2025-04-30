import Component from "./Component.js";

export default class MenuGrid extends Component {
    setup() {
        this.state = {
            menuItems: [
                "아이스 아메리카노(I)",
                "카페라떼(I)",
                "바닐라라떼(I)"
                // 나머지는 자동으로 빈 칸
            ]
        };
    }

    template() {
        const totalItems = 7 * 8; // 49개
        const items = Array.from({ length: totalItems }, (_, i) => {
            return this.state.menuItems[i] || ""; // 메뉴 이름 없으면 빈 문자열
        });

        return `
      <div class="menuEntity-grid">
        ${items.map(item => `<div class="menuEntity-item">${item}</div>`).join("")}
      </div>
    `;
    }
}
