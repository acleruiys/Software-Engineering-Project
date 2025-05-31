import Component from "../main/Component.js";

export default class EmployeeSystem extends Component {
    setup() {
        this.state = {
            employeeList: [],
            isAdding: false,
            positionOptions: ['매니저', '파트타임', '풀타임'],
            selectedEmployeeId: null,
            isEditing: false,
            editEmployee: null,
        };
        this.fetchEmployees();
    }

    // 직원 목록 가져오기
    async fetchEmployees() {
        try {
            const response = await fetch('/api/employee/list');
            if (!response.ok) {
                throw new Error('직원 목록을 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            
            // 백엔드 데이터 형식을 프론트엔드에 맞게 변환
            this.state.employeeList = data.map(employee => ({
                id: employee.employeeId,
                name: employee.name,
                position: this.translatePosition(employee.position),
                hourlyPay: this.formatSalary(employee.salary)
            }));
            
            this.renderEmployeeTable();
        } catch (error) {
            console.error('직원 목록 조회 오류:', error);
            alert('직원 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 직원 추가
    async addEmployee(employeeData) {
        try {
            const response = await fetch('/api/employee/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: employeeData.name,
                    // 백엔드 포맷에 맞게 변환
                    position: this.getPositionCode(employeeData.position)
                })
            });
            
            if (!response.ok) {
                throw new Error('직원 추가에 실패했습니다.');
            }
            
            await this.fetchEmployees();
            return true;
        } catch (error) {
            console.error('직원 추가 오류:', error);
            alert('직원 추가 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 직원 수정
    async updateEmployee(employeeData) {
        try {
            const response = await fetch('/api/employee/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employeeId: employeeData.id,
                    name: employeeData.name,
                    position: this.getPositionCode(employeeData.position),
                    salary: this.parseSalary(employeeData.hourlyPay)
                })
            });
            
            if (!response.ok) {
                throw new Error('직원 수정에 실패했습니다.');
            }
            
            await this.fetchEmployees();
            return true;
        } catch (error) {
            console.error('직원 수정 오류:', error);
            alert('직원 수정 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 직원 삭제
    async deleteEmployee(employeeId) {
        try {
            const response = await fetch(`/api/employee/delete/${employeeId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('직원 삭제에 실패했습니다.');
            }
            
            const data = await response.json();
            if (data.success) {
                await this.fetchEmployees();
                return true;
            } else {
                throw new Error('서버에서 직원 삭제를 완료하지 못했습니다.');
            }
        } catch (error) {
            console.error('직원 삭제 오류:', error);
            alert('직원 삭제 중 오류가 발생했습니다.');
            return false;
        }
    }

    // 포지션 코드 변환 (프론트엔드 -> 백엔드)
    getPositionCode(position) {
        switch (position) {
            case '매니저': return 'manager';
            case '파트타임': return 'part_time';
            case '풀타임': return 'full_time';
            default: return 'part_time';
        }
    }

    // 포지션 코드 변환 (백엔드 -> 프론트엔드)
    translatePosition(positionCode) {
        switch (positionCode) {
            case 'manager': return '매니저';
            case 'part_time': return '파트타임';
            case 'full_time': return '풀타임';
            default: return '파트타임';
        }
    }

    // 급여 형식 변환 (숫자 -> 문자열)
    formatSalary(salary) {
        return salary ? salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
    }

    // 급여 형식 변환 (문자열 -> 숫자)
    parseSalary(salaryStr) {
        return parseInt(salaryStr.replace(/,/g, ''), 10) || 10030;
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
            addBtn.addEventListener('click', async () => {
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
                    const success = await this.addEmployee(newEmployee);
                    
                    if (success) {
                        this.state.isAdding = false;
                        addBtn.textContent = "직원 등록";
                    }
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
            deleteBtn.addEventListener('click', async () => {
                const { selectedEmployeeId } = this.state;

                if (selectedEmployeeId === null) {
                    alert("삭제할 직원을 먼저 선택하세요.");
                    return;
                }

                if (confirm("정말 이 직원을 삭제하시겠습니까?")) {
                    await this.deleteEmployee(selectedEmployeeId);
                    this.state.selectedEmployeeId = null;
                }
            });
        }

        const editBtn = this.$target.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', async () => {
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

                    const updatedEmployee = {id, name, position, hourlyPay};
                    const success = await this.updateEmployee(updatedEmployee);
                    
                    if (success) {
                        this.state.isEditing = false;
                        this.state.editingEmployeeId = null;
                        editBtn.textContent = "직원 수정";
                    }
                }
            });
        }

        document.addEventListener('click', (e) => {
            const isClickInside = this.$target.contains(e.target);
            const modalContainer = this.$target.querySelector('.modal-container');
            const isModalVisible = modalContainer && modalContainer.style.display === 'block';

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

        const { employeeList } = this.state;

        const employeeRows = employeeList.map(employee => `
            <tr data-id="${employee.id}">
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.hourlyPay}원</td>
            </tr>
        `).join('');

        tbody.innerHTML = employeeRows;
    }

    renderInputRow() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const positionOptions = this.state.positionOptions;
        const positionSelectOptions = ['<option value="">카테고리 선택</option>', ...positionOptions.map(
            option => `<option value="${option}">${option}</option>`
        )].join('');

        const inputRow = `
            <tr class="input-row">
                <td><input type="text" placeholder="이름" class="input-name" /></td>
                <td>
                    <select class="input-position">
                        ${positionSelectOptions}
                    </select>
                </td>
                <td><input type="text" placeholder="시급" class="input-hourlyPay" value="10,030" /></td>
            </tr>
        `;

        tbody.innerHTML += inputRow;
    }

    renderEditRow() {
        const tbody = this.$target.querySelector('.modal-table tbody');
        if (!tbody) return;

        const { employeeList, editingEmployeeId } = this.state;
        const editEmployee = employeeList.find(emp => emp.id === editingEmployeeId);
        
        if (!editEmployee) return;

        const positionOptions = this.state.positionOptions;
        const positionSelectOptions = positionOptions.map(
            option => `<option value="${option}" ${editEmployee.position === option ? 'selected' : ''}>${option}</option>`
        ).join('');

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const editRow = rows.find(row => Number(row.dataset.id) === editingEmployeeId);
        
        if (editRow) {
            editRow.innerHTML = `
                <td><input type="text" placeholder="이름" class="input-name" value="${editEmployee.name}" /></td>
                <td>
                    <select class="input-position">
                        ${positionSelectOptions}
                    </select>
                </td>
                <td><input type="text" placeholder="시급" class="input-hourlyPay" value="${editEmployee.hourlyPay}" /></td>
            `;
        }
    }

    hideSalesUI() {
        this.$target.innerHTML = '';
    }
}