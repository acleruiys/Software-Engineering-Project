import Component from './Component.js';
import CategoryPanel from './CategoryPanel.js';
import MenuGrid from './MenuGrid.js';
import OrderList from './OrderList.js';
import { menuItems } from '../data/MenuData.js';

export default class App extends Component {
    setup() {
        this.menuItemsByCategory = menuItems;

        this.state = {
            menuItems: this.menuItemsByCategory.COFFEE,
            selectedOrderItemId: null,
            orderList: []
        };

        this.menuGrid = null;
        this.categoryPanel = null;
        this.orderListComponent = null;

        this.handleMenuItemSelected = this.handleMenuItemSelected.bind(this);
        this.handleOrderItemSelected = this.handleOrderItemSelected.bind(this);
        this.handleOrderAction = this.handleOrderAction.bind(this);
    }

    template() {
        return '';
    }

    render() {
        if (this.menuGrid) {
            this.menuGrid.setMenuItems(this.state.menuItems);
        }
        
        if (this.orderListComponent) {
            this.orderListComponent.setState({ orders: this.state.orderList });
        }
    }

    mounted() {
        if (!this.categoryPanel) {
            this.categoryPanel = new CategoryPanel({
                target: document.querySelector('#categoryPanel'),
                props: {
                    onCategorySelect: (category) => {
                        const items = this.menuItemsByCategory[category] || [];
                        this.setState({ menuItems: items });
                    }
                }
            });
        }

        if (!this.menuGrid) {
            this.menuGrid = new MenuGrid({
                target: document.querySelector('#menuGrid'),
                props: {
                    menuItems: this.state.menuItems
                }
            });
        }
        
        if (!this.orderListComponent) {
            this.orderListComponent = new OrderList({
                target: document.querySelector('.order-list'),
                props: {
                    onOrderItemSelect: this.handleOrderItemSelected
                }
            });
        }

        document.removeEventListener('menuItemSelected', this.handleMenuItemSelected);
        document.addEventListener('menuItemSelected', this.handleMenuItemSelected);
        
        document.removeEventListener('orderItemSelected', this.handleOrderItemSelected);
        document.addEventListener('orderItemSelected', this.handleOrderItemSelected);
        
        document.removeEventListener('orderAction', this.handleOrderAction);
        document.addEventListener('orderAction', this.handleOrderAction);
    }

    handleMenuItemSelected(e) {
        const selected = e.detail;
        const existing = this.state.orderList.find(item => item.id === selected.id);

        let newOrderList;
        if (existing) {
            newOrderList = this.state.orderList.map(item => 
                item.id === selected.id 
                    ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
                    : item
            );
        } else {
            newOrderList = [
                ...this.state.orderList,
                {
                    id: selected.id,
                    name: selected.name,
                    quantity: 1,
                    price: selected.price,
                    totalPrice: selected.price
                }
            ];
        }

        this.setState({ orderList: newOrderList });
    }
    
    handleOrderItemSelected(e) {
        const { itemId } = e.detail;
        this.setState({ selectedOrderItemId: itemId });
    }
    
    handleOrderAction(e) {
        const { action, quantity, operation } = e.detail;
        let newOrderList = [...this.state.orderList];
        
        switch(action) {
            case 'removeSelected':
                if (this.state.selectedOrderItemId) {
                    newOrderList = newOrderList.filter(item => item.id !== this.state.selectedOrderItemId);
                    this.setState({ 
                        orderList: newOrderList,
                        selectedOrderItemId: null 
                    });
                }
                break;
                
            case 'removeAll':
                this.setState({ 
                    orderList: [],
                    selectedOrderItemId: null 
                });
                break;
                
            case 'setQuantity':
                if (this.state.selectedOrderItemId) {
                    newOrderList = newOrderList.map(item => {
                        if (item.id === this.state.selectedOrderItemId) {
                            return {
                                ...item,
                                quantity: quantity,
                                totalPrice: quantity * item.price
                            };
                        }
                        return item;
                    });
                    this.setState({ orderList: newOrderList });
                }
                break;
                
            case 'changeQuantity':
                if (this.state.selectedOrderItemId) {
                    newOrderList = newOrderList.map(item => {
                        if (item.id === this.state.selectedOrderItemId) {
                            let newQuantity = item.quantity;
                            if (operation === '+') {
                                newQuantity += 1;
                            } else if (operation === '-' && item.quantity > 1) {
                                newQuantity -= 1;
                            }
                            return {
                                ...item,
                                quantity: newQuantity,
                                totalPrice: newQuantity * item.price
                            };
                        }
                        return item;
                    });
                    this.setState({ orderList: newOrderList });
                }
                break;
        }
    }
}
