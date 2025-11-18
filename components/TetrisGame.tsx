// Import library React dan React Native yang diperlukan
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Konstanta untuk ukuran board game Tetris
const BOARD_WIDTH = 10; // Lebar board (jumlah kolom)
const BOARD_HEIGHT = 20; // Tinggi board (jumlah baris)
// Ukuran setiap sel dihitung berdasarkan lebar layar dikurangi padding
const CELL_SIZE = Math.floor((Dimensions.get('window').width - 40) / BOARD_WIDTH);

// Definisi bentuk-bentuk tetromino (7 jenis blok dalam game Tetris)
// Setiap bentuk memiliki beberapa rotasi yang mungkin
const TETROMINOES = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

// Warna untuk setiap jenis tetromino
const TETROMINO_COLORS: { [key: string]: string } = {
  I: '#00F0F0', // Cyan untuk tetromino I
  O: '#F0F000', // Kuning untuk tetromino O
  T: '#A000F0', // Ungu untuk tetromino T
  S: '#00F000', // Hijau untuk tetromino S
  Z: '#F00000', // Merah untuk tetromino Z
  J: '#0000F0', // Biru untuk tetromino J
  L: '#F0A000', // Orange untuk tetromino L
};

// Tipe data untuk jenis tetromino (I, O, T, S, Z, J, L)
type TetrominoType = keyof typeof TETROMINOES;

// Interface untuk struktur data tetromino
interface Tetromino {
  type: TetrominoType; // Jenis tetromino (I, O, T, S, Z, J, L)
  shape: number[][]; // Bentuk tetromino dalam array 2D (1 = ada blok, 0 = kosong)
  x: number; // Posisi X di board
  y: number; // Posisi Y di board
  rotation: number; // Indeks rotasi saat ini
}

// Fungsi untuk membuat board kosong (semua sel bernilai 0)
const createBoard = (): number[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

// Fungsi untuk mendapatkan tetromino secara acak
const getRandomTetromino = (): Tetromino => {
  // Daftar semua jenis tetromino yang tersedia
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  // Pilih jenis tetromino secara acak
  const type = types[Math.floor(Math.random() * types.length)];
  // Ambil bentuk-bentuk rotasi untuk jenis tetromino yang dipilih
  const shapes = TETROMINOES[type];
  return {
    type,
    shape: shapes[0], // Gunakan bentuk rotasi pertama
    // Posisikan tetromino di tengah bagian atas board
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shapes[0][0].length / 2),
    y: 0, // Mulai dari baris paling atas
    rotation: 0, // Rotasi awal adalah 0
  };
};

// Fungsi untuk memutar (rotate) tetromino ke rotasi berikutnya
const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  // Ambil semua bentuk rotasi untuk jenis tetromino ini
  const shapes = TETROMINOES[tetromino.type];
  // Hitung rotasi berikutnya (jika sudah rotasi terakhir, kembali ke rotasi pertama)
  const nextRotation = (tetromino.rotation + 1) % shapes.length;
  return {
    ...tetromino,
    shape: shapes[nextRotation], // Gunakan bentuk rotasi yang baru
    rotation: nextRotation, // Update nilai rotasi
  };
};

// Fungsi untuk mengecek apakah posisi tetromino valid (tidak bertabrakan dengan blok lain atau keluar dari batas)
const isValidPosition = (board: number[][], tetromino: Tetromino): boolean => {
  // Loop melalui setiap sel dalam bentuk tetromino
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      // Jika sel ini berisi blok (bernilai 1)
      if (tetromino.shape[y][x]) {
        // Hitung posisi di board
        const newX = tetromino.x + x;
        const newY = tetromino.y + y;
        
        // Cek apakah posisi keluar dari batas board
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false; // Posisi tidak valid
        }
        
        // Cek apakah posisi sudah terisi oleh blok lain
        if (newY >= 0 && board[newY][newX]) {
          return false; // Posisi tidak valid (bertabrakan)
        }
      }
    }
  }
  return true; // Posisi valid
};

