import Component from "../main/Component.js";

export default class PaymentModal extends Component {
    setup() {
        this.state = {
            paymentType: '',
            totalAmount: 0,
            userInf: [],
            orderItems: []
        };
    }

    template() {
        if (this.state.paymentType === "현금") {
            return this.cashPaymentTemplate();
        } else if (this.state.paymentType === "카드") {
            return this.cardPaymentTemplate();
        } else if (this.state.paymentType === "포인트") {
            return this.pointPaymentTemplate();
        } else if (this.state.paymentType === "분할/복합") {
            return this.splitPaymentTemplate();
        }
        return '';
    }

    // 현금 결제 템플릿
    cashPaymentTemplate() {
        return `
            <div class="payment-modal">
                <div class="payment-header">
                    <h2>현금 결제</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="payment-body">
                    <div class="payment-info">
                        <div class="payment-row">
                            <span>결제 금액:</span>
                            <span>${this.state.totalAmount.toLocaleString()}원</span>
                        </div>
                        <div class="payment-row">
                            <span>받은 금액:</span>
                            <input type="number" class="received-amount" value="${this.state.totalAmount}">
                        </div>
                        <div class="payment-row">
                            <span>거스름돈:</span>
                            <span class="change-amount">0원</span>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="cancel-payment">취소</button>
                        <button class="confirm-payment">결제 완료</button>
                    </div>
                </div>
            </div>
        `;
    }

    // 카드 결제 템플릿
    cardPaymentTemplate() {
        return `
            <div class="payment-modal">
                <div class="payment-header">
                    <h2>카드 결제</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="payment-body">
                    <div class="payment-info">
                        <div class="payment-row">
                            <span>결제 금액:</span>
                            <span>${this.state.totalAmount.toLocaleString()}원</span>
                        </div>
                        <div class="payment-row">
                            <span>카드 번호:</span>
                            <input type="text" class="card-number" placeholder="카드번호 입력">
                        </div>
                        <div class="payment-row">
                            <span>할부 개월:</span>
                            <select class="installment">
                                <option value="0">일시불</option>
                                <option value="2">2개월</option>
                                <option value="3">3개월</option>
                                <option value="6">6개월</option>
                            </select>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="cancel-payment">취소</button>
                        <button class="confirm-payment">결제 완료</button>
                    </div>
                </div>
            </div>
        `;
    }

    // 포인트 결제 템플릿
    pointPaymentTemplate() {
        // 사용 가능한 포인트 파싱
        const pointsInfo = this.state.userInf.find(info => info.label === "잔여포인트");
        const availablePoints = parseInt(pointsInfo.value.replace(/[^0-9]/g, "")) || 0;

        return `
            <div class="payment-modal">
                <div class="payment-header">
                    <h2>포인트 결제</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="payment-body">
                    <div class="payment-info">
                        <div class="payment-row">
                            <span>결제 금액:</span>
                            <span>${this.state.totalAmount.toLocaleString()}원</span>
                        </div>
                        <div class="payment-row">
                            <span>사용 가능한 포인트:</span>
                            <span>${availablePoints.toLocaleString()}P</span>
                        </div>
                        <div class="payment-row">
                            <span>사용할 포인트:</span>
                            <input type="number" class="use-points" value="${Math.min(availablePoints, this.state.totalAmount)}">
                        </div>
                        <div class="payment-row">
                            <span>잔여 결제 금액:</span>
                            <span class="remaining-amount">${Math.max(0, this.state.totalAmount - Math.min(availablePoints, this.state.totalAmount)).toLocaleString()}원</span>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="cancel-payment">취소</button>
                        <button class="confirm-payment">결제 완료</button>
                    </div>
                </div>
            </div>
        `;
    }

