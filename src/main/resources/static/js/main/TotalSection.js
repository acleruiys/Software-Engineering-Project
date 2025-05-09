// TotalSection.js
import Component from "./Component.js";

export default class TotalSection extends Component {
    setup() {
        this.state = {
            buttons: ['바코드', '상품검색', '주문상세', '위', '위']
        };
    }

    template() {
        return `
      <div class="total-section">
        <div class="total-item">
          ${this.state.buttons.map(button => this.createButtonTemplate(button)).join('')}
        </div>
      </div>
    `;
    }

    createButtonTemplate(label) {
        return `<div class="button">${label}</div>`;
    }

    setEvent() {
        // 각 버튼에 이벤트 리스너를 추가하고 싶은 경우 여기에 작성
        const buttons = this.$target.querySelectorAll('.button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                alert(`${button.textContent} 버튼 클릭됨`);
            });
        });
    }
}
