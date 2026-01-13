// ===========================================
// 1. KẾT NỐI FIREBASE (GIỮ NGUYÊN)
// ===========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// 👇 Sửa dòng dưới này (Thêm 2 cái cuối)
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCd5j8tWgOeUi9YZMzWHgqzRC8sea-5ad8",
    authDomain: "weatherapp-8a76b.firebaseapp.com",
    projectId: "weatherapp-8a76b",
    storageBucket: "weatherapp-8a76b.firebasestorage.app",
    messagingSenderId: "298120124452",
    appId: "1:298120124452:web:6b54a2c5d05cba0d9d60b1",
    measurementId: "G-R475NTQ8PR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🔥 Khởi tạo Database
const provider = new GoogleAuthProvider(); // Khởi tạo Google Provider
// 👇👇👇 THÊM ĐOẠN NÀY ĐỂ XỬ LÝ NÚT GOOGLE 👇👇👇
// 👇👇👇 SỬA LẠI ĐOẠN NÀY 👇👇👇
const btnGoogle = document.getElementById('btnGoogle');
if(btnGoogle) {
    btnGoogle.addEventListener('click', () => {
        
        const provider = new GoogleAuthProvider();
        
        // ⭐️ THÊM DÒNG NÀY ĐỂ BẮT BUỘC CHỌN TÀI KHOẢN:
        provider.setCustomParameters({ prompt: 'select_account' }); 

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                alert(`✅ Xin chào ${user.displayName}!`);
                document.getElementById('authModal').style.display = 'none';
            })
            .catch((error) => {
                console.error(error);
                // Bỏ qua lỗi nếu người dùng tự tắt bảng popup
                if (error.code !== 'auth/popup-closed-by-user') {
                    alert("❌ Lỗi Google: " + error.message);
                }
            });
    });
}
// ===========================================
// 2. CẤU HÌNH APP
// ===========================================
const apiKey = '5efbba9383b43f5dfa7385d51c597c20'; 
// ===========================================
// 🌍 TỪ ĐIỂN: TÊN NƯỚC -> THỦ ĐÔ (BẢN FULL)
// ===========================================
const COUNTRY_MAP = {
    // --- CHÂU Á (ASIA) ---
    "vietnam": "Hanoi", "việt nam": "Hanoi", "vn": "Hanoi",
    "thailand": "Bangkok", "thái lan": "Bangkok", "thai": "Bangkok",
    "japan": "Tokyo", "nhật bản": "Tokyo", "nhat ban": "Tokyo", "jp": "Tokyo",
    "korea": "Seoul", "hàn quốc": "Seoul", "han quoc": "Seoul", "kr": "Seoul", "nam hàn": "Seoul",
    "china": "Beijing", "trung quốc": "Beijing", "trung quoc": "Beijing", "cn": "Beijing", "bắc kinh": "Beijing",
    "singapore": "Singapore", "sing": "Singapore",
    "malaysia": "Kuala Lumpur", "mã lai": "Kuala Lumpur",
    "indonesia": "Jakarta", "indo": "Jakarta",
    "philippines": "Manila", "phil": "Manila",
    "laos": "Vientiane", "lào": "Vientiane", "lao": "Vientiane",
    "cambodia": "Phnom Penh", "campuchia": "Phnom Penh", "cam": "Phnom Penh",
    "myanmar": "Naypyidaw", "miến điện": "Naypyidaw", "mien dien": "Naypyidaw",
    "taiwan": "Taipei", "đài loan": "Taipei", "dai loan": "Taipei",
    "hong kong": "Hong Kong", "hồng kông": "Hong Kong",
    "india": "New Delhi", "ấn độ": "New Delhi", "an do": "New Delhi",
    "nepal": "Kathmandu",
    "mongolia": "Ulaanbaatar", "mông cổ": "Ulaanbaatar",
    "pakistan": "Islamabad",
    
    // Trung Đông (Middle East)
    "uae": "Abu Dhabi", "dubai": "Dubai", // Dubai nổi hơn thủ đô Abu Dhabi nên map riêng
    "saudi arabia": "Riyadh", "ả rập xê út": "Riyadh", "a rap": "Riyadh",
    "qatar": "Doha",
    "turkey": "Ankara", "thổ nhĩ kỳ": "Ankara", "tho nhi ky": "Ankara",
    "israel": "Jerusalem", "do thái": "Jerusalem",
    "iran": "Tehran",
    "iraq": "Baghdad",

    // --- CHÂU ÂU (EUROPE) ---
    "uk": "London", "england": "London", "anh": "London", "nước anh": "London", "vương quốc anh": "London",
    "france": "Paris", "pháp": "Paris", "phap": "Paris",
    "germany": "Berlin", "đức": "Berlin", "duc": "Berlin",
    "italy": "Rome", "ý": "Rome", "italia": "Rome",
    "russia": "Moscow", "nga": "Moscow", "liên xô": "Moscow",
    "spain": "Madrid", "tây ban nha": "Madrid", "tbn": "Madrid",
    "portugal": "Lisbon", "bồ đào nha": "Lisbon", "bo dao nha": "Lisbon",
    "netherlands": "Amsterdam", "hà lan": "Amsterdam", "ha lan": "Amsterdam",
    "belgium": "Brussels", "bỉ": "Brussels", "bi": "Brussels",
    "switzerland": "Bern", "thụy sĩ": "Bern", "thuy si": "Bern",
    "sweden": "Stockholm", "thụy điển": "Stockholm", "thuy dien": "Stockholm",
    "norway": "Oslo", "na uy": "Oslo",
    "finland": "Helsinki", "phần lan": "Helsinki", "phan lan": "Helsinki",
    "denmark": "Copenhagen", "đan mạch": "Copenhagen", "dan mach": "Copenhagen",
    "poland": "Warsaw", "ba lan": "Warsaw",
    "ukraine": "Kyiv", "ukraina": "Kyiv",
    "austria": "Vienna", "áo": "Vienna", "nuoc ao": "Vienna",
    "hungary": "Budapest",
    "czech": "Prague", "cộng hòa séc": "Prague", "tiep khac": "Prague", "séc": "Prague",
    "greece": "Athens", "hy lạp": "Athens", "hy lap": "Athens",
    "ireland": "Dublin", "ai len": "Dublin",
    "iceland": "Reykjavik", "băng đảo": "Reykjavik",

    // --- CHÂU MỸ (AMERICAS) ---
    "usa": "Washington", "mỹ": "Washington", "my": "Washington", "hoa kỳ": "Washington", "america": "Washington", "us": "Washington",
    "canada": "Ottawa", "ca na đa": "Ottawa",
    "mexico": "Mexico City", "mê hi cô": "Mexico City",
    "brazil": "Brasilia", "braxin": "Brasilia",
    "argentina": "Buenos Aires",
    "chile": "Santiago",
    "colombia": "Bogota",
    "peru": "Lima",
    "cuba": "Havana", "la habana": "Havana",
    "venezuela": "Caracas",

    // --- CHÂU ÚC & ĐẠI DƯƠNG (OCEANIA) ---
    "australia": "Canberra", "úc": "Canberra", "nuoc uc": "Canberra", "aus": "Canberra",
    "new zealand": "Wellington", "niu di lân": "Wellington", "nz": "Wellington",

    // --- CHÂU PHI (AFRICA) ---
    "egypt": "Cairo", "ai cập": "Cairo", "ai cap": "Cairo",
    "south africa": "Pretoria", "nam phi": "Pretoria", // Pretoria là thủ đô hành chính
    "morocco": "Rabat", "ma rốc": "Rabat",
    "nigeria": "Abuja",
    "kenya": "Nairobi",
    "ethiopia": "Addis Ababa"
};
let timeout = null; 
let myChart = null; 