    // 분할/복합 결제 템플릿
    splitPaymentTemplate() {
        return `
            <div class="payment-modal split-payment-modal">
                <div class="payment-header">
                    <h2>분할/복합 결제</h2>
                    <button class="close-btn">×</button>
                </div>
                <div class="payment-body">
                    <div class="payment-info">
                        <div class="payment-row">
                            <span>총 결제 금액:</span>
                            <span>${this.state.totalAmount.toLocaleString()}원</span>
                        </div>
                        <div class="payment-row">
                            <span>현금 결제:</span>
                            <input type="number" class="cash-amount" value="0">
                        </div>
                        <div class="payment-row">
                            <span>카드 결제:</span>
                            <input type="number" class="card-amount" value="0">
                        </div>
                        <div class="payment-row">
                            <span>포인트 결제:</span>
                            <input type="number" class="point-amount" value="0">
                        </div>
                        <div class="payment-row">
                            <span>남은 금액:</span>
                            <span class="remaining-total">${this.state.totalAmount.toLocaleString()}원</span>
                        </div>
                    </div>
                    <div class="payment-buttons">
                        <button class="cancel-payment">취소</button>
                        <button class="confirm-payment">결제 완료</button>
                    </div>
                </div>
            </div>
        `;
    }

    setEvent() {
        // 닫기 버튼
        this.$target.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // 취소 버튼
        this.$target.querySelector('.cancel-payment').addEventListener('click', () => {
            this.closeModal();
        });

        // 결제 완료 버튼
        this.$target.querySelector('.confirm-payment').addEventListener('click', () => {
            this.processPayment();
            this.closeModal();
        });

        // 결제 타입별 이벤트 설정
        if (this.state.paymentType === "현금") {
            this.setCashPaymentEvents();
        } else if (this.state.paymentType === "포인트") {
            this.setPointPaymentEvents();
        } else if (this.state.paymentType === "분할/복합") {
            this.setSplitPaymentEvents();
        }
    }

    // 현금 결제 이벤트 설정
    setCashPaymentEvents() {
        const receivedInput = this.$target.querySelector('.received-amount');
        const changeDisplay = this.$target.querySelector('.change-amount');
        
        receivedInput.addEventListener('input', () => {
            const received = parseInt(receivedInput.value) || 0;
            const change = received - this.state.totalAmount;
            changeDisplay.textContent = `${change > 0 ? change.toLocaleString() : 0}원`;
        });
    }

    // 포인트 결제 이벤트 설정
    setPointPaymentEvents() {
        const pointsInput = this.$target.querySelector('.use-points');
        const remainingDisplay = this.$target.querySelector('.remaining-amount');
        
        // 사용 가능한 포인트 파싱
        const pointsInfo = this.state.userInf.find(info => info.label === "잔여포인트");
        const availablePoints = parseInt(pointsInfo.value.replace(/[^0-9]/g, "")) || 0;
        
        pointsInput.addEventListener('input', () => {
            const points = parseInt(pointsInput.value) || 0;
            if (points > availablePoints) {
                alert('사용 가능한 포인트를 초과할 수 없습니다.');
                pointsInput.value = availablePoints;
                return;
            }
            const remaining = Math.max(0, this.state.totalAmount - points);
            remainingDisplay.textContent = `${remaining.toLocaleString()}원`;
        });
    }

    // 분할/복합 결제 이벤트 설정
    setSplitPaymentEvents() {
        const cashInput = this.$target.querySelector('.cash-amount');
        const cardInput = this.$target.querySelector('.card-amount');
        const pointInput = this.$target.querySelector('.point-amount');
        const remainingDisplay = this.$target.querySelector('.remaining-total');
        
        const updateRemaining = () => {
            const cash = parseInt(cashInput.value) || 0;
            const card = parseInt(cardInput.value) || 0;
            const point = parseInt(pointInput.value) || 0;
            const total = cash + card + point;
            const remaining = Math.max(0, this.state.totalAmount - total);
            
            remainingDisplay.textContent = `${remaining.toLocaleString()}원`;
            
            // 금액이 초과되면 경고
            if (total > this.state.totalAmount) {
                alert('결제 금액이 총액을 초과할 수 없습니다.');
                return false;
            }
            return true;
        };
        
        cashInput.addEventListener('input', updateRemaining);
        cardInput.addEventListener('input', updateRemaining);
        pointInput.addEventListener('input', updateRemaining);
    }

