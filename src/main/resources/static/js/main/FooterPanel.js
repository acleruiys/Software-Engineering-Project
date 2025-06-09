import Component from "./Component.js";
import MemberUI from "../member/MemberUI.js";

export default class FooterPanel extends Component {
    setup() {
        this.state = {
            userInf: [
                { label: "회원번호", value: "A920945" },
                { label: "회원명", value: "홍길동" },
                { label: "잔여포인트", value: "13,200P" }
            ],
            leftButtons: ["회원 검색", "반품"],
            centerButtons: [
                "주방메모", "포장", "배달", "서비스", "할인",
                "수표조회", "영수증", "주문보류", "요청사항", "기타"
            ],
            rightButtons: ["분할/복합", "포인트", "현금", "카드"]
        };
        
        // 선택된 회원 정보를 수신하기 위한 이벤트 리스너 등록
        document.addEventListener('memberSelected', this.handleMemberSelected.bind(this));
        // 포인트 업데이트 이벤트 리스너 등록
        document.addEventListener('memberPointsUpdated', this.handleMemberPointsUpdated.bind(this));
    }

    template() {
        return `
      <div class="footer">
        <div class="user-inf">
          ${this.state.userInf.map(info => `
            <div class="user-label">${info.label}</div>
            <div class="user-value">${info.value}</div>
          `).join("")}
        </div>
        ${this.state.leftButtons.map(label => `<div class="footer-button left-button">${label}</div>`).join("")}
        <div class="footer-center-buttons">
          ${this.state.centerButtons.map(label => `<div class="footer-center-button">${label}</div>`).join("")}
        </div>
        ${this.state.rightButtons.map(label => `<div class="footer-button">${label}</div>`).join("")}
      </div>
      <div id="modal"></div>
    `;
    }

    setEvent() {
        this.$target.querySelectorAll(".footer-button").forEach(btn => {
            btn.addEventListener("click", () => {
                const btnText = btn.textContent.trim();

                if (btnText === "회원 검색") {
                    this.openMemberSearchModal();
                } else if (btnText === "반품") {
                    alert("반품 버튼이 클릭되었습니다.");
                } else if (btnText === "포인트") {
                    this.openPointModal();
                } else if (btnText === "현금" || btnText === "카드") {
                    import('../payment/HandlePayment.js').then(({ default: HandlePayment }) => {
                        const appInstance = window.__app__;
                        if (!appInstance) {
                            alert("App 인스턴스를 찾을 수 없습니다.");
                            return;
                        }

                        const handler = new HandlePayment({ appInstance });
                        handler.process(btnText === "현금" ? "CASH" : "CARD");
                    });
                }
            });
        });

        this.$target.querySelectorAll(".footer-center-button").forEach(btn => {
            btn.addEventListener("click", () => {
                const btnText = btn.textContent.trim();
                alert(`'${btnText}' 버튼이 클릭되었습니다.`);
            });
        });
    }
    
    // 회원 검색 모달 열기
    openMemberSearchModal() {
        const modal = document.getElementById('modal');
        const memberSearch = new MemberUI({ target: modal });
        // 초기 회원 목록 로드
        memberSearch.getAllMembers();
    }
    
    // 회원 선택 이벤트 처리
    handleMemberSelected(event) {
        const { memberId, name, phone, points } = event.detail;

        // 전역 저장 추가
        window.__selectedMember__ = event.detail;

        // 회원 정보 업데이트
        this.state.userInf = [
            { label: "회원번호", value: memberId },
            { label: "회원명", value: name },
            { label: "잔여포인트", value: `${parseInt(points).toLocaleString()}P` }
        ];
        
        // UI 업데이트
        this.render();
        this.setEvent();
        
        // 회원 선택 알림
        alert(`회원 ${name}님이 선택되었습니다.`);
    }

    // 포인트 업데이트 이벤트 처리
    handleMemberPointsUpdated(event) {
        const member = event.detail;
        this.updateMemberDisplay(member);
    }

    // 포인트 모달 열기
    openPointModal() {
        const modal = document.getElementById('modal');
        modal.innerHTML = '';

        import('../payment/Payment.js').then(({ default: Payment }) => {
            const billingComponent = window.__billingComponent__;
            if (!billingComponent) {
                alert('Billing 컴포넌트가 초기화되지 않았습니다.');
                return;
            }
            new Payment({ target: modal, billing: billingComponent });
        });
    }

