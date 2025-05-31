import Component from "./Component.js";

export default class OrderList extends Component {
    setup() {
        this.state = {
            orders: []
        };
    }

    template() {
        return `
        <div class="order-list-items">
            ${this.state.orders.map((item, index) => `
                <div class="order-item" data-item-id="${item.id}">
                    <span>${index + 1}</span>
                    <span>${item.name}</span>
                    <span>${item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join("")}
        </div>
    `;
    }

    mounted() {
        this.bindOrderItemEvents();
    }
    
    bindOrderItemEvents() {
        // 주문 아이템 클릭 이벤트 추가
        this.$target.querySelectorAll('.order-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                this.selectOrderItem(itemId);
            });
        });
    }

    selectOrderItem(itemId) {
        // 클릭한 주문 아이템 선택 효과 추가
        this.$target.querySelectorAll('.order-item').forEach(item => {
            if (item.dataset.itemId === itemId) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // 주문 아이템 선택 이벤트 발행
        document.dispatchEvent(new CustomEvent('orderItemSelected', { detail: { itemId } }));
        
        // props로 전달된 콜백이 있으면 호출
        if (this.props.onOrderItemSelect) {
            this.props.onOrderItemSelect({ detail: { itemId } });
        }
    }

    setState(newState) {
        super.setState(newState);
        // 상태가 변경된 후 이벤트 리스너 다시 바인딩
        this.bindOrderItemEvents();
    }
}