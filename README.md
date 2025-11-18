# 🎮 Game Tetris Sederhana

Game Tetris klasik yang dibuat dengan React Native dan Expo. Game ini dapat dijalankan di Android, iOS, dan Web dengan satu codebase.

![Expo](https://img.shields.io/badge/Expo-54.0.24-black?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript)

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Cara Bermain](#-cara-bermain)
- [Struktur Proyek](#-struktur-proyek)
- [Penjelasan Kode](#-penjelasan-kode)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## ✨ Fitur

- 🎯 **7 Jenis Tetromino**: I, O, T, S, Z, J, L dengan warna yang berbeda
- 🔄 **Sistem Rotasi**: Setiap tetromino dapat diputar untuk menyesuaikan posisi
- 🧹 **Line Clearing**: Baris yang penuh akan otomatis terhapus
- 📊 **Sistem Skor**: Mendapatkan 100 poin untuk setiap baris yang dihapus
- ⏸️ **Pause/Resume**: Fitur untuk menjeda dan melanjutkan permainan
- 🔁 **Reset Game**: Tombol untuk memulai ulang permainan
- 🎨 **Dark/Light Mode**: Mendukung tema gelap dan terang
- 📱 **Multi-Platform**: Dapat dijalankan di Android, iOS, dan Web
- 🎮 **Kontrol Mudah**: Tombol kontrol yang intuitif dan mudah digunakan
- 📝 **Kode Terkomentar**: Semua kode dilengkapi dengan komentar bahasa Indonesia

## 🛠 Teknologi yang Digunakan

### Core Technologies
- **React Native** (0.81.5) - Framework untuk membangun aplikasi mobile
- **Expo** (54.0.24) - Platform dan tools untuk pengembangan React Native
- **TypeScript** (5.9.2) - Superset JavaScript dengan type safety
- **React** (19.1.0) - Library JavaScript untuk membangun UI

### Dependencies Utama
- **expo-router** - File-based routing untuk navigasi
- **react-navigation** - Navigasi antar halaman
- **expo-constants** - Akses ke konstanta aplikasi Expo
- **expo-status-bar** - Kontrol status bar

### Development Tools
- **ESLint** - Linter untuk menjaga kualitas kode
- **TypeScript** - Type checking dan IntelliSense

## 💻 Persyaratan Sistem

### Untuk Development
- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **Git**

### Untuk Android
- Android Studio dengan Android SDK
- Android emulator atau perangkat fisik dengan USB debugging

### Untuk iOS (hanya macOS)
- Xcode (versi terbaru)
- CocoaPods
- iOS Simulator atau perangkat fisik

### Untuk Web
- Browser modern (Chrome, Firefox, Safari, Edge)

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/edisuherlan/game-tetris-sederhana.git
   cd game-tetris-snake-sederhana
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup selesai!** 🎉

## 🚀 Cara Menjalankan

### Menjalankan Development Server

```bash
npm start
```

atau

```bash
npx expo start
```

Setelah server berjalan, Anda akan melihat QR code dan beberapa opsi:

### Untuk Android
```bash
npm run android
```
atau tekan `a` di terminal setelah `npm start`

### Untuk iOS (hanya macOS)
```bash
npm run ios
```
atau tekan `i` di terminal setelah `npm start`

### Untuk Web
```bash
npm run web
```
atau tekan `w` di terminal setelah `npm start`

### Menggunakan Expo Go (Mobile)

1. Install aplikasi **Expo Go** dari:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Scan QR code yang muncul di terminal dengan:
   - **Android**: Expo Go app
   - **iOS**: Camera app (akan redirect ke Expo Go)

## 🎮 Cara Bermain

### Tujuan Game
Tujuan utama adalah mengisi baris horizontal dengan blok tetromino. Ketika baris penuh, baris tersebut akan terhapus dan Anda mendapatkan poin.

### Kontrol Game

| Tombol | Fungsi |
|--------|--------|
| **←** | Geser tetromino ke kiri |
| **→** | Geser tetromino ke kanan |
| **↓** | Turunkan tetromino dengan cepat |
| **↻** | Putar/rotasi tetromino |
| **Pause** | Jeda permainan |
| **Resume** | Lanjutkan permainan |
| **Reset** | Mulai ulang permainan |

### Aturan Permainan

1. **Tetromino Jatuh**: Tetromino akan jatuh secara otomatis setiap 1 detik
2. **Geser**: Gunakan tombol kiri/kanan untuk menggeser tetromino
3. **Rotasi**: Gunakan tombol rotasi untuk memutar tetromino
4. **Turun Cepat**: Tekan tombol bawah untuk menurunkan tetromino lebih cepat
5. **Line Clearing**: Ketika baris penuh, baris akan terhapus dan Anda mendapat 100 poin per baris
6. **Game Over**: Game berakhir ketika tetromino baru tidak bisa dimunculkan di bagian atas board

### Tips Bermain

- 🎯 Rencanakan posisi tetromino sebelum menempatkannya
- 🔄 Manfaatkan rotasi untuk menyesuaikan bentuk tetromino
- 🧹 Fokus untuk mengisi baris horizontal
- ⚡ Gunakan tombol turun cepat dengan bijak
- 📊 Coba dapatkan skor tertinggi!

## 📁 Struktur Proyek

```
game-tetris-snake-sederhana/
├── app/                          # Direktori aplikasi utama
│   ├── (tabs)/                  # Tab navigation
│   │   ├── index.tsx            # Halaman utama (game Tetris)
│   │   ├── explore.tsx          # Halaman explore
│   │   └── _layout.tsx          # Layout untuk tabs
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal screen
├── components/                  # Komponen React
│   ├── TetrisGame.tsx           # Komponen utama game Tetris ⭐
│   ├── themed-text.tsx          # Komponen teks dengan tema
│   ├── themed-view.tsx          # Komponen view dengan tema
│   └── ui/                      # Komponen UI tambahan
├── constants/                   # Konstanta aplikasi
│   └── theme.ts                 # Konfigurasi tema warna
├── hooks/                       # Custom React hooks
│   ├── use-color-scheme.ts      # Hook untuk color scheme
│   └── use-theme-color.ts       # Hook untuk warna tema
├── assets/                      # Assets aplikasi
│   └── images/                  # Gambar dan ikon
├── scripts/                     # Script utilitas
│   └── reset-project.js         # Script reset proyek
├── package.json                 # Dependencies dan scripts
├── tsconfig.json                # Konfigurasi TypeScript
├── app.json                     # Konfigurasi Expo
└── README.md                    # Dokumentasi proyek
```

## 📖 Penjelasan Kode

### Komponen Utama: `TetrisGame.tsx`

Komponen ini adalah jantung dari game Tetris. Berikut penjelasan singkat bagian-bagiannya:

#### Konstanta
- `BOARD_WIDTH` (10): Lebar board dalam jumlah kolom
- `BOARD_HEIGHT` (20): Tinggi board dalam jumlah baris
- `CELL_SIZE`: Ukuran setiap sel yang dihitung berdasarkan lebar layar

#### Data Tetromino
- `TETROMINOES`: Definisi bentuk 7 jenis tetromino dengan semua rotasinya
- `TETROMINO_COLORS`: Warna untuk setiap jenis tetromino

#### Fungsi Utama
- `createBoard()`: Membuat board kosong baru
- `getRandomTetromino()`: Mendapatkan tetromino acak
- `rotateTetromino()`: Memutar tetromino ke rotasi berikutnya
- `isValidPosition()`: Mengecek apakah posisi tetromino valid
- `placeTetromino()`: Menempatkan tetromino ke board
- `clearLines()`: Menghapus baris yang penuh dan menghitung skor

#### State Management
- `board`: State untuk menyimpan kondisi board
- `currentTetromino`: Tetromino yang sedang jatuh
- `score`: Skor pemain
- `gameOver`: Status game over
- `isPaused`: Status pause

#### Game Loop
Game menggunakan `setInterval` untuk menjatuhkan tetromino setiap 1 detik. Ketika tetromino tidak bisa turun lagi, akan ditempatkan ke board dan tetromino baru dimunculkan.

### Halaman Utama: `app/(tabs)/index.tsx`

Halaman ini hanya menampilkan komponen `TetrisGame` sebagai konten utama.

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. **Fork** repository ini
2. **Buat branch** untuk fitur baru (`git checkout -b fitur-baru`)
3. **Commit** perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. **Push** ke branch (`git push origin fitur-baru`)
5. **Buat Pull Request**

### Ide Kontribusi
- 🎨 Perbaikan UI/UX
- 🎵 Menambahkan efek suara
- 📊 Menambahkan leaderboard
- 🎮 Menambahkan level kesulitan
- 📱 Optimasi untuk berbagai ukuran layar
- 🐛 Bug fixes
- 📝 Perbaikan dokumentasi

## 📝 Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## 👤 Author

**Edisuherlan**
- GitHub: [@edisuherlan](https://github.com/edisuherlan)
- Repository: [game-tetris-snake-sederhana](https://github.com/edisuherlan/game-tetris-sederhana)

## 🙏 Terima Kasih

Terima kasih telah menggunakan game Tetris ini! Jika Anda menyukai proyek ini, jangan lupa untuk memberikan ⭐ di repository ini.

## 📞 Support

Jika Anda memiliki pertanyaan atau menemukan bug, silakan buat [issue](https://github.com/edisuherlan/game-tetris-snake-sederhana/issues) di repository ini.

---

**Selamat Bermain! 🎮🎉**
