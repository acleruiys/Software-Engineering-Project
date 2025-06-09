// Payment.js (간소화된 포인트 결제 전용 모달)

export default class Payment {
    constructor({ target, billing }) {
        this.target = target;
        this.billing = billing;
        this.selectedMember = window.__selectedMember__ || null;
        this.render();
        this.initListeners();
    }

    render() {
        this.target.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-content">
                    <div class="modal-header">
                        <h2>포인트 결제</h2>
                        <button class="close-button">&times;</button>
                    </div>
                    <div id="payment-area"></div>
                </div>
            </div>
        `;

        // 모달 스타일 추가 (중복 방지)
        if (!document.getElementById('paymentModalStyle')) {
            const style = document.createElement('style');
            style.id = 'paymentModalStyle';
            style.textContent = `
                .payment-modal {
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

                .payment-modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
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
    }

    initListeners() {
        this.target.querySelector('.close-button').addEventListener('click', () => this.close());
        this.renderPointUI();
    }

    close() {
        this.target.innerHTML = '';
    }

    renderPointUI() {
        if (!this.selectedMember) {
            alert('먼저 회원을 선택해주세요.');
            this.close();
            return;
        }

        const area = this.target.querySelector('#payment-area');
        area.innerHTML = `
            <p>잔여 포인트: ${this.selectedMember.points.toLocaleString()}P</p>
            <input type="password" id="memberPwd" placeholder="비밀번호 입력" />
            <button id="verifyPwdBtn">확인</button>
            <div id="pointInputArea" style="display:none;">
                <input type="number" id="usePoint" placeholder="사용할 포인트" />
                <button id="usePointBtn">사용</button>
            </div>
        `;

        this.target.querySelector('#verifyPwdBtn').addEventListener('click', async () => {
            const inputPwd = parseInt(this.target.querySelector('#memberPwd').value);

            // 입력값 검증
            if (!inputPwd || inputPwd.toString().length !== 4) {
                alert('4자리 숫자 비밀번호를 입력해주세요.');
                return;
            }

            try {
                // 서버 측 비밀번호 검증 API 호출
                const res = await fetch(`/api/members/${this.selectedMember.memberId}/verify-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: inputPwd
                    })
                });

                if (!res.ok) {
                    throw new Error('비밀번호 검증 실패');
                }

                const result = await res.json();

                if (result.valid) {
                    document.getElementById('pointInputArea').style.display = 'block';
                    // 비밀번호 입력 필드 초기화
                    this.target.querySelector('#memberPwd').value = '';
                } else {
                    alert(result.message || '비밀번호가 일치하지 않습니다.');
                }
            } catch (err) {
                alert('서버 오류 또는 연결 실패');
                console.error('비밀번호 검증 오류:', err);
            }
        });

        this.target.querySelector('#pointInputArea').addEventListener('click', (e) => {
            if (e.target.id === 'usePointBtn') {
                this.usePoints();
            }
        });
    }

    // 포인트 사용 처리
    async usePoints() {
        const pointInput = document.getElementById('usePoint');
        const point = parseInt(pointInput.value);

        // 입력값 검증
        if (!point || point <= 0) {
            alert('사용할 포인트를 입력해주세요.');
            return;
        }

        if (point > this.selectedMember.points) {
            alert('잔여 포인트보다 많습니다.');
            return;
        }

        console.log(`포인트 사용 시도: ${point}P, 회원ID: ${this.selectedMember.memberId}`);

        try {
            // 서버에 포인트 차감 요청
            const result = await this.updateMemberPoints(this.selectedMember.memberId, point);
            console.log('포인트 차감 결과:', result);
            
            // 로컬 회원 정보 업데이트
            this.selectedMember.points -= point;
            window.__selectedMember__ = this.selectedMember;
            
            // 할인 금액 적용
            this.billing.updateDiscountAmount(point);
            
            // 화면의 회원 정보 업데이트
            this.updateMemberDisplay();
            
            alert(`${point}P가 사용되었습니다.`);
            this.close();
            
        } catch (error) {
            console.error('포인트 사용 오류:', error);
            alert('포인트 사용 중 오류가 발생했습니다.');
        }
    }

    // 회원 포인트 차감 API 호출
    async updateMemberPoints(memberId, pointsToDeduct) {
        try {
            console.log(`API 호출: /api/members/${memberId}/points`, {
                points: pointsToDeduct,
                action: 'DEDUCT'
            });

            const response = await fetch(`/api/members/${memberId}/points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    points: pointsToDeduct,
                    action: 'DEDUCT' // 포인트 차감
                })
            });

            console.log('API 응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API 오류 응답:', errorText);
                throw new Error(`포인트 차감 실패: ${response.status}`);
            }

            const result = await response.json();
            console.log('API 성공 응답:', result); 
            return result;
        } catch (error) {
            console.error('포인트 업데이트 오류:', error);
            throw error;
        }
    }

    // 화면의 회원 정보 업데이트
    updateMemberDisplay() {
        // FooterPanel의 회원 정보 업데이트를 위한 이벤트 발생
        const event = new CustomEvent('memberPointsUpdated', {
            detail: this.selectedMember
        });
        document.dispatchEvent(event);
    }
}