// --- CÁC HÀM GIAO DIỆN ---
window.initApp = function() {
    updateClock();
    setInterval(updateClock, 1000);
}

window.showSearchMode = function() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('searchList').style.display = 'block';
    document.getElementById('mainBtn').style.display = 'none';
    const panels = document.querySelectorAll('.side-panel');
    panels.forEach(p => p.style.display = 'none');
}

window.toggleAuthMode = function() {
    const loginBtn = document.getElementById('btnLoginAction');
    const signupBtn = document.getElementById('btnSignupAction');
    const title = document.getElementById('authTitle');
    const switchText = document.getElementById('switchText');
    
    if (loginBtn.style.display === 'none') {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'none';
        title.innerText = 'Đăng nhập';
        switchText.innerHTML = 'Chưa có tài khoản? <span>Đăng ký ngay</span>';
    } else {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'block';
        title.innerText = 'Đăng ký tài khoản';
        switchText.innerHTML = 'Đã có tài khoản? <span>Đăng nhập ngay</span>';
    }
}

// ===========================================
// 3. XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ
// ===========================================
const modal = document.getElementById('authModal');
const userBtn = document.getElementById('userBtn');

userBtn.onclick = () => modal.style.display = 'flex';

document.getElementById('btnLoginAction').addEventListener('click', () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("✅ Đăng nhập thành công!");
            modal.style.display = 'none';
        })
        .catch((error) => alert("❌ Lỗi: " + error.message));
});

