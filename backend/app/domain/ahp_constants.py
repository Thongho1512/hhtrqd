# AHP Predefined Alternative Matrices from HR Experts
# Values use Saaty fractions mirroring ahpDefaults.js on the frontend.
# Each matrix is NxN where N = number of alternatives for that group.
# Diagonal = 1, lower triangle = reciprocal of upper triangle.

AHP_ALTERNATIVE_MATRICES = {
    "PA_GIU_CHAN": {  # 7 sub-options
        # PA1=Tài chính, PA2=Sự nghiệp, PA3=Phúc lợi, PA4=Giảm tải,
        # PA5=Phát triển, PA6=Thách thức, PA7=Định hướng
        "chi_phi": [
            [1,      2/3,    1/2,    1/3,    2/3,    1/4,    1/3  ],
            [3/2,    1,      3/4,    1/2,    1,      1/3,    1/2  ],
            [2,      4/3,    1,      2/3,    4/3,    1/2,    2/3  ],
            [3,      2,      3/2,    1,      2,      3/4,    1    ],
            [3/2,    1,      3/4,    1/2,    1,      1/3,    1/2  ],
            [4,      3,      2,      4/3,    3,      1,      4/3  ],
            [3,      2,      3/2,    1,      2,      3/4,    1    ]
        ],
        "thoi_gian": [
            [1,      4/3,    2,      3,      3/2,    5/4,    3/2  ],
            [3/4,    1,      3/2,    5/2,    5/4,    1,      5/4  ],
            [1/2,    2/3,    1,      5/3,    4/5,    2/3,    4/5  ],
            [1/3,    2/5,    3/5,    1,      1/2,    2/5,    1/2  ],
            [2/3,    4/5,    5/4,    2,      1,      4/5,    1    ],
            [4/5,    1,      3/2,    5/2,    5/4,    1,      5/4  ],
            [2/3,    4/5,    5/4,    2,      1,      4/5,    1    ]
        ],
        "do_phuc_tap": [
            [1,      3/2,    5/3,    3,      3/2,    2,      4/3  ],
            [2/3,    1,      4/3,    2,      1,      4/3,    1    ],
            [3/5,    3/4,    1,      3/2,    3/4,    1,      3/4  ],
            [1/3,    1/2,    2/3,    1,      1/2,    2/3,    1/2  ],
            [2/3,    1,      4/3,    2,      1,      4/3,    1    ],
            [1/2,    3/4,    1,      3/2,    3/4,    1,      3/4  ],
            [3/4,    1,      4/3,    2,      1,      4/3,    1    ]
        ],
        "tac_dong": [
            [1,      2/3,    1/2,    3/2,    2/3,    2,      4/3  ],
            [3/2,    1,      3/4,    9/4,    1,      3,      2    ],
            [2,      4/3,    1,      3,      4/3,    4,      8/3  ],
            [2/3,    4/9,    1/3,    1,      4/9,    4/3,    8/9  ],
            [3/2,    1,      3/4,    9/4,    1,      3,      2    ],
            [1/2,    1/3,    1/4,    3/4,    1/3,    1,      2/3  ],
            [3/4,    1/2,    3/8,    9/8,    1/2,    3/2,    1    ]
        ],
        "ben_vung": [
            [1,      2/3,    1/2,    1,      1/2,    3/2,    3/4  ],
            [3/2,    1,      3/4,    3/2,    3/4,    9/4,    9/8  ],
            [2,      4/3,    1,      2,      1,      3,      3/2  ],
            [1,      2/3,    1/2,    1,      1/2,    3/2,    3/4  ],
            [2,      4/3,    1,      2,      1,      3,      3/2  ],
            [2/3,    4/9,    1/3,    2/3,    1/3,    1,      1/2  ],
            [4/3,    8/9,    2/3,    4/3,    2/3,    2,      1    ]
        ],
        "do_phu_hop": [
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
        # PA1=Tuyển mới, PA2=Bàn giao, PA3=Backup nội bộ
        "chi_phi":    [[1,    2/3,  1/2],  [3/2, 1,    3/4], [2,   4/3,  1   ]],
        "thoi_gian":  [[1,    4/3,  3/2],  [3/4, 1,    5/4], [2/3, 4/5,  1   ]],
        "do_phuc_tap":[[1,    2/3,  1/2],  [3/2, 1,    3/4], [2,   4/3,  1   ]],
        "tac_dong":   [[1,    4/3,  2/3],  [3/4, 1,    1/2], [3/2, 2,    1   ]],
        "ben_vung":   [[1,    2/3,  1/3],  [3/2, 1,    1/2], [3,   2,    1   ]],
        "do_phu_hop": [[1,    3/4,  3/2],  [4/3, 1,    2  ], [2/3, 1/2,  1   ]]
    },
    "PA_NUOI_DUONG": {
        # PA1=Talent Pool, PA2=Đào tạo cao cấp, PA3=Vinh danh
        "chi_phi":    [[1,    3/4,  3/2],  [4/3, 1,    2  ], [2/3, 1/2,  1   ]],
        "thoi_gian":  [[1,    2/3,  3/4],  [3/2, 1,    5/4], [4/3, 4/5,  1   ]],
        "do_phuc_tap":[[1,    4/3,  5/3],  [3/4, 1,    5/4], [3/5, 4/5,  1   ]],
        "tac_dong":   [[1,    5/4,  5/3],  [4/5, 1,    4/3], [3/5, 3/4,  1   ]],
        "ben_vung":   [[1,    3/4,  5/3],  [4/3, 1,    7/3], [3/5, 3/7,  1   ]],
        "do_phu_hop": [[1,    4/5,  5/4],  [5/4, 1,    3/2], [4/5, 2/3,  1   ]]
    },
    "PA_ON_DINH": {
        # PA1=Duy trì phúc lợi, PA2=Check-in định kỳ, PA3=Phát triển nhẹ
        "chi_phi":    [[1,    3/2,  3/4],  [2/3, 1,    1/2], [4/3, 2,    1   ]],
        "thoi_gian":  [[1,    5/4,  4/3],  [4/5, 1,    5/4], [3/4, 4/5,  1   ]],
        "do_phuc_tap":[[1,    4/3,  3/2],  [3/4, 1,    5/4], [2/3, 4/5,  1   ]],
        "tac_dong":   [[1,    3/4,  2/3],  [4/3, 1,    3/4], [3/2, 4/3,  1   ]],
        "ben_vung":   [[1,    5/4,  3/2],  [4/5, 1,    5/4], [2/3, 4/5,  1   ]],
        "do_phu_hop": [[1,    3/4,  5/4],  [4/3, 1,    5/3], [4/5, 3/5,  1   ]]
    },
    "PA_PHONG_NGUA": {
        # PA1=Stay Interview, PA2=Khảo sát tâm lý, PA3=Cải thiện môi trường
        "chi_phi":    [[1,    3/4,  1/2],  [4/3, 1,    2/3], [2,   3/2,  1   ]],
        "thoi_gian":  [[1,    5/4,  3/2],  [4/5, 1,    5/4], [2/3, 4/5,  1   ]],
        "do_phuc_tap":[[1,    4/3,  1/2],  [3/4, 1,    3/8], [2,   8/3,  1   ]],
        "tac_dong":   [[1,    5/4,  2/3],  [4/5, 1,    1/2], [3/2, 2,    1   ]],
        "ben_vung":   [[1,    3/4,  1/3],  [4/3, 1,    4/9], [3,   9/4,  1   ]],
        "do_phu_hop": [[1,    3/5,  3/4],  [5/3, 1,    5/4], [4/3, 4/5,  1   ]]
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