    // 현금/카드 결제 처리 및 포인트 적립
    async processPayment(paymentMethod) {
        try {
            // 선택된 회원이 있는지 확인
            const selectedMember = window.__selectedMember__;
            if (!selectedMember) {
                alert(`${paymentMethod} 결제가 완료되었습니다.`);
                return;
            }

            // 총 결제 금액 확인
            const billingComponent = window.__billingComponent__;
            if (!billingComponent) {
                alert('결제 정보를 불러올 수 없습니다.');
                return;
            }

            // 총 결제 금액 가져오기 (할인이 적용된 최종 금액)
            const finalAmount = this.getFinalPaymentAmount();
            if (finalAmount <= 0) {
                alert('결제할 금액이 없습니다.');
                return;
            }

            // 포인트 적립 계산 (결제 금액의 1%)
            const earnedPoints = Math.floor(finalAmount * 0.01);

            if (earnedPoints > 0) {
                // 포인트 적립 확인 메시지
                const confirmEarn = confirm(
                    `${paymentMethod} 결제 완료!\n` +
                    `결제 금액: ${finalAmount.toLocaleString()}원\n` +
                    `적립 포인트: ${earnedPoints}P\n\n` +
                    `포인트를 적립하시겠습니까?`
                );

                if (confirmEarn) {
                    // 서버에 포인트 적립 요청
                    await this.updateMemberPoints(selectedMember.memberId, earnedPoints);
                    
                    // 회원 정보 업데이트
                    selectedMember.points += earnedPoints;
                    window.__selectedMember__ = selectedMember;
                    
                    // UI 회원 정보 업데이트
                    this.updateMemberDisplay(selectedMember);
                    
                    alert(`${paymentMethod} 결제가 완료되었습니다.\n${earnedPoints}P가 적립되었습니다.`);
                } else {
                    alert(`${paymentMethod} 결제가 완료되었습니다.`);
                }
            } else {
                alert(`${paymentMethod} 결제가 완료되었습니다.`);
            }

        } catch (error) {
            console.error('결제 처리 중 오류:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    }

    // 최종 결제 금액 계산
    getFinalPaymentAmount() {
        try {
            const billingComponent = window.__billingComponent__;
            if (!billingComponent || !billingComponent.state) {
                console.log('Billing 컴포넌트를 찾을 수 없습니다.');
                return 0;
            }

            // Billing 컴포넌트에서 직접 금액 계산
            const orderAmount = billingComponent.getAmount('주문금액');
            const discountAmount = billingComponent.getAmount('할인금액');
            const finalAmount = Math.max(orderAmount - discountAmount, 0);
            
            console.log(`주문금액: ${orderAmount}, 할인금액: ${discountAmount}, 최종금액: ${finalAmount}`);
            return finalAmount;

        } catch (error) {
            console.error('결제 금액 계산 오류:', error);
            return 0;
        }
    }

    // 회원 포인트 업데이트 API 호출
    async updateMemberPoints(memberId, pointsToAdd) {
        try {
            console.log(`포인트 적립 API 호출: /api/members/${memberId}/points`, {
                points: pointsToAdd,
                action: 'ADD'
            });

            const response = await fetch(`/api/members/${memberId}/points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    points: pointsToAdd,
                    action: 'ADD' // 포인트 적립
                })
            });

            console.log('포인트 적립 API 응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('포인트 적립 API 오류:', errorText);
                throw new Error(`포인트 적립 실패: ${response.status}`);
            }

            const result = await response.json();
            console.log('포인트 적립 API 성공:', result);
            return result;
        } catch (error) {
            console.error('포인트 업데이트 오류:', error);
            throw error;
        }
    }

    updateMemberDisplay(member) {
        this.state.userInf = [
            { label: "회원번호", value: member.memberId },
            { label: "회원명", value: member.name },
            { label: "잔여포인트", value: `${parseInt(member.points).toLocaleString()}P` }
        ];
        
        // UI 업데이트
        this.render();
        this.setEvent();
    }
    // FooterPanel.js 내부에 추가
    resetUserInf() {
        this.state.userInf = [
            { label: "회원번호", value: "-" },
            { label: "회원명", value: "-" },
            { label: "잔여포인트", value: "-" }
        ];
        this.render();
        this.setEvent();
    }
}