document.getElementById('btnSignupAction').addEventListener('click', () => {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("✅ Đăng ký thành công!");
            modal.style.display = 'none';
        })
        .catch((error) => alert("❌ Lỗi: " + error.message));
});

// Tìm đoạn này trong script.js của bạn
onAuthStateChanged(auth, (user) => {
    const userBtn = document.getElementById('userBtn');
    const badgeContainer = document.getElementById('badgeList'); // Lấy cái hộp chứa huy hiệu

    if (user) {
        // --- KHI ĐĂNG NHẬP ---
        userBtn.textContent = `👤 ${user.email.split('@')[0]}`;
        
        // Tải huy hiệu của người này về
        if(window.loadBadges) window.loadBadges(); 

    } else {
        // --- KHI ĐĂNG XUẤT ---
        userBtn.textContent = '👤 Đăng nhập ngay';
        
        // 👇👇👇 THÊM ĐOẠN NÀY ĐỂ FIX LỖI CỦA BẠN 👇👇👇
        
        // 1. Xóa sạch huy hiệu trên màn hình ngay lập tức
        if(badgeContainer) {
            badgeContainer.innerHTML = ''; 
        }
        
        // 2. (Tuỳ chọn) Xóa các thông tin cá nhân khác nếu có
        console.log("Đã dọn dẹp màn hình!");
    }
});

// ===========================================
// 4. LOGIC THỜI TIẾT & MAP (Đã sửa)
// ===========================================

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    document.getElementById('date').innerText = now.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
}

// Tìm hàm searchCity cũ và thay thế đoạn bên trong setTimeout bằng đoạn này:

window.searchCity = function() {
    const cityInput = document.getElementById('cityInput').value;
    const searchList = document.getElementById('searchList');

    if (cityInput.length === 0) {
        searchList.innerHTML = '<div class="placeholder-text">Nhập tên thành phố...</div>';
        return;
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
        // 👇👇👇 ĐOẠN CODE THÔNG MINH MỚI 👇👇👇
        
        let query = cityInput; // Mặc định là tìm theo cái người dùng nhập
        const key = cityInput.toLowerCase().trim(); // Chuyển về chữ thường để so sánh

        // Kiểm tra xem có trong từ điển nước không
        if (COUNTRY_MAP[key]) {
            query = COUNTRY_MAP[key]; // 🔁 Đổi "Việt Nam" thành "Hanoi" ngay!
        }

        // 👆👆👆 HẾT PHẦN SỬA ĐỔI 👆👆👆

        // Gọi API với biến 'query' (thay vì cityInput cũ)
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            searchList.innerHTML = ''; 

            if (data.length > 0) {
                // Nếu là tìm theo tên nước (đã đổi thành thủ đô), ta chỉ hiện 1 kết quả đầu tiên cho gọn
                // Vì chắc chắn đó là thủ đô chuẩn nhất
                const resultsToShow = COUNTRY_MAP[key] ? [data[0]] : data;

                resultsToShow.forEach(city => {
                    const div = document.createElement('div');
                    div.className = 'search-item';
                    
                    // Thêm lá cờ cho đẹp (Dùng hàm getFlagEmoji nếu thích, ko thì để text)
                    div.innerHTML = `
                        <span class="item-name">${city.name}</span>
                        <span class="item-country">${city.country} ${city.state ? `(${city.state})` : ''}</span>
                    `;
                    
                    div.onclick = () => {
                        // Cập nhật lại thanh tìm kiếm cho đúng tên thành phố
                        document.getElementById('cityInput').value = city.name;
                        getWeatherByCoords(city.lat, city.lon, city.name);
                    };
                    searchList.appendChild(div);
                });
            } else {
                searchList.innerHTML = '<div class="placeholder-text">Không tìm thấy...</div>';
            }
        } catch (e) { console.error(e); }
    }, 300);
}

const getIcon = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

