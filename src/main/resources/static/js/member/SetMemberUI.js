/**
 * 회원 추가 기능을 위한 JavaScript 파일
 */

class SetMemberUI {
    constructor({ target, onMemberAdded }) {
        this.target = target;
        this.onMemberAdded = onMemberAdded; // 회원 추가 후 콜백 함수
        this.render();
        this.initEventListeners();
    }

    render() {
        // 회원 추가 모달 UI 렌더링
        this.target.innerHTML = `
            <div class="member-add-modal">
                <div class="member-add-modal-content">
                    <div class="modal-header">
                        <h2>회원 추가</h2>
                        <button class="close-button">&times;</button>
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
                </div>
            </div>
        `;

        // 모달 스타일 동적 추가
        if (!document.getElementById('memberAddModalStyle')) {
            const style = document.createElement('style');
            style.id = 'memberAddModalStyle';
            style.textContent = `
                .member-add-modal {
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
                
                .member-add-modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 80%;
                    max-width: 500px;
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
        }
    }

    initEventListeners() {
        // 모달 닫기 버튼 이벤트 리스너
        const closeButton = this.target.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        // 취소 버튼 이벤트 리스너
        const cancelButton = this.target.querySelector('.btn-cancel');
        cancelButton.addEventListener('click', () => {
            this.closeModal();
        });

        // 모달 외부 클릭 시 닫기
        this.target.addEventListener('click', (e) => {
            if (e.target === this.target.querySelector('.member-add-modal')) {
                this.closeModal();
            }
        });

        // 폼 제출 이벤트 리스너
        const addMemberForm = this.target.querySelector('#addMemberForm');
        addMemberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMember();
        });
    }

    // 모달 닫기
    closeModal() {
        this.target.innerHTML = '';
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
                this.closeModal();

                // 회원 추가 완료 콜백 호출
                if (this.onMemberAdded) {
                    this.onMemberAdded();
                }
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

// SetMemberUI 클래스를 export
export default SetMemberUI;
