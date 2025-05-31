/**
 * 회원 검색 기능을 위한 JavaScript 파일
 */

class MemberSearch {
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
                    // 회원의 전화번호 검색 - 두 가지 형식(하이픈 포함/미포함) 모두 확인
                    const filteredMembers = allMembers.filter(member => {
                        // 1. 원본 전화번호에 검색어가 포함되는지 확인 (하이픈 포함된 형식)
                        if (member.phone.includes(searchValue)) {
                            return true;
                        }
                        
                        // 2. 하이픈이 제거된 전화번호에 검색어가 포함되는지 확인
                        const memberPhoneDigits = member.phone.replace(/-/g, '');
                        // 사용자 입력에서 하이픈 제거한 값과 회원 전화번호에서 하이픈 제거한 값 비교
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
                // 이름 검색은 아직 API에서 지원하지 않는 것으로 보이므로
                // 모든 회원을 가져와서 프론트엔드에서 필터링
                url = '/api/members';
                const response = await fetch(url);
                if (response.ok) {
                    const allMembers = await response.json();
                    const filteredMembers = allMembers.filter(member =>
                        member.name.includes(searchValue)
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
                        memberId,
                        name,
                        phone,
                        points
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

    // 회원 추가 모달 열기
    openAddMemberModal() {
        // 기존 모달 내용 저장
        const originalContent = this.target.querySelector('.member-search-modal-content');
        if (originalContent) {
            originalContent.style.display = 'none';
        }

        // 회원 추가 모달 생성
        const addMemberModal = document.createElement('div');
        addMemberModal.className = 'member-search-modal-content';
        addMemberModal.innerHTML = `
            <div class="modal-header">
                <h2>회원 추가</h2>
                <button class="close-add-modal">&times;</button>
            </div>
            
            <form id="addMemberForm" class="add-member-form">
                <div class="form-group">
                    <label for="memberName">이름</label>
                    <input type="text" id="memberName" required>
                </div>
                <div class="form-group">
                    <label for="memberPhone">전화번호</label>
                    <input type="tel" id="memberPhone" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" 
                           placeholder="010-1234-5678" required>
                    <small>형식: 010-XXXX-XXXX</small>
                </div>
                <div class="form-group">
                    <label for="memberPw">비밀번호</label>
                    <input type="password" id="memberPw" value="">
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-save">저장</button>
                    <button type="button" class="btn-cancel">취소</button>
                </div>
            </form>
        `;

        // 회원 추가 모달 스타일
        const style = document.createElement('style');
        style.textContent = `
            .add-member-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .form-group label {
                font-weight: bold;
            }
            
            .form-group input {
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            
            .form-group small {
                color: #666;
                font-size: 0.8em;
            }
            
            .button-group {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .btn-save, .btn-cancel {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .btn-save {
                background-color: #4CAF50;
                color: white;
            }
            
            .btn-cancel {
                background-color: #f44336;
                color: white;
            }
        `;
        document.head.appendChild(style);

        // 회원 추가 모달을 기존 모달 컨테이너에 추가
        const modalContainer = this.target.querySelector('.member-search-modal');
        if (modalContainer) {
            modalContainer.appendChild(addMemberModal);
        }

        // 닫기 버튼 이벤트 리스너
        const closeButton = addMemberModal.querySelector('.close-add-modal');
        closeButton.addEventListener('click', () => {
            this.closeAddMemberModal(originalContent, addMemberModal);
        });

        // 취소 버튼 이벤트 리스너
        const cancelButton = addMemberModal.querySelector('.btn-cancel');
        cancelButton.addEventListener('click', () => {
            this.closeAddMemberModal(originalContent, addMemberModal);
        });

        // 폼 제출 이벤트 리스너
        const addMemberForm = addMemberModal.querySelector('#addMemberForm');
        addMemberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMember();
        });
    }

    // 회원 추가 모달 닫기
    closeAddMemberModal(originalContent, addMemberModal) {
        if (addMemberModal) {
            addMemberModal.remove();
        }
        if (originalContent) {
            originalContent.style.display = 'block';
        }
    }

    // 회원 추가 API 호출
    async addMember() {
        const nameInput = document.getElementById('memberName');
        const phoneInput = document.getElementById('memberPhone');
        const pwInput = document.getElementById('memberPw');

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const pw = parseInt(pwInput.value) || 0;

        // 프론트엔드 유효성 검증
        // 1. 필수 입력 검증
        if (!name || !phone) {
            alert('이름과 전화번호는 필수 입력 항목입니다.');
            return;
        }

        // 2. 이름 길이 검증
        if (name.length < 2 || name.length > 20) {
            alert('이름은 2자 이상 20자 이하로 입력해주세요.');
            return;
        }

        // 3. 전화번호 형식 검증
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            alert('전화번호 형식이 올바르지 않습니다. 010-XXXX-XXXX 형식으로 입력해주세요.');
            return;
        }

        // 4. 비밀번호 검사 검증
        if (pw.toString().length !== 4) {
            alert('비밀번호 4자리를 입력해주세요.');

            if (pw <= 0 || pw >= 9999){
                alert('숫자를 입력해주세요');
                return;
            }
            return;
        }

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    phone,
                    pw
                })
            });

            // 응답 본문 파싱 시도
            let responseData;
            try {
                if (response.status !== 204) { // 204 No Content인 경우 json 파싱하지 않음
                    responseData = await response.json();
                }
            } catch (e) {
                console.log('응답 본문이 없거나 JSON 형식이 아닙니다.');
            }

            if (response.status === 201 || response.status === 200) {
                alert('회원이 성공적으로 추가되었습니다.');

                // 모달 닫기
                const originalContent = this.target.querySelector('.member-search-modal-content');
                const addMemberModal = this.target.querySelectorAll('.member-search-modal-content')[1];
                this.closeAddMemberModal(originalContent, addMemberModal);

                // 회원 목록 새로고침
                this.getAllMembers();
            } else if (response.status === 409) {
                // 중복된 회원(Conflict)
                alert(`회원 추가 실패: ${responseData?.message || '이미 등록된 회원입니다.'}`);
            } else if (response.status === 400) {
                // 잘못된 요청
                alert(`회원 추가 실패: ${responseData?.message || '입력 정보가 올바르지 않습니다.'}`);
            } else {
                // 기타 오류
                alert(`회원 추가 실패: ${responseData?.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error('회원 추가 중 오류 발생:', error);
            alert('회원 추가 중 오류가 발생했습니다.');
        }
    }
}

// MemberSearch 클래스를 export
export default MemberSearch; 