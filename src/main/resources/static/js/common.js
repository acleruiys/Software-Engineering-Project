// 시계 업데이트 함수
function updateClock() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}

// 옵션 가격
const optionPrices = {
    size: {
        SMALL: 0,
        MEDIUM: 500,
        LARGE: 1000
    },
    syrup: {
        NONE: 0,
        VANILLA: 500,
        HAZELNUT: 500,
        CARAMEL: 500
    }
};

export { updateClock, optionPrices }; 