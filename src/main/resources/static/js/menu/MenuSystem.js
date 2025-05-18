import Component from "../main/Component.js";

export default class MenuSystem extends Component {
    setup() {
        this.state = {
            menuList: [
                { id: 1, name: '아메리카노', category: '커피', price: 3000, status: '판매중' },
                { id: 2, name: '라떼', category: '커피', price: 3500, status: '판매중' }
            ],
            isAdding: false,
            categoryOptions: ['커피', '디카페인', '논커피/과일라떼', '티', '스무디/프라페', '에이드/주스', '시즌메뉴', '빵'],
            selectedMenuId: null,
            isEditing: false,
            editingMenuId: null,
        };
    }

    template() {
        const { menuList, isAdding } = this.state;
        const categoryOptions = this.state.categoryOptions;
        const categorySelectOptions = ['<option value="">카테고리 선택</option>', ...categoryOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const menuRows = menuList.map(menu => `
        <tr data-id="${menu.id}">
            <td>${menu.name}</td>
            <td>${menu.category}</td>
            <td>${menu.price}원</td>
            <td>${menu.status}</td>
        </tr>
    `).join('');

        const inputRow = isAdding ? `
            <tr class="input-row">
                <td><input type="text" placeholder="메뉴명" class="input-name" /></td>
                <td>
                    <select class="input-category">
                        ${categorySelectOptions}
                    </select>
                </td>
                <td><input type="number" placeholder="가격" class="input-price" /></td>
                <td>
                    <select class="input-status">
                        <option value="판매중">판매중</option>
                        <option value="품절">품절</option>
                    </select>
                </td>
            </tr>
        ` : '';

        return `
        <div class="modal-container">
            <div class="modal-header">
                <h2>메뉴 관리</h2>
                <button class="close-btn">x</button>
            </div>
            <div class="modal-actions">
                <button class="add-btn">${isAdding ? "등록 완료" : "메뉴 등록"}</button>
                <button class="edit-btn">메뉴 수정</button>
                <button class="delete-btn">메뉴 삭제</button>
            </div>
            <div class="modal-body">
                <div class="table-wrapper">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th>메뉴명</th>
                                <th>카테고리명</th>
                                <th>가격</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${menuRows}
                            ${inputRow}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    }

    mounted() {}

    setEvent() {
        const closeBtn = this.$target.querySelector('.close-btn');
        const addBtn = this.$target.querySelector('.add-btn');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const { isAdding } = this.state;

                if (!isAdding) {
                    this.state.isAdding = true;
                    addBtn.textContent = "등록 완료";

                    this.renderInputRow();
                } else {
                    const name = this.$target.querySelector('.input-name').value;
                    const category = this.$target.querySelector('.input-category').value;
                    const price = Number(this.$target.querySelector('.input-price').value);
                    const status = this.$target.querySelector('.input-status').value;

                    if (!name || !category || !price || !status) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    const newMenu = { name, category, price, status };
                    this.state.menuList.push(newMenu);
                    this.state.isAdding = false;

                    addBtn.textContent = "메뉴 등록";

                    this.renderMenuTable();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSalesUI();
            });
        }

        const deleteBtn = this.$target.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const { selectedMenuId, menuList } = this.state;

                if (selectedMenuId === null) {
                    alert("삭제할 메뉴를 먼저 선택하세요.");
                    return;
                }

                this.state.menuList = menuList.filter(menu => menu.id !== selectedMenuId);
                this.state.selectedMenuId = null;

                this.renderMenuTable();
            });
        }

        const editBtn = this.$target.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const { isEditing, selectedMenuId, menuList } = this.state;

                if (!isEditing) {
                    if (selectedMenuId === null) {
                        alert("수정할 메뉴를 먼저 선택하세요.");
                        return;
                    }

                    this.state.isEditing = true;
                    this.state.editingMenuId = selectedMenuId;

                    editBtn.textContent = "수정 완료";
                    this.renderEditRow();
                } else {
                    const id = this.state.editingMenuId;
                    const name = this.$target.querySelector('.input-name').value;
                    const category = this.$target.querySelector('.input-category').value;
                    const price = Number(this.$target.querySelector('.input-price').value);
                    const status = this.$target.querySelector('.input-status').value;

                    if (!name || !category || !price || !status) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    this.state.menuList = menuList.map(menu =>
                        menu.id === id ? { id, name, category, price, status } : menu
                    );

                    this.state.isEditing = false;
                    this.state.editingMenuId = null;
                    editBtn.textContent = "메뉴 수정";
                    this.renderMenuTable();
                }
            });
        }

        document.addEventListener('click', (e) => {
            const isClickInside = this.$target.contains(this.target);
            const modalContainer = this.$target.querySelector('.modal-container');
            const isModalVisible = modalContainer.style.display === 'block';

            if (!isClickInside && isModalVisible) {
                this.hideSalesUI();
            }
        });

        this.$target.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row || row.classList.contains('input-row')) return;

            const selectedId = Number(row.dataset.id);
            this.state.selectedMenuId = selectedId;

            const rows = this.$target.querySelectorAll('.modal-table tbody tr');
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        });
    }

    renderMenuTable() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const menuRows = this.state.menuList.map(menu => `
        <tr data-id="${menu.id}">
            <td>${menu.name}</td>
            <td>${menu.category}</td>
            <td>${menu.price}원</td>
            <td>${menu.status}</td>
        </tr>
    `).join('');
        tbody.innerHTML = menuRows;
    }

    renderInputRow() {
        const { isAdding, categoryOptions } = this.state;

        const categorySelectOptions = ['<option value="">카테고리 선택</option>', ...categoryOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const inputRow = isAdding ? `
        <tr class="input-row">
            <td><input type="text" placeholder="메뉴명" class="input-name" /></td>
            <td>
                <select class="input-category">
                    ${categorySelectOptions}
                </select>
            </td>
            <td><input type="number" placeholder="가격" class="input-price" /></td>
            <td>
                <select class="input-status">
                    <option value="판매중">판매중</option>
                    <option value="품절">품절</option>
                </select>
            </td>
        </tr>
    ` : '';

        const tbody = this.$target.querySelector('.modal-table tbody');
        if (tbody) {
            const oldRow = tbody.querySelector('.input-row');
            if (oldRow) oldRow.remove();

            tbody.insertAdjacentHTML('beforeend', inputRow);
        }
    }

    renderEditRow() {
        const { editingMenuId, menuList, categoryOptions } = this.state;
        const targetMenu = menuList.find(menu => menu.id === editingMenuId);
        if (!targetMenu) return;

        const categorySelectOptions = ['<option value="">카테고리 선택</option>', ...categoryOptions.map(
            opt => `<option value="${opt}" ${opt === targetMenu.category ? "selected" : ""}>${opt}</option>`
        )].join('');

        const editRowHtml = `
        <tr class="input-row">
            <td><input type="text" class="input-name" value="${targetMenu.name}" /></td>
            <td>
                <select class="input-category">${categorySelectOptions}</select>
            </td>
            <td><input type="number" class="input-price" value="${targetMenu.price}" /></td>
            <td>
                <select class="input-status">
                    <option value="판매중" ${targetMenu.status === "판매중" ? "selected" : ""}>판매중</option>
                    <option value="품절" ${targetMenu.status === "품절" ? "selected" : ""}>품절</option>
                </select>
            </td>
        </tr>
    `;

        const tbody = this.$target.querySelector('.modal-table tbody');
        if (tbody) {
            tbody.innerHTML = this.state.menuList.map(menu => {
                if (menu.id === editingMenuId) {
                    return editRowHtml;
                } else {
                    return `
                    <tr data-id="${menu.id}">
                        <td>${menu.name}</td>
                        <td>${menu.category}</td>
                        <td>${menu.price}원</td>
                        <td>${menu.status}</td>
                    </tr>
                `;
                }
            }).join('');
        }
    }

    hideSalesUI() {
        document.querySelector('.overlay').style.display = 'none';
        this.$target.style.display = 'none';
    }
}