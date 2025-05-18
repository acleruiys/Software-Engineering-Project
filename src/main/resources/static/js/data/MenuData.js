export const categories = [
    { label: "커피", value: "COFFEE" },
    { label: "디카페인", value: "DECAF" },
    { label: "논커피<br>과일라떼", value: "NON_COFFEE" },
    { label: "티", value: "TEA" },
    { label: "스무디<br>프라페", value: "SMOOTHIE" },
    { label: "에이드<br>주스", value: "ADE" },
    { label: "시즌메뉴", value: "SEASON" },
    { label: "빵", value: "BREAD" },
    { label: "디저트", value: "DESSERT" },
    { label: "샌드위치", value: "SANDWICH" },
    { label: "MD상품", value: "MD" },
    { label: "세트메뉴", value: "SET" },
    { label: "케이크", value: "CAKE" },
    { label: "기타", value: "ETC" }
];

export const menuItems = {
    COFFEE: [
        { id: 'c1', name: "아메리카노", price: 3000 },
        { id: 'c2', name: "카페라떼", price: 5500 },
        { id: 'c3', name: "카푸치노", price: 5500 },
        { id: 'c4', name: "바닐라라떼", price: 5800 },
        { id: 'c5', name: "카라멜 마키아또", price: 5800 },
        { id: 'c6', name: "에스프레소", price: 2800 },
        { id: 'c7', name: "콜드브루", price: 5000 },
        { id: 'c8', name: "더치커피", price: 4800 },
        { id: 'c9', name: "헤이즐넛라떼", price: 5800 }
    ],
    DECAF: [
        { id: 'd1', name: "디카페인 아메리카노", price: 3500 },
        { id: 'd2', name: "디카페인 카페라떼", price: 6000 },
        { id: 'd3', name: "디카페인 바닐라라떼", price: 6300 }
    ],
    NON_COFFEE: [
        { id: 'n1', name: "딸기라떼", price: 6000 },
        { id: 'n2', name: "바나나라떼", price: 6000 },
        { id: 'n3', name: "초코라떼", price: 5500 },
        { id: 'n4', name: "녹차라떼", price: 5500 },
        { id: 'n5', name: "고구마라떼", price: 6000 }
    ],
    TEA: [
        { id: 't1', name: "녹차", price: 5000 },
        { id: 't2', name: "홍차", price: 5000 },
        { id: 't3', name: "캐모마일", price: 5000 },
        { id: 't4', name: "페퍼민트", price: 5000 },
        { id: 't5', name: "자스민티", price: 5000 },
        { id: 't6', name: "얼그레이", price: 5000 }
    ],
    SMOOTHIE: [
        { id: 's1', name: "망고스무디", price: 6500 },
        { id: 's2', name: "딸기스무디", price: 6500 },
        { id: 's3', name: "블루베리스무디", price: 6500 },
        { id: 's4', name: "요거트스무디", price: 6000 },
        { id: 's5', name: "그린티프라페", price: 6300 },
        { id: 's6', name: "초코프라페", price: 6300 }
    ],
    ADE: [
        { id: 'a1', name: "레몬에이드", price: 6000 },
        { id: 'a2', name: "자몽에이드", price: 6000 },
        { id: 'a3', name: "청포도에이드", price: 6000 },
        { id: 'a4', name: "오렌지주스", price: 5500 },
        { id: 'a5', name: "자몽주스", price: 5500 }
    ],
    SEASON: [
        { id: 'se1', name: "겨울한정 핫초코", price: 5500 },
        { id: 'se2', name: "토피넛라떼", price: 6300 },
        { id: 'se3', name: "크림브륄레라떼", price: 6300 }
    ],
    BREAD: [
        { id: 'b1', name: "크루아상", price: 4000 },
        { id: 'b2', name: "식빵", price: 3000 },
        { id: 'b3', name: "베이글", price: 3500 },
        { id: 'b4', name: "초코머핀", price: 4200 },
        { id: 'b5', name: "블루베리머핀", price: 4200 }
    ],
    DESSERT: [
        { id: 'de1', name: "마카롱", price: 2500 },
        { id: 'de2', name: "쿠키", price: 2000 },
        { id: 'de3', name: "와플", price: 5500 }
    ],
    SANDWICH: [
        { id: 'sa1', name: "햄치즈샌드위치", price: 5500 },
        { id: 'sa2', name: "에그샌드위치", price: 5300 },
        { id: 'sa3', name: "클럽샌드위치", price: 6000 }
    ],
    MD: [
        { id: 'm1', name: "텀블러", price: 15000 },
        { id: 'm2', name: "머그컵", price: 12000 },
        { id: 'm3', name: "원두 200g", price: 10000 }
    ],
    SET: [
        { id: 'st1', name: "아메리카노+크루아상", price: 6500 },
        { id: 'st2', name: "카페라떼+쿠키", price: 7000 }
    ],
    CAKE: [
        { id: 'ca1', name: "티라미수", price: 6500 },
        { id: 'ca2', name: "초코케이크", price: 6000 },
        { id: 'ca3', name: "치즈케이크", price: 6000 },
        { id: 'ca4', name: "당근케이크", price: 5800 }
    ],
    ETC: [
        { id: 'e1', name: "생수", price: 1500 },
        { id: 'e2', name: "탄산수", price: 2000 }
    ]
};

export default { categories, menuItems }; 