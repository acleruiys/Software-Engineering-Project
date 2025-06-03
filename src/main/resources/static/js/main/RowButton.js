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
        ${this.state.buttons.map((label) => `<div class="button" data-action="${label}">${label}</div>`).join('')}
        ${this.state.operations.map(op => `<div class="operation-button" data-operation="${op}">${op}</div>`).join('')}
      </div>
    `;
    }

    // 이벤트 핸들러
    setEvent() {
        // 기능 버튼 클릭 이벤트
        this.$target.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleButtonClick(action);
            });
        });
        
        // 수량 조작 버튼 클릭 이벤트
        this.$target.querySelectorAll('.operation-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const operation = e.target.dataset.operation;
                this.handleOperationClick(operation);
            });
        });
    }
    
    handleButtonClick(action) {
        switch(action) {
            case '지정취소':
                document.dispatchEvent(new CustomEvent('orderAction', { 
                    detail: { action: 'removeSelected' } 
                }));
                break;
            case '전체취소':
                document.dispatchEvent(new CustomEvent('orderAction', { 
                    detail: { action: 'removeAll' } 
                }));
                break;
            case '수량입력':
                const quantity = prompt('수량을 입력하세요:', '1');
                if (quantity !== null && !isNaN(quantity) && quantity > 0) {
                    document.dispatchEvent(new CustomEvent('orderAction', { 
                        detail: { action: 'setQuantity', quantity: parseInt(quantity) } 
                    }));
                }
                break;
        }
    }
    
    handleOperationClick(operation) {
        document.dispatchEvent(new CustomEvent('orderAction', { 
            detail: { action: 'changeQuantity', operation } 
        }));
    }
}
