// Payment.js (수정본)

export default class Payment {
    constructor({ target, billing }) {
        this.target = target;
        this.billing = billing; // Billing 컴포넌트 인스턴스
        this.selectedMember = null;
        this.render();
        this.initListeners();
    }

    render() {
        this.target.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-content">
                    <div class="modal-header">
                        <h2>결제</h2>
                        <button class="close-button">&times;</button>
                    </div>
                    <div id="payment-options">
                        <button id="pointPayBtn">포인트</button>
                        <button id="cashPayBtn">현금</button>
                        <button id="cardPayBtn">카드</button>
                    </div>
                    <div id="payment-area"></div>
                </div>
            </div>
        `;
    }

    initListeners() {
        this.target.querySelector('.close-button').addEventListener('click', () => this.close());

        this.target.querySelector('#pointPayBtn').addEventListener('click', () => this.handlePoint());
        this.target.querySelector('#cashPayBtn').addEventListener('click', () => this.handleCash());
        this.target.querySelector('#cardPayBtn').addEventListener('click', () => this.handleCard());

        document.addEventListener('memberSelected', (e) => {
            this.selectedMember = e.detail;
        });
    }

    close() {
        this.target.innerHTML = '';
    }

    handlePoint() {
        if (!this.selectedMember) {
            alert('먼저 회원을 선택해주세요.');
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

            try {
                const res = await fetch(`/api/members/${this.selectedMember.memberId}/verify?pw=${inputPwd}`);
                if (res.ok) {
                    document.getElementById('pointInputArea').style.display = 'block';
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            } catch (err) {
                alert('서버 오류 또는 연결 실패');
                console.error(err);
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

    handleCash() {
        const total = this.billing.getAmount('주문금액') - this.billing.getAmount('할인금액');
        alert(`${total.toLocaleString()}원이 현금으로 결제되었습니다.`);
        this.close();
    }

    handleCard() {
        const area = this.target.querySelector('#payment-area');
        area.innerHTML = `<p>카드를 삽입해주세요...</p><div id="card-loading">⏳</div>`;

        setTimeout(() => {
            const total = this.billing.getAmount('주문금액') - this.billing.getAmount('할인금액');
            alert(`${total.toLocaleString()}원이 카드로 결제되었습니다.`);
            this.close();
        }, 3000);
    }
}
