// payment/HandlePayment.js

export default class HandlePayment {
    constructor({ appInstance }) {
        this.app = appInstance;
    }

    process(type) {
        const billing = this.app.billingComponent;
        const totalBilling = this.app.totalBillingComponent;
        const orderListComponent = this.app.orderListComponent;
        const orderList = [...this.app.state.orderList];

        if (orderList.length === 0) {
            alert('주문 내역이 없습니다.');
            return;
        }

        const orderAmount = billing.getAmount('주문금액');
        const discountAmount = billing.getAmount('할인금액');
        const finalAmount = orderAmount - discountAmount;
        const earnedPoint = window.__selectedMember__ ? Math.floor(finalAmount * 0.01) : 0;

        const menus = orderList.map(item => ({
            menuId: item.id,
            quantity: item.quantity,
            price: item.totalPrice,
            optionId: []
        }));

        const payments = [{
            payment: type,
            price: finalAmount
        }];

        const paymentData = {
            memberId: window.__selectedMember__?.memberId || null,
            menus,
            payments,
            totalPrice: finalAmount,
            earnedPoint
        };

        console.log('[결제 전송 데이터]', paymentData);
        console.log("paymentData 전송 내용:", JSON.stringify(paymentData, null, 2));
        console.log(`[포인트 적립] 회원: ${window.__selectedMember__?.name || '비회원'}, 적립 포인트: ${earnedPoint}P`);


        fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        })
            .then(res => {
                if (!res.ok) throw new Error('결제 실패');

                // 알림 메시지 만들기
                let alertMessage = `${type === 'CASH' ? '현금' : '카드'} 결제가 완료되었습니다.`;
                if (earnedPoint > 0) {
                    alertMessage += `\n${earnedPoint.toLocaleString()}P가 적립되었습니다.`;
                }

                alert(alertMessage);

                // 타이밍 보정
                setTimeout(() => {
                    const footerPanel = this.app.footerPanelComponent;

                    window.__orderList__ = [];
                    window.__selectedMember__ = null;

                    this.app.setState({
                        orderList: [],
                        selectedOrderItemId: null
                    });

                    orderListComponent.setState({ orders: [] });
                    billing.updateOrderAmount(0);
                    billing.updateDiscountAmount(0);
                    totalBilling.updateTotal(0, 0, 0);

                    footerPanel.resetUserInf(); // ← 항상 초기 상태로 리셋
                }, 0);
            })
            .catch(err => {
                console.error('결제 실패:', err);
                alert('결제 처리 중 오류가 발생했습니다.');
            });
    }
}