window.getWeather = function(inputName = null) {
    let searchVal = inputName || document.getElementById('cityInput').value;
    if (!searchVal) return;

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchVal}&limit=1&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                getWeatherByCoords(data[0].lat, data[0].lon, data[0].name);
            } else {
                alert("Không tìm thấy địa điểm này!");
            }
        })
        .catch(e => console.error(e));
}

window.getLocation = function() {
    if (navigator.geolocation) {
        document.getElementById('cityInput').placeholder = "Đang định vị...";
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
                document.getElementById('cityInput').placeholder = "Tìm thành phố...";
            },
            (err) => {
                alert("Bạn cần cho phép truy cập vị trí!");
                document.getElementById('cityInput').placeholder = "Tìm thành phố...";
            }
        );
    } else { alert("Trình duyệt không hỗ trợ GPS."); }
}

async function getWeatherByCoords(lat, lon, nameOverride = null) {
    const resultDiv = document.getElementById('result');
    document.getElementById('searchList').style.display = 'none';
    document.getElementById('mainBtn').style.display = 'block';

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${apiKey}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) throw new Error();

        const current = await currentRes.json();
        checkAchievements(current);
        const forecastData = await forecastRes.json();
        const list = forecastData.list;

        resultDiv.style.display = "block";

        document.getElementById('cityName').innerText = nameOverride || current.name;
        document.getElementById('temp').innerText = Math.round(current.main.temp) + "°";
        document.getElementById('desc').innerText = current.weather[0].description;
        document.getElementById('weatherIcon').src = getIcon(current.weather[0].icon);
        
        document.getElementById('wind').innerText = Math.round(current.wind.speed * 3.6) + "km/h";
        document.getElementById('humidity').innerText = current.main.humidity + "%";
        document.getElementById('vis').innerText = (current.visibility / 1000) + "km";
        document.getElementById('aqi').innerText = "AQI: Tốt"; 

        // ===========================================
        // 👇👇 ĐÃ SỬA LỖI MAP Ở ĐÂY 👇👇
        // ===========================================
       // ===========================================
        // 👇 SỬA LẠI ĐOẠN NÀY (Dòng khoảng 165-170)
        // ===========================================
        document.getElementById('mapBtn').onclick = () => {
             // Gọi hàm mở bản đồ nội bộ thay vì Google Maps
             openMapAtLocation(lat, lon, document.getElementById('cityName').innerText);
        };
        // ===========================================
        // ===========================================

        const next24Hours = list.slice(0, 8);
        renderChart(next24Hours);
        analyzeTrend(next24Hours);
        renderDailyOWM(list);
        renderAstroOWM(current.sys);

        askSoraAI(current);
        renderSidePanels(current);
        changeBackground(current.weather[0].main, (current.weather[0].icon.includes('d')));

    } catch (e) {
        alert("Lỗi kết nối!");
        console.error(e);
    }
}

// --- CÁC HÀM PHỤ TRỢ (Render) ---

function renderDailyOWM(list) {
    const container = document.getElementById('dailyList');
    container.innerHTML = "";
    const dailyData = [];
    const usedDates = new Set();
    
    list.forEach(item => {
        const dateTxt = item.dt_txt.split(' ')[0];
        const hour = item.dt_txt.split(' ')[1];
        if (!usedDates.has(dateTxt) && (hour.includes("12:00") || hour.includes("15:00"))) {
            usedDates.add(dateTxt);
            dailyData.push(item);
        }
    });

    dailyData.slice(0, 3).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
        container.innerHTML += `
            <div class="day-row">
                <div class="day-name">${dayName}</div>
                <img src="${getIcon(day.weather[0].icon)}" class="day-icon" style="width:30px">
                <div>
                    <span class="day-temp">${Math.round(day.main.temp_max)}°</span>
                    <span class="min-temp">${Math.round(day.main.temp_min)}°</span>
                </div>
            </div>`;
    });
}

function renderAstroOWM(sys) {
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    }
    document.getElementById('sunrise').innerText = formatTime(sys.sunrise);
    document.getElementById('sunset').innerText = formatTime(sys.sunset);
    document.getElementById('moon').innerText = "--"; 
}

function renderChart(list) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    const labels = list.map(item => item.dt_txt.split(' ')[1].substring(0, 5));
    const temps = list.map(item => item.main.temp);

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nhiệt độ',
                data: temps,
                borderColor: '#ff8fab',
                backgroundColor: 'rgba(255, 143, 171, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false }, ticks: {font: {size: 10}} } }
        }
    });
}

