# AHP Predefined Alternative Matrices from HR Experts
# Values use Saaty fractions mirroring ahpDefaults.js on the frontend.
# Each matrix is NxN where N = number of alternatives for that group.
# Diagonal = 1, lower triangle = reciprocal of upper triangle.

AHP_ALTERNATIVE_MATRICES = {
    "PA_GIU_CHAN": {  # 7 sub-options
        # AI Result, Thu nhập, Hiệu suất, Hài lòng, Cân bằng, Cấp bậc
        "ai_result": [
            [1,      2/3,    1/2,    1/3,    2/3,    1/4,    1/3  ],
            [3/2,    1,      3/4,    1/2,    1,      1/3,    1/2  ],
            [2,      4/3,    1,      2/3,    4/3,    1/2,    2/3  ],
            [3,      2,      3/2,    1,      2,      3/4,    1    ],
            [3/2,    1,      3/4,    1/2,    1,      1/3,    1/2  ],
            [4,      3,      2,      4/3,    3,      1,      4/3  ],
            [3,      2,      3/2,    1,      2,      3/4,    1    ]
        ],
        "thu_nhap": [
            [1,      4/3,    2,      3,      3/2,    5/4,    3/2  ],
            [3/4,    1,      3/2,    5/2,    5/4,    1,      5/4  ],
            [1/2,    2/3,    1,      5/3,    4/5,    2/3,    4/5  ],
            [1/3,    2/5,    3/5,    1,      1/2,    2/5,    1/2  ],
            [2/3,    4/5,    5/4,    2,      1,      4/5,    1    ],
            [4/5,    1,      3/2,    5/2,    5/4,    1,      5/4  ],
            [2/3,    4/5,    5/4,    2,      1,      4/5,    1    ]
        ],
        "hieu_suat": [
            [1,      3/2,    1.5,    2,      1.2,    1.8,    1.5  ],
            [2/3,    1,      1,      1.5,    1,      1.4,    1.2  ],
            [1/1.5,  1,      1,      1.5,    1,      1.4,    1.2  ],
            [0.5,    1/1.5,  1/1.5,  1,      0.8,    1.2,    1    ],
            [1/1.2,  1,      1,      1/0.8,  1,      1.5,    1.2  ],
            [1/1.8,  1/1.4,  1/1.4,  1/1.2,  1/1.5,  1,      1    ],
            [1/1.5,  1/1.2,  1/1.2,  1,      1/1.2,  1,      1    ]
        ],
        "hai_long": [
            [1,      2/3,    1/2,    3/2,    2/3,    2,      4/3  ],
            [3/2,    1,      3/4,    9/4,    1,      3,      2    ],
            [2,      4/3,    1,      3,      4/3,    4,      8/3  ],
            [2/3,    4/9,    1/3,    1,      4/9,    4/3,    8/9  ],
            [3/2,    1,      3/4,    9/4,    1,      3,      2    ],
            [1/2,    1/3,    1/4,    3/4,    1/3,    1,      2/3  ],
            [3/4,    1/2,    3/8,    9/8,    1/2,    3/2,    1    ]
        ],
        "can_bang": [
            [1,      2/3,    1/2,    1,      1/2,    3/2,    3/4  ],
            [3/2,    1,      3/4,    3/2,    3/4,    9/4,    9/8  ],
            [2,      4/3,    1,      2,      1,      3,      3/2  ],
            [1,      2/3,    1/2,    1,      1/2,    3/2,    3/4  ],
            [2,      4/3,    1,      2,      1,      3,      3/2  ],
            [2/3,    4/9,    1/3,    2/3,    1/3,    1,      1/2  ],
            [4/3,    8/9,    2/3,    4/3,    2/3,    2,      1    ]
        ],
        "cap_bac": [
            [1,      3/4,    1/2,    5/4,    2/3,    5/3,    1    ],
            [4/3,    1,      2/3,    5/3,    8/9,    20/9,   4/3  ],
            [2,      3/2,    1,      5/2,    4/3,    10/3,   2    ],
            [4/5,    3/5,    2/5,    1,      8/15,   4/3,    4/5  ],
            [3/2,    9/8,    3/4,    15/8,   1,      5/2,    3/2  ],
            [3/5,    9/20,   3/10,   3/4,    2/5,    1,      3/5  ],
            [1,      3/4,    1/2,    5/4,    2/3,    5/3,    1    ]
        ]
    },
    "PA_THAY_THE": {
        "ai_result":  [[1,    2/3,  1/2],  [3/2, 1,    3/4], [2,   4/3,  1   ]],
        "thu_nhap":   [[1,    4/3,  3/2],  [3/4, 1,    5/4], [2/3, 4/5,  1   ]],
        "hieu_suat":  [[1,    1.5,  2  ],  [1/1.5, 1,   1.5], [0.5, 1/1.5, 1   ]],
        "hai_long":   [[1,    4/3,  2/3],  [3/4, 1,    1/2], [3/2, 2,    1   ]],
        "can_bang":   [[1,    2/3,  1/3],  [3/2, 1,    1/2], [3,   2,    1   ]],
        "cap_bac":    [[1,    3/4,  3/2],  [4/3, 1,    2  ], [2/3, 1/2,  1   ]]
    },
    "PA_NUOI_DUONG": {
        "ai_result":  [[1,    3/4,  3/2],  [4/3, 1,    2  ], [2/3, 1/2,  1   ]],
        "thu_nhap":   [[1,    2/3,  3/4],  [3/2, 1,    5/4], [4/3, 4/5,  1   ]],
        "hieu_suat":  [[1,    4/3,  5/3],  [3/4, 1,    5/4], [3/5, 4/5,  1   ]],
        "hai_long":   [[1,    5/4,  5/3],  [4/5, 1,    4/3], [3/5, 3/4,  1   ]],
        "can_bang":   [[1,    3/4,  5/3],  [4/3, 1,    7/3], [3/5, 3/7,  1   ]],
        "cap_bac":    [[1,    4/5,  5/4],  [5/4, 1,    3/2], [4/5, 2/3,  1   ]]
    },
    "PA_ON_DINH": {
        "ai_result":  [[1,    3/2,  3/4],  [2/3, 1,    1/2], [4/3, 2,    1   ]],
        "thu_nhap":   [[1,    5/4,  4/3],  [4/5, 1,    5/4], [3/4, 4/5,  1   ]],
        "hieu_suat":  [[1,    4/3,  3/2],  [3/4, 1,    5/4], [2/3, 4/5,  1   ]],
        "hai_long":   [[1,    3/4,  2/3],  [4/3, 1,    3/4], [3/2, 4/3,  1   ]],
        "can_bang":   [[1,    5/4,  3/2],  [4/5, 1,    5/4], [2/3, 4/5,  1   ]],
        "cap_bac":    [[1,    3/4,  5/4],  [4/3, 1,    5/3], [4/5, 3/5,  1   ]]
    },
    "PA_PHONG_NGUA": {
        "ai_result":  [[1,    3/4,  1/2],  [4/3, 1,    2/3], [2,   3/2,  1   ]],
        "thu_nhap":   [[1,    5/4,  3/2],  [4/5, 1,    5/4], [2/3, 4/5,  1   ]],
        "hieu_suat":  [[1,    4/3,  1/2],  [3/4, 1,    3/8], [2,   8/3,  1   ]],
        "hai_long":   [[1,    5/4,  2/3],  [4/5, 1,    1/2], [3/2, 2,    1   ]],
        "can_bang":   [[1,    3/4,  1/3],  [4/3, 1,    4/9], [3,   9/4,  1   ]],
        "cap_bac":    [[1,    3/5,  3/4],  [5/3, 1,    5/4], [4/3, 4/5,  1   ]]
    }
}

