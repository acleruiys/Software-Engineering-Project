import Component from "../main/Component.js";

export default class SupplySystem extends Component {
    setup() {
        this.state = {
            supplyList: [
                {id: 1, supplyName: 'ㅇㅇ', managerName: '이름', phone: '051-'},
                {id: 2, supplyName: 'ff', managerName: '이름2', phone: '051-2'},
            ],
            isAdding: false,
            selectedSupplyId: null,
            isEditing: false,
            editSupply: null,
        };
    }

    template() {
        const { supplyList, isAdding } = this.state;

        const supplyRows = supplyList.map(supply => `
        <tr data-id="${supply.id}">
            <td>${supply.supplyName}</td>
            <td>${supply.managerName}</td>
            <td>${supply.phone}</td>
        </tr>
    `).join('');

        const inputRow = isAdding ? `
            <tr class="input-row">
                <td><input type="text" placeholder="납품업체 이름" class="input-supplyName" /></td>
                <td><input type="text" placeholder="담당자 이름" class="input-managerName" /></td>
                <td><input type="text" placeholder="전화번호" class="input-phone" /></td>
            </tr>
        ` : '';


        return `
        <div class="modal-container">
            <div class="modal-header">
                <h2>납품업체 관리</h2>
                <button class="close-btn">x</button>
            </div>
            <div class="modal-actions">
                <button class="add-btn">${isAdding ? "등록 완료" : "납품업체 등록"}</button>
                <button class="edit-btn">납품업체 수정</button>
                <button class="delete-btn">납품업체 삭제</button>
            </div>
            <div class="modal-body">
                <div class="table-wrapper">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th>납품업체 이름</th>
                                <th>담당자</th>
                                <th>전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${supplyRows}
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
                const {isAdding} = this.state;

                if (!isAdding) {
                    this.state.isAdding = true;

                    addBtn.textContent = "등록 완료";

                    this.renderInputRow();
                } else {
                    const supplyName = this.$target.querySelector('.input-supplyName').value;
                    const managerName = this.$target.querySelector('.input-managerName').value;
                    const phone = this.$target.querySelector('.input-phone').value;

                    if (!managerName || !supplyName || !phone) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    const newSupply = {managerName, supplyName, phone};
                    this.state.supplyList.push(newSupply);
                    this.state.isAdding = false;

                    addBtn.textContent = "납품업체 등록";

                    this.renderSupplyTable();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSalesUI();
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

        const deleteBtn = this.$target.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const {selectedSupplyId, supplyList} = this.state;

                if (selectedSupplyId === null) {
                    alert("삭제할 납품업체를 먼저 선택하세요.");
                    return;
                }

                this.state.supplyList = supplyList.filter(supply => supply.id !== selectedSupplyId);
                this.state.selectedSupplyId = null;

                this.renderSupplyTable();
            });
        }

        const editBtn = this.$target.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const {isEditing, selectedSupplyId, supplyList} = this.state;

                if (!isEditing) {
                    if (selectedSupplyId === null) {
                        alert("수정할 납품업체를 먼저 선택하세요.");
                        return;
                    }

                    this.state.isEditing = true;
                    this.state.editingSupplyId = selectedSupplyId;

                    editBtn.textContent = "수정 완료";
                    this.renderEditRow();
                } else {
                    const id = this.state.editingSupplyId;
                    const supplyName = this.$target.querySelector('.input-supplyName').value;
                    const managerName = this.$target.querySelector('.input-managerName').value;
                    const phone = this.$target.querySelector('.input-phone').value;

                    if (!supplyName || !managerName || !phone) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    this.state.supplyList = supplyList.map(supply =>
                        supply.id === id ? { id, supplyName, managerName, phone} : supply
                    );

                    this.state.isEditing = false;
                    this.state.editingSupplyId = null;
                    editBtn.textContent = "납품업체 수정";
                    this.renderSupplyTable();
                }
            });

            this.$target.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (!row || row.classList.contains('input-row')) return;

                const selectedId = Number(row.dataset.id);
                this.state.selectedSupplyId = selectedId;

                const rows = this.$target.querySelectorAll('.modal-table tbody tr');
                rows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            });
        }
    }

    renderSupplyTable() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const supplyRows = this.state.supplyList.map(supply => `
        <tr data-id="${supply.id}">
            <td>${supply.supplyName}</td>
            <td>${supply.managerName}</td>
            <td>${supply.phone}</td>
        </tr>
    `).join('');
        tbody.innerHTML = supplyRows;
    }

    renderInputRow() {
        const { isAdding } = this.state;

        const inputRow = isAdding ? `
        <tr class="input-row"> 
            <td><input type="text" placeholder="납품업체 이름" class="input-supplyName" /></td>
            <td><input type="text" placeholder="담당자 이름" class="input-managerName" /></td>
            <td><input type="text" placeholder="전화번호" class="input-phone" /></td>
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
        const { editingSupplyId, supplyList } = this.state;
        const targetSupply = supplyList.find(supply => supply.id === editingSupplyId);
        if (!targetSupply) return;

        const editRowHtml = `
        <tr class="input-row">
            <td><input type="text" class="input-supplyName" value="${targetSupply.supplyName}" /></td>
            <td><input type="text" class="input-managerName" value="${targetSupply.managerName}" /></td>
            <td><input type="text" class="input-phone" value="${targetSupply.phone}" /></td>
        </tr>
    `;

        const tbody = this.$target.querySelector('.modal-table tbody');
        if (tbody) {
            tbody.innerHTML = this.state.supplyList.map(supply => {
                if (supply.id === editingSupplyId) {
                    return editRowHtml;
                } else {
                    return `
                    <tr data-id="${supply.id}">
                        <td>${supply.supplyName}</td>
                        <td>${supply.managerName}</td>
                        <td>${supply.phone}</td>
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 1d35599a9935912c77206884fb5784decd4bb34b
