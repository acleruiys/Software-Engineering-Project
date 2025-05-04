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
