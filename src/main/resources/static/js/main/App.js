import Component from './Component.js';
import CategoryPanel from './CategoryPanel.js';
import MenuGrid from './MenuGrid.js';
import OrderList from './OrderList.js';
import ApiService from '../services/ApiService.js';
import Billing from "./Billing.js";
import TotalBilling from "./TotalBilling.js";
import FooterPanel from './FooterPanel.js';

export default class App extends Component {
    setup() {
        this.menuItemsByCategory = {};

        this.state = {
            menuItems: [],
            selectedOrderItemId: null,
            orderList: []
        };

        this.menuGrid = null;
        this.categoryPanel = null;
        this.orderListComponent = null;

        this.handleMenuItemSelected = this.handleMenuItemSelected.bind(this);
        this.handleOrderItemSelected = this.handleOrderItemSelected.bind(this);
        this.handleOrderAction = this.handleOrderAction.bind(this);

        this.loadInitialData();
    }

    async loadInitialData() {
        try {
            // 전체 메뉴 로드
            const allMenus = await ApiService.getAllMenus();

            // 카테고리별로 메뉴 그룹화
            this.menuItemsByCategory = this.groupMenusByCategory(allMenus);

            // 첫 번째 카테고리의 메뉴를 기본으로 설정 (커피)
            const coffeeMenus = this.menuItemsByCategory['COFFEE'] || [];
            this.setState({ menuItems: coffeeMenus });
        } catch (error) {
            console.error('초기 데이터 로딩 실패:', error);
            this.setState({ menuItems: [] });
        }
    }

    groupMenusByCategory(menus) {
        const grouped = {};
        menus.forEach(menu => {
            // 백엔드에서 받은 카테고리 이름을 enum 값으로 변환
            const categoryKey = this.getCategoryKeyFromName(menu.category);
            if (!grouped[categoryKey]) {
                grouped[categoryKey] = [];
            }
            grouped[categoryKey].push({
                id: menu.id,
                name: menu.name,
                price: menu.price
            });
        });
        return grouped;
    }

    getCategoryKeyFromName(categoryName) {
        const categoryMap = {
            '커피': 'COFFEE',
            '디카페인': 'DECAF',
            '논커피/과일라떼': 'NON_COFFEE',
            '티': 'TEA',
            '스무디/프라페': 'SMOOTHIE',
            '에이드/주스': 'ADE',
            '시즌메뉴': 'SEASON',
            '빵': 'BREAD',
            '디저트': 'DESSERT',
            '샌드위치': 'SANDWICH',
            'MD상품': 'MD',
            '세트메뉴': 'SET',
            '케이크': 'CAKE',
            '기타': 'ETC'
        };
        return categoryMap[categoryName] || 'ETC';
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

        window.__orderList__ = this.state.orderList;
    }

    mounted() {
        if (!this.categoryPanel) {
            this.categoryPanel = new CategoryPanel({
                target: document.querySelector('#categoryPanel'),
                props: {
                    onCategorySelect: async (category) => {
                        try {
                            const items = await ApiService.getMenusByCategory(category);
                            console.log(items);
                            const formattedItems = items.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: item.price
                            }));
                            this.setState({ menuItems: formattedItems });
                        } catch (error) {
                            console.error('카테고리별 메뉴 로딩 실패:', error);
                            this.setState({ menuItems: [] });
                        }
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

        this.totalBillingComponent = new TotalBilling({
            target: document.querySelector('#totalBilling')
        });

        this.billingComponent = new Billing({
            target: document.querySelector('#billing'),
            props: {
                totalBillingComponent: this.totalBillingComponent
            }
        });
        window.__billingComponent__ = this.billingComponent;

        this.orderListComponent = new OrderList({
            target: document.querySelector('.order-list'),
            props: {
                billingComponent: this.billingComponent,
                onOrderItemSelect: this.handleOrderItemSelected
            }
        });

        if (!this.footerPanelComponent) {
            this.footerPanelComponent = new FooterPanel({
                target: document.querySelector('#footerPanel')
            });
            window.__footerPanelComponent__ = this.footerPanelComponent;
        }
        window.__app__ = this;

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

        window.__orderList__ = newOrderList;
        this.billingComponent.updateOrderAmount(newOrderList.reduce((sum, item) => sum + item.totalPrice, 0));
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

        window.__orderList__ = newOrderList;
        this.billingComponent.updateOrderAmount(newOrderList.reduce((sum, item) => sum + item.totalPrice, 0));
    }
}