function analyzeTrend(list) {
    const diff = list[list.length - 1].main.temp - list[0].main.temp;
    let advice = "";
    if (diff > 2) advice = "📈 Nhiệt độ TĂNG dần.";
    else if (diff < -2) advice = "📉 Nhiệt độ GIẢM dần.";
    else advice = "➡️ Nhiệt độ ỔN ĐỊNH.";
    if (list.some(item => item.weather[0].main.toLowerCase().includes('rain'))) advice += " Sắp có mưa!";
    document.getElementById('expertAdvice').innerText = advice; 
}

function renderSidePanels(current) {
    document.querySelectorAll('.side-panel').forEach(el => el.style.display = 'block');
    const temp = current.main.temp;
    let food = temp < 18 ? { d: "Lẩu / Đồ nướng", i: "🍲" } : { d: "Cơm gia đình", i: "🍚" };

    document.getElementById('healthPanel').innerHTML = `
        <div class="panel-header">💊 Sức Khỏe & Food</div>
        <div class="advice-item"><div class="adv-icon">💧</div><div class="adv-text">Ẩm: ${current.main.humidity}%</div></div>
        <div class="advice-item" style="background: #fff8e1;">
            <div class="adv-icon">${food.i}</div>
            <div class="adv-text"><b>Món ngon:</b><br>${food.d}</div>
        </div>
    `;

    document.getElementById('travelPanel').innerHTML = `
        <div class="panel-header">✈️ Du Lịch</div>
        <div class="advice-item">
            <div class="adv-icon">💰</div>
            <div class="adv-text"><b>Tỷ giá:</b><br>$1 = 25,300đ</div>
        </div>
    `;
}

function askSoraAI(current) {
    const list = document.getElementById('lifestyleList');
    list.innerHTML = "";
    const isRain = current.weather[0].main.toLowerCase().includes('rain');
    const items = [
        { icon: isRain ? "🧘" : "🏃‍♂️", t: "Thể thao", m: isRain ? "Yoga tại nhà" : "Chạy bộ" },
        { icon: isRain ? "☕" : "📸", t: "Giải trí", m: isRain ? "Cafe đọc sách" : "Đi chụp ảnh" }
    ];
    items.forEach(item => {
        list.innerHTML += `<div class="life-card"><div class="life-icon">${item.icon}</div><div class="life-content"><h4>${item.t}</h4><p>${item.m}</p></div></div>`;
    });
}

function changeBackground(conditionMain, isDay) {
    const body = document.body;
    let bgUrl = '';
    const cond = conditionMain.toLowerCase(); 

    if (cond.includes('rain')) {
        bgUrl = 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070&auto=format&fit=crop'; 
    } else if (cond.includes('cloud')) {
        bgUrl = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop'; 
    } else {
        bgUrl = 'https://i.pinimg.com/originals/7b/a3/e3/7ba3e30243d1291c64714d5a0912279f.jpg'; 
    }
    body.style.backgroundImage = `url('${bgUrl}')`;
}

// ===========================================
// 5. TÍNH NĂNG BẢN ĐỒ (ĐÃ NÂNG CẤP XỊN HƠN)
// ===========================================
let mapInstance = null;
let markerInstance = null;

// Hàm khởi tạo bản đồ (Dùng chung cho cả 2 chức năng)
function initMapIfNotExists() {
    if (!mapInstance) {
        mapInstance = L.map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Sự kiện: Click vào bản đồ để xem thời tiết chỗ đó
        mapInstance.on('click', function(e) {
            const { lat, lng } = e.latlng;
            showMarkerAndGetWeather(lat, lng, "Đang tải dữ liệu...");
        });
    }
}

// Hàm hiển thị Marker và lấy thời tiết
function showMarkerAndGetWeather(lat, lng, title) {
    if (markerInstance) mapInstance.removeLayer(markerInstance);
    
    markerInstance = L.marker([lat, lng]).addTo(mapInstance)
        .bindPopup(`<b>${title}</b>`).openPopup();
        
    // Nếu là click tay thì gọi API, còn nếu là xem vị trí thì thôi
    if(title === "Đang tải dữ liệu...") {
        setTimeout(() => {
            getWeatherByCoords(lat, lng);
            document.getElementById('mapModal').style.display = 'none';
        }, 800);
    }
}

