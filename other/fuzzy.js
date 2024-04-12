// Fungsi keanggotaan untuk variabel Persentase ABC
function keanggotaanABC(persentase) {
    if (persentase >= 0 && persentase <= 3) {
        return [1, 0, 0]; // rendah, sedang, tinggi
    } else if (persentase > 3 && persentase <= 5) {
        return [(5 - persentase) / 2, (persentase - 3) / 2, 0];
    } else if (persentase > 5 && persentase <= 7) {
        return [0, (7 - persentase) / 2, (persentase - 5) / 2];
    } else {
        return [0, 0, 0]; // Default jika nilai tidak sesuai
    }
}

// Fungsi keanggotaan untuk variabel Persediaan
function keanggotaanPersediaan(persediaan) {
    if (persediaan >= 0 && persediaan <= 30) {
        return [1, 0, 0]; // sedikit, cukup, banyak
    } else if (persediaan > 20 && persediaan <= 50) {
        return [0, (50 - persediaan) / 20, (persediaan - 20) / 30];
    } else if (persediaan > 40 && persediaan <= 100) {
        return [0, 0, (100 - persediaan) / 60];
    } else {
        return [0, 0, 0]; // Default jika nilai tidak sesuai
    }
}

// Fungsi keanggotaan untuk variabel Jumlah Pembelian
function keanggotaanJumlahPembelian(jumlah) {
    if (jumlah >= 0 && jumlah <= 75) {
        return [1, 0, 0]; // sedikit, cukup, banyak
    } else if (jumlah > 70 && jumlah <= 145) {
        return [0, (145 - jumlah) / 75, (jumlah - 70) / 75];
    } else if (jumlah > 140 && jumlah <= 210) {
        return [0, 0, (210 - jumlah) / 70];
    } else {
        return [0, 0, 0]; // Default jika nilai tidak sesuai
    }
}

// Fungsi untuk menghitung nilai minimum
function min(a, b) {
    return Math.min(a, b);
}

// Fungsi untuk menghitung nilai maksimum
function max(a, b) {
    return Math.max(a, b);
}

// Fungsi inferensi menggunakan metode Mamdani
function inferensi(persentase, persediaan) {
    const rules = [
        // Rule 1
        min(
            keanggotaanABC(persentase)[0],
            keanggotaanPersediaan(persediaan)[0]
        ),
        // Rule 2
        min(
            keanggotaanABC(persentase)[0],
            keanggotaanPersediaan(persediaan)[1]
        ),
        // Rule 3
        min(
            keanggotaanABC(persentase)[0],
            keanggotaanPersediaan(persediaan)[2]
        ),
        // Rule 4
        min(
            keanggotaanABC(persentase)[1],
            keanggotaanPersediaan(persediaan)[0]
        ),
        // Rule 5
        min(
            keanggotaanABC(persentase)[1],
            keanggotaanPersediaan(persediaan)[1]
        ),
        // Rule 6
        min(
            keanggotaanABC(persentase)[1],
            keanggotaanPersediaan(persediaan)[2]
        ),
        // Rule 7
        min(
            keanggotaanABC(persentase)[2],
            keanggotaanPersediaan(persediaan)[0]
        ),
        // Rule 8
        min(
            keanggotaanABC(persentase)[2],
            keanggotaanPersediaan(persediaan)[1]
        ),
        // Rule 9
        min(
            keanggotaanABC(persentase)[2],
            keanggotaanPersediaan(persediaan)[2]
        ),
    ];

    const output = [
        // Jumlah Pembelian
        max(min(rules[0], keanggotaanJumlahPembelian(0)[0]), 0),
        max(min(rules[1], keanggotaanJumlahPembelian(70)[1]), 0),
        max(min(rules[2], keanggotaanJumlahPembelian(140)[2]), 0),
    ];

    // Defuzzifikasi menggunakan centroid method
    const sum1 = output[0] * 0 + output[1] * 70 + output[2] * 140;
    const sum2 = output[0] + output[1] + output[2];
    const defuzzifikasi = sum1 / sum2;

    return defuzzifikasi;
}

// Contoh pemanggilan fungsi inferensi
const persentase = 8.43; // Persentase ABC
const persediaan = 78; // Persediaan

const defuzzifikasi = inferensi(persentase, persediaan);
console.log(`Hasil defuzzifikasi: ${defuzzifikasi}`);
