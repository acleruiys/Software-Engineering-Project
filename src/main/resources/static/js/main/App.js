import Component from './Component.js';
import CategoryPanel from './CategoryPanel.js';
import MenuGrid from './MenuGrid.js';

export default class App extends Component {
    setup() {
        this.menuItemsByCategory = {
            COFFEE: ["아메리카노", "카페라떼", "카푸치노"],
            DECAF: ["디카페인 아메리카노"],
            NON_COFFEE: ["딸기라떼", "바나나라떼"],
            TEA: ["녹차", "홍차"],
            SMOOTHIE: ["망고스무디"],
            ADE: ["레몬에이드"],
            SEASON: ["겨울한정 핫초코"],
            BREAD: ["크루아상", "식빵"]
        };

        // 초기 메뉴 상태
        this.state = {
            menuItems: this.menuItemsByCategory.COFFEE,
        };
    }

    template() {
        return ''; // 렌더링하지 않음
    }

    render() {
        this.mounted();
    }

    mounted() {
        // CategoryPanel 생성
        new CategoryPanel({
            target: document.querySelector('#categoryPanel'),
            props: {
                onCategorySelect: (category) => {
                    const items = this.menuItemsByCategory[category] || [];
                    console.log(items);
                    this.setState({ menuItems: items });  // 상태만 변경 (MenuGrid 업데이트)
                }
            }
        });

        // MenuGrid 생성
        new MenuGrid({
            target: document.querySelector('#menuGrid'),
            props: {
                menuItems: this.state.menuItems  // 초기 메뉴 데이터 전달
            }
        });
    }
}