// Fungsi untuk menempatkan tetromino ke board (ketika sudah tidak bisa turun lagi)
const placeTetromino = (board: number[][], tetromino: Tetromino): number[][] => {
  // Buat salinan board baru (untuk immutability)
  const newBoard = board.map(row => [...row]);
  // Gunakan kode ASCII dari karakter jenis tetromino sebagai identifier warna
  const colorValue = tetromino.type.charCodeAt(0);
  
  // Loop melalui setiap sel dalam bentuk tetromino
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      // Jika sel ini berisi blok
      if (tetromino.shape[y][x]) {
        const boardY = tetromino.y + y;
        const boardX = tetromino.x + x;
        // Pastikan posisi berada di dalam board (tidak di atas board)
        if (boardY >= 0) {
          // Tempatkan blok di board dengan nilai identifier warna
          newBoard[boardY][boardX] = colorValue;
        }
      }
    }
  }
  return newBoard;
};

// Fungsi untuk menghapus baris yang sudah penuh dan menghitung jumlah baris yang dihapus
const clearLines = (board: number[][]): { newBoard: number[][]; linesCleared: number } => {
  const newBoard: number[][] = [];
  let linesCleared = 0;
  
  // Loop dari bawah ke atas board
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    // Cek apakah baris ini penuh (semua sel tidak kosong/bernilai 0)
    if (board[y].every(cell => cell !== 0)) {
      linesCleared++; // Tambahkan jumlah baris yang dihapus
      // Jangan tambahkan baris ini ke board baru (dihapus)
    } else {
      // Baris tidak penuh, tambahkan ke board baru
      newBoard.unshift([...board[y]]);
    }
  }
  
  // Tambahkan baris kosong di atas jika diperlukan untuk mengisi board sampai penuh
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
};

