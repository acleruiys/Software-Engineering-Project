import Component from '../main/Component.js';
import MemberSearchPopup from './MemberSearchPopup.js';

export default class MemberPopupManager extends Component {
    setup() {
        this.state = {
            selectedMember: null
        };
    }

    template() {
        return `
            <div class="member-popup-container"></div>
        `;
    }

    mounted() {
        // 렌더링이 완료된 후에 MemberSearchPopup 인스턴스를 생성
        setTimeout(() => {
            this.memberSearchPopup = new MemberSearchPopup({
                target: this.$target
            });

            // 회원 선택 이벤트 리스너
            this.memberSearchPopup.on('member-selected', (member) => {
                this.state.selectedMember = member;
                
                // 회원 선택 콜백 호출 (외부에서 설정 가능)
                if (this.onMemberSelected) {
                    this.onMemberSelected(member);
                }
            });
        }, 0);
    }
    
    // 팝업 열기
    openPopup() {
        if (this.memberSearchPopup) {
            this.memberSearchPopup.open();
        } else {
            console.error('회원 검색 팝업이 아직 초기화되지 않았습니다.');
            
            // 팝업이 초기화되지 않았으면 초기화 후 열기 시도
            setTimeout(() => {
                if (this.memberSearchPopup) {
                    this.memberSearchPopup.open();
                } else {
                    alert('회원 검색 팝업을 초기화할 수 없습니다. 페이지를 새로고침하세요.');
                }
            }, 100);
        }
    }
    
    // 선택한 회원 가져오기
    getSelectedMember() {
        return this.state.selectedMember;
    }
    
    // 회원 선택 콜백 설정
    setOnMemberSelected(callback) {
        this.onMemberSelected = callback;
    }
} 