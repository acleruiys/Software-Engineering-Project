/**
 * 회원 검색 기능을 위한 JavaScript 파일
 */

class MemberUI {
    constructor({ target }) {
        this.target = target;
        this.render();
        this.searchForm = document.getElementById('memberSearchForm');
        this.searchInput = document.getElementById('memberSearchInput');
        this.searchType = document.getElementById('searchType');
        this.searchResults = document.getElementById('searchResults');
        this.memberTable = document.getElementById('memberTable');
        this.pagination = document.getElementById('pagination');
        this.currentPage = 1;
        this.membersPerPage = 10;
        this.totalMembers = 0;

        this.initEventListeners();
    }

    render() {
        // 모달 형태의 회원 검색 UI 렌더링
        this.target.innerHTML = `
            <div class="member-search-modal">
                <div class="member-search-modal-content">
                    <div class="modal-header">
                        <h2>회원 검색</h2>
                        <button class="close-button">&times;</button>
                    </div>
                    
                    <!-- 검색 폼 -->
                    <form id="memberSearchForm" class="search-form">
                        <select id="searchType">
                            <option value="name">이름</option>
                            <option value="phone">전화번호</option>
                        </select>
                        <input type="text" id="memberSearchInput" placeholder="검색어를 입력하세요">
                        <button type="submit">검색</button>
                        <button type="button" id="addMemberBtn">추가</button>
                    </form>
                    
                    <!-- 검색 결과 -->
                    <div id="searchResults" class="search-results hidden">
                        <div id="memberTable"></div>
                        <div id="pagination"></div>
                    </div>
                </div>
            </div>
        `;

        // 모달 스타일 동적 추가
        if (!document.getElementById('memberSearchModalStyle')) {
            const style = document.createElement('style');
            style.id = 'memberSearchModalStyle';
            style.textContent = `
                .member-search-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .member-search-modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 80%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .close-button {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }

        // 모달 닫기 버튼에 이벤트 리스너 추가
        const closeButton = this.target.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        // 모달 외부 클릭 시 닫기
        this.target.addEventListener('click', (e) => {
            if (e.target === this.target.querySelector('.member-search-modal')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        // 모달 제거
        this.target.innerHTML = '';
    }

    initEventListeners() {
        // 검색 폼 제출 이벤트 리스너
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.currentPage = 1;
            this.searchMembers();
        });

        // 검색어 입력 시 실시간 검색
        this.searchInput.addEventListener('input', () => {
            if (this.searchInput.value.trim().length >= 2) {
                this.debounceSearch();
            } else if (this.searchInput.value.trim().length === 0) {
                this.getAllMembers();
            }
        });

        // 회원 추가 버튼 이벤트 리스너
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => {
                this.openAddMemberModal();
            });
        }
    }

    // 디바운싱 처리
    debounceSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.currentPage = 1;
            this.searchMembers();
        }, 300);
    }

    // 회원 검색 API 호출
    async searchMembers() {
        const searchValue = this.searchInput.value.trim();
        const searchType = this.searchType.value;

        if (!searchValue) {
            this.getAllMembers();
            return;
        }

        try {
            let url;
            if (searchType === 'phone') {
                // 전화번호에서 하이픈('-') 제거하여 숫자만 추출
                const cleanedPhoneNumber = searchValue.replace(/-/g, '');
                
                // 전체 회원 목록을 가져와서 전화번호로 필터링
                url = '/api/members';
                const response = await fetch(url);
                if (response.ok) {
                    const allMembers = await response.json();
                    
                    const filteredMembers = allMembers.filter(member => {
                        // 1. 원본 전화번호에 검색어가 포함되는지 확인 (하이픈 포함된 형식)
                        if (member.phone.includes(searchValue)) {
                            return true;
                        }
                        
                        const memberPhoneDigits = member.phone.replace(/-/g, '');
                        
                        return memberPhoneDigits.includes(cleanedPhoneNumber);
                    });
                    
                    this.totalMembers = filteredMembers.length;
                    
                    const startIndex = (this.currentPage - 1) * this.membersPerPage;
                    const endIndex = startIndex + this.membersPerPage;
                    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
                    
                    this.displaySearchResults(paginatedMembers);
                    this.renderPagination();
                } else {
                    this.displayNoResults();
                }
            } else {
                
                url = '/api/members';
                const response = await fetch(url);
                if (response.ok) {
                    const allMembers = await response.json();
                    const searchValueLower = searchValue.toLowerCase();
                    const filteredMembers = allMembers.filter(member =>
                        member.name.toLowerCase().includes(searchValueLower)
                    );
                    this.totalMembers = filteredMembers.length;

                    const startIndex = (this.currentPage - 1) * this.membersPerPage;
                    const endIndex = startIndex + this.membersPerPage;
                    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

                    this.displaySearchResults(paginatedMembers);
                    this.renderPagination();
                } else {
                    this.displayNoResults();
                }
            }
        } catch (error) {
            console.error('회원 검색 중 오류 발생:', error);
            this.displayError('회원 검색 중 오류가 발생했습니다.');
        }
    }

    // 모든 회원 조회
    async getAllMembers() {
        try {
            const response = await fetch('/api/members');
            if (response.ok) {
                const members = await response.json();
                this.totalMembers = members.length;

                const startIndex = (this.currentPage - 1) * this.membersPerPage;
                const endIndex = startIndex + this.membersPerPage;
                const paginatedMembers = members.slice(startIndex, endIndex);

                this.displaySearchResults(paginatedMembers);
                this.renderPagination();
            } else {
                this.displayError('회원 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('회원 목록 조회 중 오류 발생:', error);
            this.displayError('회원 목록을 불러오는데 실패했습니다.');
        }
    }

    // 검색 결과 표시
    displaySearchResults(members) {
        if (!members || members.length === 0) {
            this.displayNoResults();
            return;
        }

        // 테이블 헤더 생성
        let tableHTML = `
            <table class="member-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>포인트</th>
                        <th>액션</th>
                        <th>선택</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 테이블 데이터 생성
        members.forEach((member, index) => {
            const rowNum = (this.currentPage - 1) * this.membersPerPage + index + 1;
            tableHTML += `
                <tr data-member-id="${member.memberId}">
                    <td>${rowNum}</td>
                    <td>${member.name}</td>
                    <td>${member.phone}</td>
                    <td>${member.points.toLocaleString()}</td>
                    <td>
                        <button class="btn-edit" data-id="${member.memberId}">수정</button>
                        <button class="btn-delete" data-id="${member.memberId}" data-phone="${member.phone}">삭제</button>
                    </td>
                    <td><input type="checkbox" data-id="${member.memberId}" data-name="${member.name}" data-phone="${member.phone}" data-points="${member.points}"></input></td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        this.memberTable.innerHTML = tableHTML;
        this.searchResults.classList.remove('hidden');

        // 수정 및 삭제 버튼 이벤트 리스너 추가
        this.addActionButtonListeners();
    }

    // 결과 없음 표시
    displayNoResults() {
        this.memberTable.innerHTML = '<div class="no-results">검색 결과가 없습니다.</div>';
        this.searchResults.classList.remove('hidden');
        this.pagination.innerHTML = '';
    }

    // 오류 표시
    displayError(message) {
        this.memberTable.innerHTML = `<div class="error-message">${message}</div>`;
        this.searchResults.classList.remove('hidden');
        this.pagination.innerHTML = '';
    }

    // 페이지네이션 렌더링
    renderPagination() {
        const totalPages = Math.ceil(this.totalMembers / this.membersPerPage);

        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination-container">';

        // 이전 페이지 버튼
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn prev-btn" data-page="${this.currentPage - 1}">이전</button>`;
        }

        // 페이지 번호
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn page-num ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // 다음 페이지 버튼
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn next-btn" data-page="${this.currentPage + 1}">다음</button>`;
        }

        paginationHTML += '</div>';
        this.pagination.innerHTML = paginationHTML;

        // 페이지네이션 버튼 이벤트 리스너 추가
        this.addPaginationListeners();
    }

    // 페이지네이션 버튼 이벤트 리스너 추가
    addPaginationListeners() {
        const pageButtons = this.pagination.querySelectorAll('.pagination-btn');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentPage = parseInt(button.getAttribute('data-page'));

                if (this.searchInput.value.trim()) {
                    this.searchMembers();
                } else {
                    this.getAllMembers();
                }
            });
        });
    }

    // 수정 및 삭제 버튼 이벤트 리스너 추가
    addActionButtonListeners() {
        // 수정 버튼
        const editButtons = this.memberTable.querySelectorAll('.btn-edit');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const memberId = button.getAttribute('data-id');
                this.openEditModal(memberId);
            });
        });

        // 삭제 버튼
        const deleteButtons = this.memberTable.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const phone = button.getAttribute('data-phone');
                this.confirmDelete(phone);
            });
        });

        // 선택 버튼
        const selectButtons = this.memberTable.querySelectorAll('input[type="checkbox"]');
        selectButtons.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                const memberId = checkbox.getAttribute('data-id');
                const name = checkbox.getAttribute('data-name');
                const phone = checkbox.getAttribute('data-phone');
                const points = checkbox.getAttribute('data-points');

                // 선택된 회원 정보를 이벤트로 발송
                const memberSelectedEvent = new CustomEvent('memberSelected', {
                    detail: {
                        memberId: parseInt(memberId),
                        name,
                        phone,
                        points: parseInt(points)
                    }
                });
                document.dispatchEvent(memberSelectedEvent);

                // 모달 닫기
                this.closeModal();
            });
        });
    }

    // 회원 수정 모달 열기
    openEditModal(memberId) {
        // 추후 구현 예정
        console.log(`회원 ID ${memberId} 수정`);
    }

    // 회원 삭제 확인
    confirmDelete(phone) {
        if (confirm('정말로 이 회원을 삭제하시겠습니까?')) {
            this.deleteMember(phone);
        }
    }

    // 회원 삭제 API 호출
    async deleteMember(phone) {
        try {
            const response = await fetch(`/api/members/phone/${phone}`, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                alert('회원이 성공적으로 삭제되었습니다.');
                // 현재 목록 다시 로드
                if (this.searchInput.value.trim()) {
                    this.searchMembers();
                } else {
                    this.getAllMembers();
                }
            } else {
                const errorData = await response.json();
                alert(`회원 삭제 실패: ${errorData.message}`);
            }
        } catch (error) {
            console.error('회원 삭제 중 오류 발생:', error);
            alert('회원 삭제 중 오류가 발생했습니다.');
        }
    }

    // 회원 추가 모달 열기 (SetMemberUI 사용)
    openAddMemberModal() {
        // SetMemberUI를 동적으로 import하고 실행
        import('./SetMemberUI.js').then(module => {
            const SetMemberUI = module.default;
            
            // 새로운 div 요소를 생성하여 SetMemberUI 모달을 표시
            const modalContainer = document.createElement('div');
            document.body.appendChild(modalContainer);
            
            new SetMemberUI({
                target: modalContainer,
                onMemberAdded: () => {
                    // 회원 추가 완료 후 회원 목록 새로고침
                    if (this.searchInput.value.trim()) {
                        this.searchMembers();
                    } else {
                        this.getAllMembers();
                    }
                }
            });
        }).catch(error => {
            console.error('SetMemberUI 로드 중 오류 발생:', error);
            alert('회원 추가 기능을 불러오는데 실패했습니다.');
        });
    }

}

// MemberUI 클래스를 export
export default MemberUI;