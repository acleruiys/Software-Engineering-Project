import Component from "../main/Component.js";

export default class EmployeeSystem extends Component {
    setup() {
        this.state = {
            employeeList: [
                {id: 1, name: '서윤', position: '매니저', hourlyPay: '10,030'}
            ],
            isAdding: false,
            positionOptions: ['매니저', '파트타임', '풀타임'],
            selectedEmployeeId: null,
            isEditing: false,
            editEmployee: null,
        };
    }

    template() {
        const { employeeList, isAdding } = this.state;
        const positionOptions = this.state.positionOptions;
        const positionSelectOptions = ['<option value="">카테고리 선택</option>', ...positionOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const employeeRows = employeeList.map(employee => `
        <tr data-id="${employee.id}">
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.hourlyPay}원</td>
        </tr>
    `).join('');

        const inputRow = isAdding ? `
            <tr class="input-row">
                <td><input type="text" placeholder="이름" class="input-name" /></td>
                <td>
                    <select class="input-position">
                        ${positionSelectOptions}
                    </select>
                </td>
               <td><input type="text" placeholder="시급" class="input-hourlyPay" /></td>
            </tr>
        ` : '';


        return `
        <div class="modal-container">
            <div class="modal-header">
                <h2>직원 관리</h2>
                <button class="close-btn">x</button>
            </div>
            <div class="modal-actions">
                <button class="add-btn">${isAdding ? "등록 완료" : "직원 등록"}</button>
                <button class="edit-btn">직원 수정</button>
                <button class="delete-btn">직원 삭제</button>
            </div>
            <div class="modal-body">
                <div class="table-wrapper">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th>직원명</th>
                                <th>포지션</th>
                                <th>시급</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employeeRows}
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
                    const position = this.$target.querySelector('.input-position').value;

                    if (!name || !position) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    const newEmployee = {name, position, hourlyPay: "10030"};
                    this.state.employeeList.push(newEmployee);
                    this.state.isAdding = false;

                    addBtn.textContent = "직원 등록";

                    this.renderEmployeeTable();
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
                const { selectedEmployeeId, employeeList } = this.state;

                if (selectedEmployeeId === null) {
                    alert("삭제할 직원을 먼저 선택하세요.");
                    return;
                }

                this.state.employeeList = employeeList.filter(employee => employee.id !== selectedEmployeeId);
                this.state.selectedEmployeeId = null;

                this.renderEmployeeTable();
            });
        }

        const editBtn = this.$target.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const {isEditing, selectedEmployeeId, employeeList} = this.state;

                if (!isEditing) {
                    if (selectedEmployeeId === null) {
                        alert("수정할 직원을 먼저 선택하세요.");
                        return;
                    }

                    this.state.isEditing = true;
                    this.state.editingEmployeeId = selectedEmployeeId;

                    editBtn.textContent = "수정 완료";
                    this.renderEditRow();
                } else {
                    const id = this.state.editingEmployeeId;
                    const name = this.$target.querySelector('.input-name').value;
                    const position = this.$target.querySelector('.input-position').value;
                    const hourlyPay = this.$target.querySelector('.input-hourlyPay').value;

                    if (!name || !position || !hourlyPay) {
                        alert("모든 값을 입력하세요.");
                        return;
                    }

                    this.state.employeeList = employeeList.map(employee =>
                        employee.id === id ? {id, name, position, hourlyPay} : employee
                    );

                    this.state.isEditing = false;
                    this.state.editingEmployeeId = null;
                    editBtn.textContent = "직원 수정";
                    this.renderEmployeeTable();
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

            this.state.selectedEmployeeId = selectedId;

            const rows = this.$target.querySelectorAll('.modal-table tbody tr');
            rows.forEach(r => r.classList.remove('selected')); // 기존 선택 해제

            row.classList.add('selected');
        });
    }

    renderEmployeeTable() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const employeeRows = this.state.employeeList.map(employee => `
        <tr data-id="${employee.id}">
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.hourlyPay}원</td>
        </tr>
    `).join('');

        tbody.innerHTML = employeeRows;
    }

    renderInputRow() {
        const { isAdding, positionOptions } = this.state;

        const positionSelectOptions = ['<option value="">카테고리 선택</option>', ...positionOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const inputRow = isAdding ? `
        <tr class="input-row">
            <td><input type="text" placeholder="직원명" class="input-name" /></td>
            <td>
                <select class="input-position">
                    ${positionSelectOptions}
                </select>
            </td>
            <td></td>
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
        const { editingEmployeeId, employeeList, positionOptions } = this.state;
        const targetEmployee = employeeList.find(employee => employee.id === editingEmployeeId);
        if (!targetEmployee) return;

        const positionSelectOptions = ['<option value="">포지션 선택</option>', ...positionOptions.map(
            opt => `<option value="${opt}" ${opt === targetEmployee.position ? "selected" : ""}>${opt}</option>`
        )].join('');

        const editRowHtml = `
        <tr class="input-row">
            <td><input type="text" class="input-name" value="${targetEmployee.name}" /></td>
            <td>
                <select class="input-position">${positionSelectOptions}</select>
            </td>
            <td><input type="text" class="input-hourlyPay" value="${targetEmployee.hourlyPay}" /></td>
        </tr>
    `;

        const tbody = this.$target.querySelector('.modal-table tbody');
        if (tbody) {
            tbody.innerHTML = this.state.employeeList.map(employee => {
                if (employee.id === editingEmployeeId) {
                    return editRowHtml;
                } else {
                    return `
                    <tr>
                        <td>${employee.name}</td>
                        <td>${employee.position}</td>
                        <td>${employee.hourlyPay}원</td>
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