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
        const isPointOnly = type === 'POINT' && finalAmount === 0;
        const earnedPoint = (!window.__selectedMember__ || isPointOnly) ? 0 : Math.floor(finalAmount * 0.01);

        const menus = orderList.map(item => ({
            menuId: item.id,
            quantity: item.quantity,
            price: item.totalPrice,
            optionId: []
        }));

        const payments = [];

        if (isPointOnly) {
            payments.push({
                payment: 'POINT',
                price: discountAmount
            });
        } else {
            if (discountAmount > 0) {
                payments.push({
                    payment: 'POINT',
                    price: discountAmount
                });
            }
            if (finalAmount > 0) {
                payments.push({
                    payment: type,
                    price: finalAmount
                });
            }
        }

        const paymentData = {
            memberId: window.__selectedMember__?.memberId || null,
            menus,
            payments,
            totalPrice: orderAmount,
            usedPoint: discountAmount,
            earnedPoint: earnedPoint
        };

        console.log('[결제 전송 데이터]', paymentData);

        fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        })
            .then(res => {
                if (!res.ok) throw new Error('결제 실패');

                let alertMessage = '';
                if (isPointOnly) {
                    alertMessage = `포인트로 전액 결제가 완료되었습니다.`;
                    if (earnedPoint > 0) {
                        alertMessage += `\n적립: ${earnedPoint.toLocaleString()}P`;
                    }
                } else {
                    alertMessage = `${type === 'CASH' ? '현금' : '카드'} 결제가 완료되었습니다.`;
                    if (discountAmount > 0) {
                        alertMessage += `\n포인트 ${discountAmount.toLocaleString()}P 사용`;
                    }
                    if (finalAmount > 0) {
                        alertMessage += `\n결제 금액: ${finalAmount.toLocaleString()}원`;
                    }
                    if (earnedPoint > 0) {
                        alertMessage += `\n적립: ${earnedPoint.toLocaleString()}P`;
                    }
                }

                alert(alertMessage);

                setTimeout(() => {
                    const footerPanel = this.app.footerPanelComponent;

                    window.__orderList__ = [];
                    window.__selectedMember__ = null;
                    window.__passwordVerifiedForMember__ = null;

                    this.app.setState({
                        orderList: [],
                        selectedOrderItemId: null
                    });

                    orderListComponent.setState({ orders: [] });
                    billing.updateOrderAmount(0);
                    billing.updateDiscountAmount(0);
                    totalBilling.updateTotal(0, 0, 0);

                    footerPanel.resetUserInf();
                }, 0);
            })
            .catch(err => {
                console.error('결제 실패:', err);
                alert('결제 처리 중 오류가 발생했습니다.');
            });
    }
}