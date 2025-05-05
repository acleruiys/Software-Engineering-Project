/**
 * 해당 년도와 월의 일 수를 반환
 * @param {number} year
 * @param {number} month
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * 날짜를 yyyy-mm-dd 문자열로 포맷
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
export function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

/**
 * 특정 날짜의 요일을 반환 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {number}
 */
export function getDayOfWeek(year, month, day) {
    const date = new Date(year, month - 1, day); // 월은 0부터 시작하므로 month - 1
    return date.getDay(); // 0 (일요일) ~ 6 (토요일)
}

