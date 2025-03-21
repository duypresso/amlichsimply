function getLunarDate(dd, mm, yyyy) {
    let PI = Math.PI;
    
    function jdFromDate(dd, mm, yyyy) {
        let a = Math.floor((14 - mm) / 12);
        let y = yyyy + 4800 - a;
        let m = mm + 12 * a - 3;
        let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        return jd;
    }
    
    function getNewMoonDay(k, timeZone) {
        let T = k/1236.85;
        let T2 = T * T;
        let T3 = T2 * T;
        let dr = PI/180;
        let Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
        Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr);
        let M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3;
        let Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3;
        let F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3;
        let C1 = (0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
        C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
        C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
        C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
        C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
        C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
        C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
        let deltaT = 0;
        if (T < -11) {
            deltaT = 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
        } else {
            deltaT = -0.000278 + 0.000265*T + 0.000262*T2;
        }
        let JdNew = Jd1 + C1 - deltaT;
        return Math.floor(JdNew + 0.5 + timeZone/24);
    }
    
    function getSunLongitude(jdn, timeZone) {
        let T = (jdn - 2451545.5 - timeZone/24) / 36525;
        let T2 = T * T;
        let dr = PI/180;
        let M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2;
        let L0 = 280.46645 + 36000.76983*T + 0.0003032*T2;
        let DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
        DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
        let L = L0 + DL;
        L = L - 360*(Math.floor(L/360));
        return Math.floor(L / 30);
    }
    
    function getLunarMonth11(yy, timeZone) {
        let off = jdFromDate(31, 12, yy) - 2415021;
        let k = Math.floor(off / 29.530588853);
        let nm = getNewMoonDay(k, timeZone);
        let sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = getNewMoonDay(k-1, timeZone);
        }
        return nm;
    }
    
    function getLeapMonthOffset(a11, timeZone) {
        let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i++;
            arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc != last && i < 14);
        return i - 1;
    }
    
    let dayNumber = jdFromDate(dd, mm, yyyy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k+1, 7);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, 7);
    }
    let a11 = getLunarMonth11(yyyy, 7);
    let b11 = a11;
    if (a11 >= monthStart) {
        a11 = getLunarMonth11(yyyy-1, 7);
    } else {
        b11 = getLunarMonth11(yyyy+1, 7);
    }
    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11, 7);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear = yyyy - 1;
    } else {
        lunarYear = yyyy;
    }
    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap
    };
}
