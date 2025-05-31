import Component from "../main/Component.js";

export default class InventorySystem extends Component {
    setup() {
        this.state = {
            inventoryList: [
                {id: 1, name: '원두', category: '원두', supplyName: 'dd', price: 1000, quantity: 100},
            ],
            isAdding: false,
            inventoryOptions: ['원두', '시럽'],
            selectInventoryId: null,
            isEditing: false,
            editInventory: null,
        };
    }

    template() {
        const { inventoryList, isAdding } = this.state;
        const inventoryOptions = this.state.inventoryOptions;
        const inventorySelectOptions = ['<option value="">카테고리 선택</option>', ...inventoryOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const inventoryRows = inventoryList.map(inventory => `
        <tr data-id="${inventory.id}">
            <td>${inventory.name}</td>
            <td>${inventory.supplyName}</td>
            <td>${inventory.price}원</td>
            <td>${inventory.quantity}</td>
        </tr>
    `).join('');

        const inputRow = isAdding ? `
            <tr class="input-row">
                <td><input type="text" placeholder="이름" class="input-name" /></td>
                <td>
                    <select class="input-supplyName">
                        ${inventorySelectOptions}
                    </select>
                </td>
               <td><input type="text" placeholder="가격" class="input-price" /></td>
               <td><input type="number" placeholder="수량" class="input-quantity" /></td>
            </tr>
        ` : '';

        return `
        <div class="modal-container">
            <div class="modal-header">
                <h2>재고 관리</h2>
                <button class="close-btn">x</button>
            </div>
            <div class="modal-actions">
                <button class="add-btn">${isAdding ? "등록 완료" : "재고 등록"}</button>
                <button class="edit-btn">재고 수정</button>
                <button class="delete-btn">재고 삭제</button>
            </div>
            <div class="modal-body">
                <div class="table-wrapper">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th>재고명</th>
                                <th>납품업체</th>
                                <th>가격</th>
                                <th>수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventoryRows}
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
                    const supplyName = this.$target.querySelector('.input-supplyName').value;
                    const price = this.$target.querySelector('.input-price').value;
                    const quantity = Number(this.$target.querySelector('.input-quantity').value);

                    if (!name || !supplyName || !price ||!quantity) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    const newInventory = { name, supplyName, price, quantity};
                    this.state.inventoryList.push(newInventory);
                    this.state.isAdding = false;

                    addBtn.textContent = "재고 등록";

                    this.renderInventoryTable();
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
                const { selectInventoryId, inventoryList } = this.state;

                if (selectInventoryId === null) {
                    alert("삭제할 재고를 먼저 선택하세요.");
                    return;
                }

                this.state.inventoryList = inventoryList.filter(inventory => inventory.id !== selectInventoryId);
                this.state.selectInventoryId = null;

                this.renderInventoryTable();
            });
        }

        const editBtn = this.$target.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const {isEditing, selectInventoryId, inventoryList} = this.state;

                if (!isEditing) {
                    if (selectInventoryId === null) {
                        alert("수정할 재고을 먼저 선택하세요.");
                        return;
                    }

                    this.state.isEditing = true;
                    this.state.editingInventoryId = selectInventoryId;

                    editBtn.textContent = "수정 완료";
                    this.renderEditRow();
                } else {
                    const id = this.state.editingInventoryId;
                    const name = this.$target.querySelector('.input-name').value;
                    const supplyName = this.$target.querySelector('.input-supplyName').value;
                    const price = this.$target.querySelector('.input-price').value;
                    const quantity = Number(this.$target.querySelector('.input-quantity').value);

                    if (!name || !supplyName || !price ||!quantity) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    this.state.inventoryList = inventoryList.map(inventory =>
                        inventory.id === id ? {id, name, supplyName, price, quantity} : inventory
                    );

                    this.state.isEditing = false;
                    this.state.editingInventoryId = null;
                    editBtn.textContent = "재고 수정";
                    this.renderInventoryTable();
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

            const idCell = row.querySelector('td');
            if (!idCell) return;

            const selectedId = Number(row.dataset.id);

            this.state.selectInventoryId = selectedId;

            const rows = this.$target.querySelectorAll('.modal-table tbody tr');
            rows.forEach(r => r.classList.remove('selected')); // 기존 선택 해제

            row.classList.add('selected'); // 클릭된 행에 적용
        });
    }

    renderInventoryTable() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const inventoryRows = this.state.inventoryList.map(inventory => `
        <tr data-id="${inventory.id}">
            <td>${inventory.name}</td>
            <td>${inventory.supplyName}</td>
            <td>${inventory.price}원</td>
            <td>${inventory.quantity}</td>
        </tr>
    `).join('');

        tbody.innerHTML = inventoryRows;
    }

    renderInputRow() {
        const { isAdding, inventoryOptions } = this.state;

        const inventorySelectOptions = ['<option value="">카테고리 선택</option>', ...inventoryOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const inputRow = isAdding ? `
        <tr class="input-row">
            <td><input type="text" placeholder="재고명" class="input-name" /></td>
            <td>
                <select class="input-supplyName">
                    ${inventorySelectOptions}
                </select>
            </td>
            <td><input type="text" placeholder="가격" class="input-price" /></td>
            <td><input type="number" placeholder="수량" class="input-quantity" /></td>
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
        const { editingInventoryId, inventoryList, inventoryOptions } = this.state;
        const targetInventory = inventoryList.find(inventory => inventory.id === editingInventoryId);
        if (!targetInventory) return;

        const inventorySelectOptions = ['<option value="">포지션 선택</option>', ...inventoryOptions.map(
            opt => `<option value="${opt}" ${opt === targetInventory.supplyName ? "selected" : ""}>${opt}</option>`
        )].join('');

        const editRowHtml = `
        <tr class="input-row">
            <td><input type="text" class="input-name" value="${targetInventory.name}" /></td>
            <td>
                <select class="input-supplyName">${inventorySelectOptions}</select>
            </td>
            <td><input type="text" class="input-price" value="${targetInventory.price}" /></td>
            <td><input type="number" class="input-quantity" value="${targetInventory.quantity}" /></td>
        </tr>
    `;

        const tbody = this.$target.querySelector('.modal-table tbody');
        if (tbody) {
            tbody.innerHTML = this.state.inventoryList.map(inventory => {
                if (inventory.id === editingInventoryId) {
                    return editRowHtml;
                } else {
                    return `
                    <tr data-id="${inventory.id}">
                        <td>${inventory.name}</td>
                        <td>${inventory.supplyName}</td>
                        <td>${inventory.price}원</td>
                        <td>${inventory.quantity}</td>
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