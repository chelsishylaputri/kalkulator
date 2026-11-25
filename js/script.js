// Mengambil elemen html yang akan digunakan.
const hasilElement = document.getElementById("hasil");
const riwayatElement = document.getElementById("riwayat");
const tombolContainer = document.getElementById("tombol-kalkulator");

// state variabel: data yang menyimpan kondisi kalkulator
let angkasekarang = "0";
let angkaPertama = null;
let operator = null;
let inputBaru = false;
let terjadiError = false;

// pasangan kunci : nilai
const simbolOperator = {
  "+": "+",
  "-": "-",
  "*": "×   ",
  "/": "÷",
};

function /*fungsi*/ tampilkanHasil /*nama fungsi*/() /* parameter untuk di jalankan*/ {
  //berisi isi/perintah yang akan di jalankan setiap kali fungsi ini dipanggil
  hasilElement.textContent = angkasekarang; //Ambil apapun isi angkaSekarang saat ini, lalu tulis itu ke layar."
}

function resetKalkulator() {
  //di panggil setiap kali tombol AC di tekan.
  // tugasnya : mengembalikan kalkulator ke kondisi seperti baru dibuka.
  angkasekarang = "0";
  angkaPertama = null;
  operator = null;
  inputBaru = false;
  terjadiError = false;

  riwayatElement.textContent = ""; // mengosongkan riwayat
  tampilkanHasil();
}

function tampilkanError(pesan) {
  //"kotak kosong" yang akan di isi nilai setiap kali fungsi ini di panggil.
  angkasekarang = "Error";
  angkaPertama = null;
  operator = null;
  inputBaru = true;
  terjadiError = true;

  riwayatElement.textContent = pesan;
  tampilkanHasil();
}

function tambahAngka(angka) {
  // mengetik angka setelah error akan memulai ulang kalkulator
  if (terjadiError) {
    resetKalkulator();
  }

  //mulai angka kedua atau perhitungan baru.
  if (inputBaru) {
    angkasekarang = "0";
    inputBaru = false;
  }

  // satu angka hanya boleh memiliki satu titik desimal.
  if (angka === ".") {
    if (!angkasekarang.includes(".")) {
      angkasekarang += ".";
    }
    tampilkanHasil();
    return;
  }
  // batasi jumlah digit agar tampilan dan input tetap terkendali.
  const jumlahDigit = angkasekarang.replace(/[^0-9]/g, "").length;

  if (jumlahDigit >= 12) {
    return;
  }

  // mengganti angka awal 0, bukan menambahkan menjadi 01.
  angkasekarang = angkasekarang === "0" ? angka : angkasekarang + angka;

  tampilkanHasil();
}

function hapusAngka() {
  if (terjadiError) {
    resetKalkulator();
    return;
  }

  // jangan menghapus hasil atau angka yang sudah disimpan.
  if (inputBaru) {
    return;
  }

  angkasekarang = angkasekarang.slice(0, -1);

  if (angkasekarang === "" || angkasekarang === "-") {
    angkasekarang = "0";
  }

  tampilkanHasil();
}

function hitungOperasi(angkaA, angkaB, operasi) {
  // operasi ditentukan secara eksplisit, tanpa eval ().
  switch (operasi) {
    case "+":
      return angkaA + angkaB;

    case "-":
      return angkaA - angkaB;

    case "*":
      return angkaA * angkaB;

    case "/":
      if (angkaB === 0) {
        throw new Error("tidak dapat membagi dengan nol.");
      }

      return angkaA / angkaB;

    default:
      throw new Error("Operator tidak dikenali.");
  }
}

function hitungHasil() {
  // Perhitungan membutuhkan angka pertama, operator
  // dan angka kedua yang sudah diinput
  if (angkaPertama === null || operator === null || inputBaru || terjadiError) {
    return;
  }
  // nvd
  const angkaKedua = Number(angkasekarang);

  try {
    const hasil = hitungOperasi(angkaPertama, angkaKedua, operator);

    if (!Number.isFinite(hasil)) {
      throw new Error("Hasil beranda diluar batas perhitungan.");
    }
riwayatElement.textContent
    riwayatElement.textContent = `${angkaPertama} ${simbolOperator[operator]} ${angkaKedua} =`;
    // mengurangi tampilan ekor desimal seperti
    // 0.3000000004. ini bukan aritmetika finansial presisi.
    angkasekarang = String(Number(hasil.toPrecision(12)));

    angkaPertama = null;
    operator = null;
    inputBaru = true;

    tampilkanHasil();
  } catch (error) {
    tampilkanError(error.message);
  }
}

function pilihOperator(operatorDipilih) {
  if (terjadiError) {
    return;
  }

  // selesaikan operasi sebelumnya jika angka kedua tersedia.
  if (operator !== null && !inputBaru) {
    hitungHasil();

    if (terjadiError) {
      return;
    }
  }

  angkaPertama = Number(angkasekarang);
  operator = operatorDipilih;
  inputBaru = true;

  riwayatElement.textContent = `${angkaPertama} ${simbolOperator[operator]}`;
}

// event delegation: satu listener untuk semua tombol:
tombolContainer.addEventListener("click", function (event) {
  const tombol = event.target.closest("button");

  if (!tombol || !tombolContainer.contains(tombol)) {
    return;
  }

  if (tombol.dataset.angka !== undefined) {
    tambahAngka(tombol.dataset.angka);
    return;
  }

  if (tombol.dataset.operator !== undefined) {
    pilihOperator(tombol.dataset.operator);
    return;
  }
  switch (tombol.dataset.aksi) {
    case "reset":
      resetKalkulator();
      break;

    case "hapus":
      hapusAngka();
      break;

    case "hitung":
      hitungHasil();
      break;
  }
});
