import Component from '../main/Component.js';

export default class MemberSearchPopup extends Component {
    setup() {
        this.state = {
            isVisible: false,
            searchPhone: '',
            members: [],
            isLoading: false,
            searchError: null,
            selectedMember: null
        };
    }

    template() {
        const { isVisible, members, searchPhone, isLoading, searchError, selectedMember } = this.state;
        
        if (!isVisible) return '';
        
        return `
            <div class="member-search-popup">
                <div class="popup-header">
                    <h2>회원 검색</h2>
                    <button class="close-btn" id="closePopupBtn">×</button>
                </div>
                
                <div class="search-container">
                    <input type="text" id="memberPhoneSearch" 
                        placeholder="휴대폰 번호를 입력하세요" 
                        value="${searchPhone}" />
                    <button id="searchMemberBtn">검색</button>
                </div>
                
                ${searchError ? `<div class="error-message">${searchError}</div>` : ''}
                
                <div class="member-list ${isLoading ? 'loading' : ''}">
                    ${isLoading ? '<div class="loading-spinner">로딩 중...</div>' : ''}
                    
                    ${members.length > 0 
                        ? `<table class="member-table">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>이름</th>
                                    <th>휴대폰</th>
                                    <th>포인트</th>
                                    <th>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${members.map((member, index) => `
                                    <tr class="${selectedMember && selectedMember.memberId === member.memberId ? 'selected' : ''}">
                                        <td>${member.memberId}</td>
                                        <td>${member.name}</td>
                                        <td>${member.phone}</td>
                                        <td>${member.points || 0}P</td>
                                        <td><button class="select-member-btn" data-index="${index}">선택</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>`
                        : '<div class="no-results">검색 결과가 없습니다.</div>'
                    }
                </div>
                
                <div class="popup-footer">
                    <button id="confirmMemberBtn" ${!selectedMember ? 'disabled' : ''}>
                        회원 선택 확인
                    </button>
                </div>
            </div>
        `;
    }

    setEvent() {
        // 팝업 닫기
        this.addEvent('click', '#closePopupBtn', () => {
            this.close();
        });
        
        // 회원 검색
        this.addEvent('click', '#searchMemberBtn', () => {
            this.searchMember();
        });
        
        // 엔터키로 검색
        this.addEvent('keyup', '#memberPhoneSearch', (e) => {
            if (e.key === 'Enter') {
                this.searchMember();
            }
        });
        
        // 회원 선택
        this.addEvent('click', '.select-member-btn', ({ target }) => {
            const index = parseInt(target.dataset.index);
            this.setState({
                selectedMember: this.state.members[index]
            });
        });
        
        // 회원 선택 확인
        this.addEvent('click', '#confirmMemberBtn', () => {
            if (this.state.selectedMember) {
                // 선택된 회원 정보를 이벤트로 외부에 전달
                this.emit('member-selected', this.state.selectedMember);
                this.close();
                
                // 사용자 정보를 푸터에 표시
                const userInfDiv = document.querySelector('.user-inf');
                if (userInfDiv) {
                    const member = this.state.selectedMember;
                    userInfDiv.innerHTML = `
                        <div class="user-label">회원번호</div>
                        <div class="user-value">${member.memberId}</div>
                        <div class="user-label">회원명</div>
                        <div class="user-value">${member.name}</div>
                        <div class="user-label">잔여포인트</div>
                        <div class="user-value">${member.points || 0}P</div>
                    `;
                }
            }
        });
    }
    
    // 모달 열기
    open() {
        this.setState({ 
            isVisible: true,
            members: [],
            searchPhone: '',
            searchError: null,
            selectedMember: null
        });
        document.querySelector('.overlay').style.display = 'block';
        this.getAllMembers();
    }
    
    // 모달 닫기
    close() {
        this.setState({ isVisible: false });
        document.querySelector('.overlay').style.display = 'none';
    }
    
    // 회원 검색
    async searchMember() {
        const phoneInput = document.querySelector('#memberPhoneSearch');
        if (!phoneInput) return;
        
        const phone = phoneInput.value.trim();
        this.setState({ searchPhone: phone });
        
        if (!phone) {
            this.getAllMembers();
            return;
        }
        
        this.setState({ isLoading: true, searchError: null });
        
        try {
            const response = await fetch(`/api/members/phone/${phone}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    this.setState({ 
                        members: [],
                        isLoading: false,
                        searchError: '해당 번호로 등록된 회원이 없습니다.' 
                    });
                    return;
                }
                throw new Error('회원 검색 중 오류가 발생했습니다.');
            }
            
            const data = await response.json();
            this.setState({ 
                members: data ? [data] : [],
                isLoading: false
            });
        } catch (error) {
            console.error('회원 검색 오류:', error);
            this.setState({ 
                searchError: error.message,
                members: [],
                isLoading: false
            });
        }
    }
    
    // 모든 회원 가져오기
    async getAllMembers() {
        this.setState({ isLoading: true, searchError: null });
        
        try {
            const response = await fetch('/api/members');
            
            if (!response.ok) {
                throw new Error('회원 목록을 가져오는 중 오류가 발생했습니다.');
            }
            
            const data = await response.json();
            
            this.setState({ 
                members: Array.isArray(data) ? data : [],
                isLoading: false
            });
        } catch (error) {
            console.error('회원 목록 조회 오류:', error);
            this.setState({ 
                searchError: error.message,
                members: [],
                isLoading: false
            });
        }
    }
} 