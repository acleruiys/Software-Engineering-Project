import Component from './Component.js';
import CategoryPanel from './CategoryPanel.js';
import MenuGrid from './MenuGrid.js';
import OrderList from './OrderList.js';
import Billing from './Billing.js';
import TotalBilling from './TotalBilling.js';

export default class App extends Component {
    setup() {
        this.state = {
            selectedOrderItemId: null,
            orderList: [],
            billing: {
                orderAmount: 0,
                serviceFee: 0,
                discount: 0,
                tip: 0
            }
        };

        this.handleMenuItemSelected  = this.handleMenuItemSelected.bind(this);
        this.handleOrderItemSelected = this.handleOrderItemSelected.bind(this);
        this.handleOrderAction       = this.handleOrderAction.bind(this);
        this.handleBillingAction     = this.handleBillingAction.bind(this);
    }

    template() { return ''; }

    render() {
        if (this.orderListComponent)  this.orderListComponent.setState({ orders: this.state.orderList });
        if (this.billingComponent)    this.billingComponent.setState(this.state.billing);

        if (this.totalBillingComponent) {
            const { orderQuantity } = this.getOrderSummary(this.state.orderList);
            const billingAmount     = this.getPayableAmount(this.state.billing);

            this.totalBillingComponent.setState({
                billingAmount,
                orderQuantity
            });
        }
    }

    mounted() {
        // 카테고리 패널
        if (!this.categoryPanel) {
            this.categoryPanel = new CategoryPanel({
                target: document.querySelector('#categoryPanel'),
                props: {
                    onCategorySelect: category => {
                        // 카테고리 변경 시 메뉴 그리드에 해당 카테고리의 메뉴 데이터 요청
                        if (this.menuGrid) {
                            this.menuGrid.fetchMenuItems(category);
                        }
                    }
                }
            });
        }

        // 메뉴 그리드 - 초기 메뉴 데이터는 서버에서 가져옴
        if (!this.menuGrid) {
            this.menuGrid = new MenuGrid({
                target: document.querySelector('#menuGrid'),
                props: {}
            });
        }

        // 주문 리스트
        if (!this.orderListComponent) {
            this.orderListComponent = new OrderList({
                target: document.querySelector('.order-list'),
                props: { onOrderItemSelect: this.handleOrderItemSelected }
            });
        }

        // 결제 내역(항목별)
        if (!this.billingComponent) {
            this.billingComponent = new Billing({
                target: document.querySelector('#billing'),
                props : { billing: this.state.billing }
            });
        }

        // 결제 합계(금액/수량)
        if (!this.totalBillingComponent) {
            this.totalBillingComponent = new TotalBilling({
                target: document.querySelector('#totalBilling'),
                props : { billingAmount: 0, orderQuantity: 0 }
            });
        }

        // 글로벌 이벤트
        document.removeEventListener('menuItemSelected',  this.handleMenuItemSelected);
        document.addEventListener   ('menuItemSelected',  this.handleMenuItemSelected);

        document.removeEventListener('orderItemSelected', this.handleOrderItemSelected);
        document.addEventListener   ('orderItemSelected', this.handleOrderItemSelected);

        document.removeEventListener('orderAction',       this.handleOrderAction);
        document.addEventListener   ('orderAction',       this.handleOrderAction);

        document.removeEventListener('billingAction',     this.handleBillingAction);
        document.addEventListener   ('billingAction',     this.handleBillingAction);
    }

    // 주문 리스트 → { orderAmount, orderQuantity } 반환
    getOrderSummary(orderList) {
        return orderList.reduce(
            (acc, item) => {
                acc.orderAmount  += item.totalPrice;
                acc.orderQuantity += item.quantity;
                return acc;
            },
            { orderAmount: 0, orderQuantity: 0 }
        );
    }

    // 결제 세부 항목 → 실제 청구 금액 반환
    getPayableAmount({ orderAmount, serviceFee, discount, tip }) {
        return orderAmount + serviceFee + tip - discount;
    }

    // 메뉴 선택 → 주문 추가
    handleMenuItemSelected(e) {
        const selected = e.detail;                 // { id, name, price }
        const existed  = this.state.orderList.find(i => i.id === selected.id);

        const newOrderList = existed
            ? this.state.orderList.map(i =>
                i.id === selected.id
                    ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.price }
                    : i
            )
            : [
                ...this.state.orderList,
                { id: selected.id, name: selected.name, price: selected.price,
                    quantity: 1, totalPrice: selected.price }
            ];

        const { orderAmount } = this.getOrderSummary(newOrderList);

        this.setState({
            orderList: newOrderList,
            billing  : { ...this.state.billing, orderAmount }
        });
    }

    // 주문 항목 선택
    handleOrderItemSelected(e) {
        this.setState({ selectedOrderItemId: e.detail.itemId });
    }

    // 주문 리스트 액션
    handleOrderAction(e) {
        const { action, quantity, operation } = e.detail;
        let newOrderList = [...this.state.orderList];

        switch (action) {
            case 'removeSelected':
                if (this.state.selectedOrderItemId)
                    newOrderList = newOrderList.filter(i => i.id !== this.state.selectedOrderItemId);
                break;

            case 'removeAll':
                newOrderList = [];
                break;

            case 'setQuantity':
                if (this.state.selectedOrderItemId && quantity > 0)
                    newOrderList = newOrderList.map(i =>
                        i.id === this.state.selectedOrderItemId
                            ? { ...i, quantity, totalPrice: quantity * i.price }
                            : i
                    );
                break;

            case 'changeQuantity':
                if (this.state.selectedOrderItemId)
                    newOrderList = newOrderList.map(i => {
                        if (i.id !== this.state.selectedOrderItemId) return i;
                        const nextQ = operation === '+' ? i.quantity + 1
                            : Math.max(1, i.quantity - 1);
                        return { ...i, quantity: nextQ, totalPrice: nextQ * i.price };
                    });
                break;
        }

        const { orderAmount } = this.getOrderSummary(newOrderList);

        this.setState({
            orderList: newOrderList,
            selectedOrderItemId: (action === 'removeSelected' || action === 'removeAll')
                ? null
                : this.state.selectedOrderItemId,
            billing: { ...this.state.billing, orderAmount }
        });
    }

    // Billing(할인·팁 등) 액션
    handleBillingAction(e) {
        const { key, value } = e.detail;           // { key: 'discount', value: 1500 }
        if (!['serviceFee', 'discount', 'tip'].includes(key)) return;

        this.setState({
            billing: { ...this.state.billing, [key]: value }
        });
    }
}
