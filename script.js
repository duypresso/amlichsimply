let currentDate = new Date();
let selectedDate = new Date();

const events = {
    "1-1": ["Tết Dương lịch"],
    "10-3": ["Giỗ Tổ Hùng Vương"],
    "30-4": ["Ngày Giải phóng miền Nam"],
    "1-5": ["Ngày Quốc tế Lao động"],
    "2-9": ["Ngày Quốc khánh"]
};

const lunarEvents = {
    "1-1": ["Tết Nguyên đán"],
    "15-1": ["Tết Nguyên tiêu"],
    "10-3": ["Giỗ Tổ Hùng Vương"],
    "15-4": ["Lễ Phật đản"],
    "5-5": ["Tết Đoan ngọ"],
    "15-7": ["Lễ Vu lan"],
    "15-8": ["Tết Trung thu"]
};

// ...existing code...

function updateCalendar() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const calendar = document.getElementById('calendar');
    
    // Cập nhật giá trị của các select
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    calendar.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Thêm ngày trống vào đầu tháng
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendar.appendChild(createEmptyDay());
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= lastDay.getDate(); day++) {
        calendar.appendChild(createCalendarDay(day, month, year));
    }

    // Đánh dấu ngày được chọn
    if (selectedDate) {
        const selectedDay = document.querySelectorAll('.calendar-day:not(.empty)')[selectedDate.getDate() - 1];
        if (selectedDay) {
            selectedDay.classList.add('selected');
        }
    }
}

function createCalendarDay(day, month, year) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    
    const solar = document.createElement('div');
    solar.className = 'solar-date';
    solar.textContent = day;
    
    const lunar = document.createElement('div');
    lunar.className = 'lunar-date';
    const lunarDate = getLunarDate(day, month + 1, year);
    lunar.textContent = `${lunarDate.day}/${lunarDate.month}`;
    
    div.appendChild(solar);
    div.appendChild(lunar);
    
    if (isToday(day, month, year)) {
        div.classList.add('today');
        // Thêm title cho ngày hiện tại
        div.setAttribute('title', 'Hôm nay');
    }
    
    const solarKey = `${day}-${month + 1}`;
    const lunarKey = `${lunarDate.day}-${lunarDate.month}`;
    
    if (events[solarKey] || lunarEvents[lunarKey]) {
        div.style.backgroundColor = '#ffe6e6';
    }
    
    div.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
        selectDate(day, month, year);
    });
    
    return div;
}

function createEmptyDay() {
    const div = document.createElement('div');
    div.className = 'calendar-day empty';
    return div;
}

function isToday(day, month, year) {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
}

function selectDate(day, month, year) {
    const oldSelectedDate = selectedDate;
    selectedDate = new Date(year, month, day);
    
    updateEvents();
    
    // Cuộn đến phần sự kiện khi chọn ngày
    const eventsContainer = document.querySelector('.events-container');
    eventsContainer.scrollIntoView({ behavior: 'smooth' });
}

function updateEvents() {
    const eventsDiv = document.getElementById('events');
    const lunarInfo = document.getElementById('lunarInfo');
    
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const lunarDate = getLunarDate(day, month, year);
    
    // Cập nhật hiển thị ngày tháng
    const solarDateNumber = document.querySelector('.solar-date-display .date-number');
    const solarDateInfo = document.querySelector('.solar-date-display .date-info');
    const lunarDateNumber = document.querySelector('.lunar-date-display .date-number');
    const lunarDateInfo = document.querySelector('.lunar-date-display .date-info');

    // Hiển thị ngày dương lịch
    solarDateNumber.textContent = day;
    solarDateInfo.textContent = `Tháng ${month}, ${year}`;

    // Hiển thị ngày âm lịch
    lunarDateNumber.textContent = lunarDate.day;
    lunarDateInfo.textContent = `Tháng ${lunarDate.month}, ${lunarDate.year}`;

    let eventsList = [];
    if (events[`${day}-${month}`]) {
        eventsList = eventsList.concat(events[`${day}-${month}`].map(e => `${e} (Dương lịch)`));
    }
    if (lunarEvents[`${lunarDate.day}-${lunarDate.month}`]) {
        eventsList = eventsList.concat(lunarEvents[`${lunarDate.day}-${lunarDate.month}`].map(e => `${e} (Âm lịch)`));
    }
    
    lunarInfo.innerHTML = `Ngày ${lunarDate.day} tháng ${lunarDate.month} năm ${lunarDate.year} (Âm lịch)`;
    
    if (eventsList.length > 0) {
        eventsDiv.innerHTML = `
            <div class="events-list">
                ${eventsList.map(event => `<div class="event">${event}</div>`).join('')}
            </div>
        `;
    } else {
        eventsDiv.innerHTML = '<div class="no-events">Không có sự kiện</div>';
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

function initializeDateSelectors() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    
    // Tạo options cho năm (từ năm hiện tại - 100 đến năm hiện tại + 100)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 100; year <= currentYear + 100; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `Năm ${year}`;
        yearSelect.appendChild(option);
    }
    
    // Set giá trị mặc định
    yearSelect.value = currentDate.getFullYear();
    monthSelect.value = currentDate.getMonth();
    
    // Thêm event listeners
    yearSelect.addEventListener('change', () => {
        currentDate.setFullYear(parseInt(yearSelect.value));
        updateCalendar();
    });
    
    monthSelect.addEventListener('change', () => {
        currentDate.setMonth(parseInt(monthSelect.value));
        updateCalendar();
    });
}

// Khởi tạo calendar
initializeDateSelectors();
updateCalendar();
updateEvents();