    // 결제 처리
    processPayment() {
        if (this.state.paymentType === "현금") {
            this.processCashPayment();
        } else if (this.state.paymentType === "카드") {
            this.processCardPayment();
        } else if (this.state.paymentType === "포인트") {
            this.processPointPayment();
        } else if (this.state.paymentType === "분할/복합") {
            this.processSplitPayment();
        }
    }

    // 현금 결제 처리
    processCashPayment() {
        const receivedInput = this.$target.querySelector('.received-amount');
        const received = parseInt(receivedInput.value) || 0;
        
        if (received < this.state.totalAmount) {
            alert("받은 금액이 결제 금액보다 작습니다.");
            return;
        }
        
        const change = received - this.state.totalAmount;
        const message = `현금 결제가 완료되었습니다.\n받은 금액: ${received.toLocaleString()}원\n거스름돈: ${change.toLocaleString()}원`;
        
        alert(message);
        this.completePayment();
    }
    
    // 카드 결제 처리
    processCardPayment() {
        const message = `카드 결제가 완료되었습니다.\n결제 금액: ${this.state.totalAmount.toLocaleString()}원`;
        alert(message);
        this.completePayment();
    }
    
    // 포인트 결제 처리
    processPointPayment() {
        const pointsInput = this.$target.querySelector('.use-points');
        const points = parseInt(pointsInput.value) || 0;
        
        // 잔여 포인트로 커버되지 않는 금액 계산
        const remaining = Math.max(0, this.state.totalAmount - points);
        
        // 결제 완료 이벤트 발생
        const paymentCompleteEvent = new CustomEvent('paymentComplete', {
            detail: {
                type: '포인트',
                amount: points,
                remaining: remaining
            }
        });
        document.dispatchEvent(paymentCompleteEvent);
        
        if (remaining > 0) {
            alert(`포인트 ${points.toLocaleString()}P가 사용되었습니다.\n잔여 결제 금액: ${remaining.toLocaleString()}원`);
        } else {
            alert(`포인트 결제가 완료되었습니다.\n사용 포인트: ${points.toLocaleString()}P`);
            this.completePayment();
        }
    }
    
    // 분할/복합 결제 처리
    processSplitPayment() {
        const cashInput = this.$target.querySelector('.cash-amount');
        const cardInput = this.$target.querySelector('.card-amount');
        const pointInput = this.$target.querySelector('.point-amount');
        
        const cash = parseInt(cashInput.value) || 0;
        const card = parseInt(cardInput.value) || 0;
        const point = parseInt(pointInput.value) || 0;
        const total = cash + card + point;
        
        if (total < this.state.totalAmount) {
            alert(`결제 금액이 부족합니다.\n총 결제액: ${total.toLocaleString()}원\n부족 금액: ${(this.state.totalAmount - total).toLocaleString()}원`);
            return;
        }
        
        if (total > this.state.totalAmount) {
            alert(`결제 금액이 총액을 초과합니다.`);
            return;
        }
        
        // 결제 완료 이벤트 발생
        const paymentCompleteEvent = new CustomEvent('paymentComplete', {
            detail: {
                type: '복합',
                cash: cash,
                card: card,
                point: point,
                total: total
            }
        });
        document.dispatchEvent(paymentCompleteEvent);
        
        let message = "분할 결제가 완료되었습니다.\n";
        if (cash > 0) message += `현금: ${cash.toLocaleString()}원\n`;
        if (card > 0) message += `카드: ${card.toLocaleString()}원\n`;
        if (point > 0) message += `포인트: ${point.toLocaleString()}P\n`;
        
        alert(message);
        this.completePayment();
    }
    
    // 결제 완료 처리
    completePayment() {
        // 주문 초기화 이벤트 발생
        document.dispatchEvent(new CustomEvent('orderReset'));
    }
    
    // 모달 닫기
    closeModal() {
        this.$target.classList.remove('active');
    }
    
    // 결제 모달 열기
    open(paymentType, totalAmount, userInf, orderItems) {
        this.state.paymentType = paymentType;
        this.state.totalAmount = totalAmount;
        this.state.userInf = userInf;
        this.state.orderItems = orderItems;
        
        this.render();
        this.$target.classList.add('active');
    }
} 