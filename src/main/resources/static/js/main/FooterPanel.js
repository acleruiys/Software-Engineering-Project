import Component from "./Component.js";
import MemberSearch from "../member/MemberSearch.js";

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
                } else {
                    alert(`'${btnText}' 버튼이 클릭되었습니다.`);
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
        const memberSearch = new MemberSearch({ target: modal });
        // 초기 회원 목록 로드
        memberSearch.getAllMembers();
    }
    
    // 회원 선택 이벤트 처리
    handleMemberSelected(event) {
        const { memberId, name, phone, points } = event.detail;
        
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
}