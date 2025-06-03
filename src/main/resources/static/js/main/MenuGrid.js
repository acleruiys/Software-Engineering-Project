import Component from "./Component.js";

export default class MenuGrid extends Component {
    setup() {
        this.state = {
            menuItems: this.props.menuItems || [],
            isLoading: false,
            currentCategory: null
        };
        
        // 초기 메뉴 데이터가 없다면 서버에서 기본 카테고리(COFFEE)의 메뉴 데이터 가져오기
        if (!this.props.menuItems || this.props.menuItems.length === 0) {
            this.fetchMenuItems('COFFEE');
        }
    }

    // 외부에서 호출 가능한 public 메소드로 변경
    async fetchMenuItems(category) {
        if (this.state.isLoading) return;
        
        // 현재 카테고리 저장
        this.setState({ 
            isLoading: true,
            currentCategory: category
        });
        
        try {
            const url = category ? `/api/menus?category=${category}` : '/api/menus';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('메뉴를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            this.setState({ 
                menuItems: data,
                isLoading: false
            });
        } catch (error) {
            console.error('메뉴 데이터 불러오기 오류:', error);
            // 서버 API가 없는 경우를 대비해 정적 데이터 로드
            import('../data/MenuData.js').then(module => {
                const items = category ? module.menuItems[category] : module.menuItems.COFFEE;
                this.setState({ 
                    menuItems: items || [],
                    isLoading: false
                });
            });
        }
    }

    setMenuItems(newItems) {
        if (JSON.stringify(newItems) !== JSON.stringify(this.state.menuItems)) {
            this.setState({ menuItems: newItems });
        }
    }

    template() {
        const totalItems = 7 * 9;
        const items = Array.from({ length: totalItems }, (_, i) => this.state.menuItems[i] || null);

        return `
            <div class="menuEntity-grid ${this.state.isLoading ? 'loading' : ''}">
                ${this.state.isLoading ? 
                    '<div class="loading-indicator">로딩 중...</div>' : 
                    items.map((item, index) => `
                        <div class="menuEntity-item" data-index="${index}">
                            ${item ? `
                                <div class="menuEntity-item-inner">
                                    <div class="menuEntity-item-name">${item.name}</div>
                                    <div class="menuEntity-item-price">${item.price.toLocaleString()}원</div>
                                </div>
                            ` : ""}
                        </div>
                    `).join("")
                }
            </div>
        `;
    }

    mounted() {
        if (this.$target) {
            this.addEventListeners();
            this.addItemStyles();
        } else {
            console.error("MenuGrid: this.$target is not defined!");
        }
    }

    addItemStyles() {
        // 메뉴 아이템 내부 스타일 추가
        const items = this.$target.querySelectorAll('.menuEntity-item');
        items.forEach(item => {
            const inner = item.querySelector('.menuEntity-item-inner');
            if (inner) {
                inner.style.width = '100%';
                inner.style.height = '100%';
                inner.style.display = 'flex';
                inner.style.flexDirection = 'column';
                inner.style.justifyContent = 'center';
                inner.style.alignItems = 'center';
            }

            const name = item.querySelector('.menuEntity-item-name');
            if (name) {
                name.style.fontWeight = 'bold';
                name.style.marginBottom = '5px';
            }

            const price = item.querySelector('.menuEntity-item-price');
            if (price) {
                price.style.color = '#d35400';
            }
        });
        
        // 로딩 표시기 스타일 추가
        const loadingIndicator = this.$target.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.position = 'absolute';
            loadingIndicator.style.top = '50%';
            loadingIndicator.style.left = '50%';
            loadingIndicator.style.transform = 'translate(-50%, -50%)';
            loadingIndicator.style.padding = '10px 20px';
            loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
            loadingIndicator.style.color = 'white';
            loadingIndicator.style.borderRadius = '5px';
            loadingIndicator.style.zIndex = '100';
        }
    }

    addEventListeners() {
        const grid = this.$target.querySelector('.menuEntity-grid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            if (this.state.isLoading) return;
            
            const itemDiv = e.target.closest('.menuEntity-item');
            if (!itemDiv) return;

            const index = itemDiv.dataset.index;
            const item = this.state.menuItems[index];
            if (item) {
                document.dispatchEvent(new CustomEvent('menuItemSelected', { detail: item }));
            }
        });
    }

    setState(newState) {
        super.setState(newState);
        this.render();
        this.mounted();
    }
}