STRATEGY_GROUPS = {
    "PA_GIU_CHAN": {
        "name": "🔴 GIỮ CHÂN KHẨN CẤP",
        "options": [
            {"id": "PA1", "name": "Đòn bẩy Tài chính", "detail": "Tăng lương 15-20%"},
            {"id": "PA2", "name": "Đòn bẩy Sự nghiệp", "detail": "Thăng chức + Tăng lương 10%"},
            {"id": "PA3", "name": "Đòn bẩy Phúc lợi", "detail": "Remote/Hybrid + Tăng 8%"},
            {"id": "PA4", "name": "Giảm tải", "detail": "Giảm Overtime + Bonus"},
            {"id": "PA5", "name": "Phát triển", "detail": "Đào tạo nâng cao"},
            {"id": "PA6", "name": "Thách thức mới", "detail": "Chuyển dự án mới"},
            {"id": "PA7", "name": "Định hướng", "detail": "Mentor 1-1 + Career path"},
        ]
    },
    "PA_THAY_THE": {
        "name": "🟠 THAY THẾ",
        "options": [
            {"id": "PA1", "name": "Kích hoạt tuyển dụng", "detail": "Đăng tuyển thay thế ngay"},
            {"id": "PA2", "name": "Kế hoạch bàn giao", "detail": "Lập roadmap bàn giao 30 ngày"},
            {"id": "PA3", "name": "Backup nội bộ", "detail": "Tìm và đào tạo người backup"},
        ]
    },
    "PA_NUOI_DUONG": {
        "name": "🟢 NUÔI DƯỠNG",
        "options": [
            {"id": "PA1", "name": "Talent Pool", "detail": "Quy hoạch lãnh đạo kế cận"},
            {"id": "PA2", "name": "Đào tạo cao cấp", "detail": "Training & Certification"},
            {"id": "PA3", "name": "Vinh danh", "detail": "Khen thưởng & Recognition"},
        ]
    },
    "PA_ON_DINH": {
        "name": "🔵 ỔN ĐỊNH",
        "options": [
            {"id": "PA1", "name": "Duy trì phúc lợi", "detail": "Giữ nguyên chính sách hiện tại"},
            {"id": "PA2", "name": "Check-in định kỳ", "detail": "1-on-1 hàng quý"},
            {"id": "PA3", "name": "Phát triển nhẹ", "detail": "Khóa học kỹ năng cơ bản"},
        ]
    },
    "PA_PHONG_NGUA": {
        "name": "🟡 PHÒNG NGỪA",
        "options": [
            {"id": "PA1", "name": "Stay Interview", "detail": "Đối thoại 1-1 chuyên sâu"},
            {"id": "PA2", "name": "Khảo sát tâm lý", "detail": "Pulse survey ẩn danh"},
            {"id": "PA3", "name": "Cải thiện môi trường", "detail": "Điều chỉnh điều kiện làm việc"},
        ]
    }
}
