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

        const orderList = window.__orderList__ || [];
        if (orderList.length === 0) {
            alert('주문 내역이 없습니다.');
            this.close();
            return;
        }

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
            const inputPwd = this.target.querySelector('#memberPwd').value;
            if (!inputPwd || inputPwd.toString().length !== 4) {
                alert('4자리 숫자 비밀번호를 입력해주세요.');
                return;
            }

            try {
                const res = await fetch(`/api/members/${this.selectedMember.memberId}/verify-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: parseInt(inputPwd) }),
                });

                const result = await res.json();
                if (res.ok && result.valid) {

                    this.target.querySelector('#memberPwd').remove();
                    this.target.querySelaector('#verifyPwdBtn').remove();
                    document.getElementById('pointInputArea').style.display = 'block';
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

    async usePoints() {
        const pointInput = document.getElementById('usePoint');
        const point = parseInt(pointInput.value);

        if (!point || point <= 0) {
            alert('사용할 포인트를 입력해주세요.');
            return;
        }

        const orderAmount = this.billing.getAmount('주문금액');
        const discountAmount = this.billing.getAmount('할인금액');
        const finalAmount = orderAmount - discountAmount;

        if (point > orderAmount) {
            alert('포인트 사용 금액이 주문 금액을 초과할 수 없습니다.');
            return;
        }

        if (point < orderAmount) {
            alert('분할 납부는 지원하지 않습니다');
            return;
        }

        if (point > this.selectedMember.points) {
            alert('잔여 포인트보다 많습니다.');
            return;
        }


        this.billing.updateDiscountAmount(point);
        this.updateMemberDisplay();

        // 전액 포인트 결제는 바로 처리
        import('./HandlePayment.js').then(({ default: HandlePayment }) => {
            const handler = new HandlePayment({ appInstance: window.__app__ });
            handler.process('POINT');
        });
        this.close();

    }

    updateMemberDisplay() {
        const event = new CustomEvent('memberPointsUpdated', {
            detail: this.selectedMember
        });
        document.dispatchEvent(event);
    }
}