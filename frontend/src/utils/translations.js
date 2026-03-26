/**
 * Translation mapping for HR Attrition Database fields
 */
const translations = {
    // Departments
    'Sales': 'Kinh doanh',
    'Research & Development': 'Nghiên cứu & Phát triển',
    'Human Resources': 'Nhân sự',

    // Job Roles
    'Sales Executive': 'Chuyên viên Kinh doanh',
    'Research Scientist': 'Nhà Khoa học Nghiên cứu',
    'Laboratory Technician': 'Kỹ thuật viên Phòng thí nghiệm',
    'Manufacturing Director': 'Giám đốc Sản xuất',
    'Healthcare Representative': 'Đại diện Y tế',
    'Manager': 'Quản lý',
    'Sales Representative': 'Đại diện Kinh doanh',
    'Research Director': 'Giám đốc Nghiên cứu',
    // Human Resources is already in Departments, will handle naturally

    // Education Fields
    'Life Sciences': 'Khoa học Đời sống',
    'Medical': 'Y tế',
    'Marketing': 'Marketing',
    'Technical Degree': 'Bằng Kỹ thuật',
    'Other': 'Khác',
    // Human Resources is already in Departments

    // Gender
    'Male': 'Nam',
    'Female': 'Nữ',

    // Marital Status
    'Single': 'Độc thân',
    'Married': 'Đã kết hôn',
    'Divorced': 'Ly hôn',

    // Over Time
    'Yes': 'Có',
    'No': 'Không',

    // Business Travel
    'Travel_Rarely': 'Ít đi công tác',
    'Travel_Frequently': 'Thường xuyên công tác',
    'Non-Travel': 'Không đi công tác',

    // Risk Factors (AHP Context)
    'OverTime': 'Làm thêm giờ',
    'JobSatisfaction': 'Hài lòng công việc',
    'MonthlyIncome': 'Thu nhập hàng tháng',
    'WorkLifeBalance': 'Cân bằng cuộc sống',
    'PerformanceRating': 'Hiệu suất công việc',
    'EnvironmentSatisfaction': 'Hài lòng môi trường',
    'JobInvolvement': 'Gắn bó công việc'
};

/**
 * Helper to translate a value from the database
 * @param {string} value - The original value
 * @param {string} fallback - Fallback if no translation found
 * @returns {string} - Translated value
 */
export const t = (value, fallback = null) => {
    if (!value) return fallback || '';
    return translations[value] || fallback || value;
};

export default translations;
