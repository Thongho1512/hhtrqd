// AHP default alternative matrices: 5 strategy groups × 6 criteria
// Alternatives (5): GIỮ CHÂN, THAY THẾ, NUÔI DƯỠNG, ỔN ĐỊNH, PHÒNG NGỪA
// Each criterion has a 5×5 pairwise comparison matrix.
// Values: Saaty fractions (1, 3/2, 5/4, 2/3, 3/4 ...), reciprocal-consistent.

const r = (n, d) => n / d;

// Ordering of rows/cols: [GIU_CHAN, THAY_THE, NUOI_DUONG, ON_DINH, PHONG_NGUA]

export const AHP_DEFAULT_MATRICES = {
    // Kết quả AI
    ai_result: [
        /* GIU  */ [1,      r(3,2), 2,      r(5,2), 3      ],
        /* THAY */ [r(2,3), 1,      r(4,3), r(5,3), 2      ],
        /* NUOI */ [r(1,2), r(3,4), 1,      r(5,4), r(3,2) ],
        /* ON   */ [r(2,5), r(3,5), r(4,5), 1,      r(5,4) ],
        /* PHONG*/ [r(1,3), r(1,2), r(2,3), r(4,5), 1      ]
    ],
    // Thu nhập hàng tháng
    thu_nhap: [
        /* GIU  */ [1,      r(5,4), r(5,2), r(5,3), r(5,4) ],
        /* THAY */ [r(4,5), 1,      2,      r(4,3), 1      ],
        /* NUOI */ [r(2,5), r(1,2), 1,      r(2,3), r(1,2) ],
        /* ON   */ [r(3,5), r(3,4), r(3,2), 1,      r(3,4) ],
        /* PHONG*/ [r(4,5), 1,      2,      r(4,3), 1      ]
    ],
    // Hiệu suất công việc
    hieu_suat: [
        /* GIU  */ [1,      r(2,3), r(1,2), r(2,5), r(1,3) ],
        /* THAY */ [r(3,2), 1,      r(3,4), r(3,5), r(1,2) ],
        /* NUOI */ [2,      r(4,3), 1,      r(4,5), r(2,3) ],
        /* ON   */ [r(5,2), r(5,3), r(5,4), 1,      r(5,6) ],
        /* PHONG*/ [3,      2,      r(3,2), r(6,5), 1      ]
    ],
    // Mức độ hài lòng công việc
    hai_long: [
        /* GIU  */ [1,      3,      r(5,2), r(5,3), r(5,2) ],
        /* THAY */ [r(1,3), 1,      r(5,6), r(5,9), r(5,6) ],
        /* NUOI */ [r(2,5), r(6,5), 1,      r(2,3), 1      ],
        /* ON   */ [r(3,5), r(9,5), r(3,2), 1,      r(3,2) ],
        /* PHONG*/ [r(2,5), r(6,5), 1,      r(2,3), 1      ]
    ],
    // Cân bằng cuộc sống
    can_bang: [
        /* GIU  */ [1,      r(4,3), r(1,2), r(2,3), r(1,2) ],
        /* THAY */ [r(3,4), 1,      r(3,8), r(1,2), r(3,8) ],
        /* NUOI */ [2,      r(8,3), 1,      r(4,3), 1      ],
        /* ON   */ [r(3,2), 2,      r(3,4), 1,      r(3,4) ],
        /* PHONG*/ [2,      r(8,3), 1,      r(4,3), 1      ]
    ],
    // Cấp bậc nhân viên
    cap_bac: [
        /* GIU  */ [1,      r(5,3), r(2,3), 1,      r(2,3) ],
        /* THAY */ [r(3,5), 1,      r(2,5), r(3,5), r(2,5) ],
        /* NUOI */ [r(3,2), r(5,2), 1,      r(3,2), 1      ],
        /* ON   */ [1,      r(5,3), r(2,3), 1,      r(2,3) ],
        /* PHONG*/ [r(3,2), r(5,2), 1,      r(3,2), 1      ]
    ]
};

// The 5 alternatives (strategy groups) in order
export const AHP_ALTERNATIVES = [
    { id: 'PA_GIU_CHAN',    name: 'Giữ chân khẩn cấp',  icon: '🔴', detail: 'Retention với đãi ngộ tức thì' },
    { id: 'PA_THAY_THE',   name: 'Thay thế',            icon: '🟠', detail: 'Tuyển người mới / bàn giao' },
    { id: 'PA_NUOI_DUONG', name: 'Nuôi dưỡng',          icon: '🟢', detail: 'Phát triển tài năng dài hạn' },
    { id: 'PA_ON_DINH',    name: 'Ổn định',              icon: '🔵', detail: 'Duy trì và theo dõi' },
    { id: 'PA_PHONG_NGUA', name: 'Phòng ngừa',          icon: '🟡', detail: 'Chủ động ngăn chặn rủi ro' },
];