// Komponen utama game Tetris
export default function TetrisGame() {
  // Hook untuk mendapatkan tema warna (dark/light mode)
  const colorScheme = useColorScheme();
  
  // State untuk menyimpan board game
  const [board, setBoard] = useState<number[][]>(createBoard());
  // State untuk menyimpan tetromino yang sedang jatuh
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino | null>(null);
  // State untuk menyimpan skor pemain
  const [score, setScore] = useState(0);
  // State untuk menandai apakah game sudah berakhir
  const [gameOver, setGameOver] = useState(false);
  // State untuk menandai apakah game sedang di-pause
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref untuk menyimpan nilai board terbaru (digunakan di dalam interval)
  const boardRef = useRef(board);
  // Ref untuk menyimpan nilai tetromino terbaru (digunakan di dalam interval)
  const tetrominoRef = useRef(currentTetromino);

  // Update ref board setiap kali board berubah
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Update ref tetromino setiap kali tetromino berubah
  useEffect(() => {
    tetrominoRef.current = currentTetromino;
  }, [currentTetromino]);

  // Fungsi untuk memunculkan tetromino baru di bagian atas board
  const spawnTetromino = useCallback(() => {
    const newTetromino = getRandomTetromino();
    // Cek apakah posisi spawn valid
    if (isValidPosition(boardRef.current, newTetromino)) {
      setCurrentTetromino(newTetromino);
      return true;
    }
    // Jika tidak bisa spawn, berarti game over
    setGameOver(true);
    return false;
  }, []);

  // Effect untuk memunculkan tetromino baru ketika diperlukan
  useEffect(() => {
    // Hanya spawn jika game belum berakhir, tidak di-pause, dan belum ada tetromino aktif
    if (!gameOver && !isPaused && !currentTetromino) {
      spawnTetromino();
    }
  }, [gameOver, isPaused, currentTetromino, spawnTetromino]);

  // Effect untuk game loop utama (menjatuhkan tetromino secara otomatis)
  useEffect(() => {
    // Jangan jalankan loop jika game sudah berakhir, di-pause, atau tidak ada tetromino
    if (gameOver || isPaused || !currentTetromino) return;

    // Set interval untuk menjatuhkan tetromino setiap 1 detik
    const gameLoop = setInterval(() => {
      // Ambil nilai board dan tetromino terbaru dari ref
      const currentBoard = boardRef.current;
      const currentPiece = tetrominoRef.current;
      
      if (!currentPiece) return;
      
      // Coba gerakkan tetromino ke bawah 1 posisi
      const moved = { ...currentPiece, y: currentPiece.y + 1 };
      
      // Cek apakah posisi baru valid
      if (isValidPosition(currentBoard, moved)) {
        // Posisi valid, gerakkan tetromino ke bawah
        setCurrentTetromino(moved);
      } else {
        // Posisi tidak valid (sudah sampai bawah atau bertabrakan)
        // Tempatkan tetromino ke board
        const newBoard = placeTetromino(currentBoard, currentPiece);
        // Hapus baris yang penuh dan dapatkan board baru serta jumlah baris yang dihapus
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);
        // Tambahkan skor (100 poin per baris yang dihapus)
        setScore(prevScore => prevScore + linesCleared * 100);
        
        // Munculkan tetromino baru
        const nextTetromino = getRandomTetromino();
        // Cek apakah tetromino baru bisa dimunculkan
        if (!isValidPosition(clearedBoard, nextTetromino)) {
          // Tidak bisa spawn, game over
          setGameOver(true);
          setCurrentTetromino(null);
        } else {
          // Bisa spawn, set tetromino baru
          setCurrentTetromino(nextTetromino);
        }
      }
    }, 1000); // Interval 1 detik

    // Cleanup: hapus interval ketika component unmount atau dependencies berubah
    return () => clearInterval(gameLoop);
  }, [gameOver, isPaused, currentTetromino]);

  // Fungsi untuk menggerakkan tetromino (kiri, kanan, atau turun cepat)
  const moveTetromino = (direction: 'left' | 'right' | 'down') => {
    // Jangan gerakkan jika tidak ada tetromino, game over, atau di-pause
    if (!currentTetromino || gameOver || isPaused) return;

    setCurrentTetromino(prev => {
      if (!prev) return null;
      // Ambil board terbaru dari ref
      const currentBoard = boardRef.current;
      let moved: Tetromino;
      
      // Tentukan arah gerakan berdasarkan parameter direction
      if (direction === 'left') {
        moved = { ...prev, x: prev.x - 1 }; // Geser ke kiri
      } else if (direction === 'right') {
        moved = { ...prev, x: prev.x + 1 }; // Geser ke kanan
      } else {
        moved = { ...prev, y: prev.y + 1 }; // Geser ke bawah
      }
      
      // Cek apakah posisi baru valid
      if (isValidPosition(currentBoard, moved)) {
        return moved; // Posisi valid, kembalikan tetromino yang sudah digerakkan
      }
      
      // Jika gerakan ke bawah dan tidak valid, berarti sudah sampai bawah
      if (direction === 'down') {
        // Tempatkan tetromino ke board
        const newBoard = placeTetromino(currentBoard, prev);
        // Hapus baris yang penuh
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);
        // Tambahkan skor
        setScore(prevScore => prevScore + linesCleared * 100);
        
        // Munculkan tetromino baru
        const nextTetromino = getRandomTetromino();
        if (!isValidPosition(clearedBoard, nextTetromino)) {
          // Tidak bisa spawn, game over
          setGameOver(true);
          return null;
        }
        return nextTetromino; // Kembalikan tetromino baru
      }
      
      // Jika gerakan tidak valid dan bukan ke bawah, tetap di posisi lama
      return prev;
    });
  };

  // Fungsi untuk memutar tetromino saat ini
  const rotateCurrentTetromino = () => {
    // Jangan putar jika tidak ada tetromino, game over, atau di-pause
    if (!currentTetromino || gameOver || isPaused) return;

    setCurrentTetromino(prev => {
      if (!prev) return null;
      // Putar tetromino ke rotasi berikutnya
      const rotated = rotateTetromino(prev);
      // Cek apakah posisi setelah rotasi valid
      if (isValidPosition(boardRef.current, rotated)) {
        return rotated; // Posisi valid, kembalikan tetromino yang sudah diputar
      }
      return prev; // Posisi tidak valid, tetap di rotasi lama
    });
  };

  // Fungsi untuk mereset game ke kondisi awal
  const resetGame = () => {
    const newBoard = createBoard(); // Buat board kosong baru
    setBoard(newBoard);
    setScore(0); // Reset skor ke 0
    setGameOver(false); // Reset status game over
    setIsPaused(false); // Reset status pause
    setCurrentTetromino(null); // Hapus tetromino saat ini
    // Tetromino baru akan muncul otomatis melalui useEffect
  };

  // Fungsi untuk toggle pause/resume game
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Fungsi untuk merender board game ke layar
  const renderBoard = () => {
    // Buat salinan board untuk ditampilkan (termasuk tetromino yang sedang jatuh)
    const displayBoard = board.map(row => [...row]);
    
    // Jika ada tetromino yang sedang jatuh, tambahkan ke display board
    if (currentTetromino) {
      // Loop melalui setiap sel dalam bentuk tetromino
      for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
          // Jika sel ini berisi blok
          if (currentTetromino.shape[y][x]) {
            const boardY = currentTetromino.y + y;
            const boardX = currentTetromino.x + x;
            // Pastikan posisi berada di dalam batas board
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              // Set nilai sel dengan kode ASCII jenis tetromino (untuk warna)
              displayBoard[boardY][boardX] = currentTetromino.type.charCodeAt(0);
            }
          }
        }
      }
    }

    // Render setiap baris dan sel dalam board
    return displayBoard.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, cellIndex) => {
          const cellValue = cell;
          // Tentukan warna berdasarkan nilai sel (jika ada blok, gunakan warna tetromino)
          const color = cellValue ? TETROMINO_COLORS[String.fromCharCode(cellValue)] : 'transparent';
          return (
            <View
              key={cellIndex}
              style={[
                styles.cell,
                {
                  // Jika tidak ada blok, gunakan warna background sesuai tema
                  backgroundColor: color || (colorScheme === 'dark' ? '#333' : '#f0f0f0'),
                  // Warna border sesuai tema
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
                },
              ]}
            />
          );
        })}
      </View>
    ));
  };

  // Ambil warna tema berdasarkan color scheme
  const colors = Colors[colorScheme ?? 'light'];

  // Render komponen UI game
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header: Menampilkan skor dan status game */}
      <View style={styles.header}>
        <Text style={[styles.score, { color: colors.text }]}>Score: {score}</Text>
        {/* Tampilkan "GAME OVER" jika game sudah berakhir */}
        {gameOver && <Text style={[styles.gameOver, { color: '#F00000' }]}>GAME OVER</Text>}
        {/* Tampilkan "PAUSED" jika game sedang di-pause */}
        {isPaused && !gameOver && <Text style={[styles.paused, { color: colors.text }]}>PAUSED</Text>}
      </View>

      {/* Board game: Area utama untuk bermain */}
      <View style={[styles.board, { borderColor: colors.tint }]}>
        {renderBoard()}
      </View>

      {/* Kontrol game: Tombol-tombol untuk mengontrol tetromino */}
      <View style={styles.controls}>
        {/* Baris kontrol pertama: Kiri, Rotasi, Kanan */}
        <View style={styles.controlRow}>
          {/* Tombol geser ke kiri */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => moveTetromino('left')}
            disabled={gameOver || isPaused}>
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          {/* Tombol rotasi */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={rotateCurrentTetromino}
            disabled={gameOver || isPaused}>
            <Text style={styles.buttonText}>↻</Text>
          </TouchableOpacity>
          {/* Tombol geser ke kanan */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => moveTetromino('right')}
            disabled={gameOver || isPaused}>
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
        {/* Baris kontrol kedua: Turun cepat */}
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonDown, { backgroundColor: colors.tint }]}
            onPress={() => moveTetromino('down')}
            disabled={gameOver || isPaused}>
            <Text style={styles.buttonText}>↓</Text>
          </TouchableOpacity>
        </View>
        {/* Baris kontrol ketiga: Pause dan Reset */}
        <View style={styles.controlRow}>
          {/* Tombol pause/resume */}
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, { backgroundColor: colors.icon }]}
            onPress={togglePause}
            disabled={gameOver}>
            <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          {/* Tombol reset game */}
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary, { backgroundColor: colors.icon }]}
            onPress={resetGame}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// StyleSheet untuk styling komponen UI
const styles = StyleSheet.create({
  // Container utama: mengisi seluruh layar dengan padding
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Header: area untuk menampilkan skor dan status
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  // Style untuk teks skor
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Style untuk teks "GAME OVER"
  gameOver: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Style untuk teks "PAUSED"
  paused: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Style untuk board game (dengan border)
  board: {
    borderWidth: 2,
    padding: 2,
    borderRadius: 4,
  },
  // Style untuk baris dalam board
  row: {
    flexDirection: 'row',
  },
  // Style untuk setiap sel dalam board
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
  },
  // Container untuk semua kontrol game
  controls: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  // Baris kontrol (untuk mengelompokkan tombol)
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  // Style untuk tombol kontrol utama
  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  // Style khusus untuk tombol turun (lebih lebar)
  buttonDown: {
    minWidth: 200,
  },
  // Style untuk tombol sekunder (Pause, Reset)
  buttonSecondary: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 80,
  },
  // Style untuk teks di dalam tombol
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

