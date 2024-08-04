# Algorithms Project

## Deskripsi
Ini adalah aplikasi Express.js yang menyelesaikan beberapa masalah algoritma, termasuk membalik string, menemukan kata terpanjang dalam sebuah kalimat, menghitung kemunculan kata dalam array, dan menghitung perbedaan jumlah diagonal dalam matriks.

## Struktur Proyek


## Instalasi
1. Clone repositori ini:

2. Navigasi ke direktori proyek:
cd algorithms

3. Instal dependensi:
npm install


## Menjalankan Aplikasi
Untuk menjalankan aplikasi, gunakan perintah berikut:
npm start

Server akan berjalan di `http://localhost:3000`.

## Endpoint
### 1. Reverse Alphabet String
- **URL**: `/api/reverse`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "str": "NEGIE1"
  }

{
  "result": "EIGEN1"
}

### 2. Mencari Kata Terpanjang dalam Kalimat
URL: /api/longest-word
Method: POST
Request Body:
{
  "sentence": "Saya sangat senang mengerjakan soal algoritma"
}
Response:
json
{
  "longest": "mengerjakan",
  "length": 11
}


3. Menghitung Kata dalam QUERY yang Ada di INPUT
URL: /api/query-count
Method: POST
Request Body
{
  "input": ["xc", "dz", "bbb", "dz"],
  "query": ["bbb", "ac", "dz"]
}
Response{
  "output": [1, 0, 2]
}


4. Menghitung Hasil Pengurangan dari Jumlah Diagonal Matriks NxN
URL: /api/matrix-diagonal
Method: POST
Request Body
{
  "matrix": [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
  ]
}

Response
{
  "difference": 3
}


Pengujian Menggunakan Postman atau cURL
Postman
Buka Postman dan buat permintaan baru.
Set URL ke http://localhost:3000/api/<endpoint> sesuai yang diinginkan.
Pilih Method sesuai dengan yang diperlukan (POST).
Tambahkan Body:
Pilih Body.
Pilih raw.
Pilih JSON dari dropdown.
Masukkan konten JSON sesuai dengan request body yang diharapkan.
Kirim Permintaan dengan mengklik Send.
Lihat Respons yang ditampilkan di bagian bawah Postman.