// 1. Chức năng: MỞ BẢN ĐỒ ĐỂ CHỌN (Nút 🗺️ ở thanh tìm kiếm)
window.openMapPicker = function() {
    document.getElementById('mapModal').style.display = 'flex';
    initMapIfNotExists();
    
    // Mặc định view VN nếu chưa có marker
    if (!markerInstance) {
        mapInstance.setView([16.047, 108.206], 5);
    }
    
    setTimeout(() => mapInstance.invalidateSize(), 100);
}

// 2. Chức năng: XEM VỊ TRÍ HIỆN TẠI (Nút 🗺️ ở kết quả)
window.openMapAtLocation = function(lat, lon, name) {
    document.getElementById('mapModal').style.display = 'flex';
    initMapIfNotExists();

    // Zoom ngay vào vị trí thành phố đó
    mapInstance.setView([lat, lon], 12);
    
    // Cắm cái cờ vào
    if (markerInstance) mapInstance.removeLayer(markerInstance);
    markerInstance = L.marker([lat, lon]).addTo(mapInstance)
        .bindPopup(`<b>${name}</b><br>Đang xem tại đây`).openPopup();

    setTimeout(() => mapInstance.invalidateSize(), 100);
}

// ===========================================
// 🎮 GAME: HỆ THỐNG HUY HIỆU
// ===========================================

const BADGES = {
    'heat_master': { icon: '🔥', name: 'Kẻ Chịu Nhiệt', desc: 'Check-in khi trời nóng trên 35°C' },
    'ice_king':    { icon: '❄️', name: 'Vua Băng Giá', desc: 'Check-in khi trời lạnh dưới 15°C' },
    'storm_born':  { icon: '⚡', name: 'Thợ Săn Bão', desc: 'Check-in khi có dông hoặc bão' },
    'rain_walker': { icon: '🌧️', name: 'Người Đi Mưa', desc: 'Check-in khi trời đang mưa' },
    'night_owl':   { icon: '🦉', name: 'Cú Đêm', desc: 'Xem thời tiết sau 11:00 đêm' }
};

// Hàm này sẽ tự động chạy khi có thời tiết mới
async function checkAchievements(weatherData) {
    const user = auth.currentUser;
    if (!user) return; // Chưa đăng nhập thì thôi

    const temp = weatherData.main.temp;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const currentHour = new Date().getHours();
    
    let newBadges = [];

    // --- Điều kiện nhận huy hiệu ---
    if (temp >= 35) newBadges.push('heat_master');
    if (temp <= 15) newBadges.push('ice_king');
    if (weatherMain.includes('thunderstorm')) newBadges.push('storm_born');
    if (weatherMain.includes('rain')) newBadges.push('rain_walker');
    if (currentHour >= 23 || currentHour <= 4) newBadges.push('night_owl');

    if (newBadges.length === 0) return;

    // --- Lưu vào Database ---
    const userRef = doc(db, "users", user.uid);
    
    try {
        // Kiểm tra xem user có trong db chưa, chưa thì tạo
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
            await setDoc(userRef, { badges: [] });
        }

        // Cập nhật huy hiệu (arrayUnion giúp ko bị trùng)
        await updateDoc(userRef, {
            badges: arrayUnion(...newBadges)
        });
        
        console.log("Đã mở khóa huy hiệu:", newBadges);
        loadBadges(); // Tải lại danh sách để hiện lên màn hình
    } catch (e) {
        console.error("Lỗi lưu game:", e);
    }
}

// Hàm tải huy hiệu từ Database về máy
window.loadBadges = async function() {
    const user = auth.currentUser;
    const container = document.getElementById('badgeList');
    if (!user || !container) return;

    container.innerHTML = 'Loading...';

    try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        container.innerHTML = ''; 

        if (docSnap.exists() && docSnap.data().badges) {
            const userBadges = docSnap.data().badges;
            
            if(userBadges.length === 0) {
                container.innerHTML = '<p>Chưa có huy hiệu nào.</p>';
                return;
            }

            userBadges.forEach(code => {
                const b = BADGES[code];
                if (b) {
                    container.innerHTML += `
                        <div class="badge-item" title="${b.desc}">
                            <div class="badge-icon">${b.icon}</div>
                            <div class="badge-name">${b.name}</div>
                        </div>
                    `;
                }
            });
        } else {
            container.innerHTML = '<p>Bạn chưa có huy hiệu nào!</p>';
        }
    } catch (e) {
        console.log("Lỗi tải:", e);
    }
}