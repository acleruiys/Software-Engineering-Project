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
                const point = parseInt(document.getElementById('usePoint').value);
                if (point > this.selectedMember.points) {
                    alert('잔여 포인트보다 많습니다.');
                    return;
                }
                this.billing.updateDiscountAmount(point);
                alert(`${point}P가 사용되었습니다.`);
                this.close();
            }
        });
    }
}