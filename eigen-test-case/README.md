# Test Seleksi Eigen Backend
# Muhammad Rossi Pahlevi


## Deskripsi
Ini adalah aplikasi manajemen buku dan anggota perpustakaan yang dibangun menggunakan Express.js. Aplikasi ini menyediakan fitur untuk menambahkan, menghapus, dan memeriksa buku serta mengelola anggota yang meminjam dan mengembalikan buku.

## Link Penting
1. API Dokumentasi : http://localhost:3000/api-docs
2. API Aplikasi : http://localhost:3000/

## Persyaratan
- Node.js
- NPM (Node Package Manager)

## Instalasi
1. Clone repositori ini:

2. Navigasi ke direktori proyek:

3. Instal dependensi:
npm install

4. Import Database menggunakan MySql, development ini menggunakan XAMPP.
  
  host: "localhost",
  user: "root",
  password: "",
  database: "library",

## Menjalankan Aplikasi
Untuk menjalankan aplikasi, gunakan perintah berikut:
node app.js

## Endpoints
### Books
- **GET /books/check**: Menampilkan semua buku yang ada dan jumlahnya.
- **GET /books**: Menampilkan buku yang tersedia (buku yang sedang dipinjam tidak dihitung).
- **POST /books**: Menambahkan buku baru.
  - Request Body:
    ```json
    {
      "code": "JK-45",
      "title": "Harry Potter",
      "author": "J.K Rowling",
      "stock": 1
    }
    ```
- **DELETE /books**: Menghapus buku.
  - Request Body:
    ```json
    {
      "code": "JK-45"
    }
    ```

### Members
- **GET /members**: Menampilkan semua anggota yang ada.
- **GET /members/check**: Menampilkan jumlah buku yang sedang dipinjam oleh setiap anggota.
- **POST /members/borrow**: Anggota meminjam buku.
  - Request Body:
    ```json
    {
      "member_code": "M004",
      "books": ["JK-45", "SHR-1"]
    }
    ```
- **POST /members/returns**: Anggota mengembalikan buku.
  - Request Body:
    ```json
    {
      "member_code": "M004",
      "books": ["JK-45", "SHR-1"]
    }
    ```
- **POST /members**: Menambahkan anggota baru.
  - Request Body:
    ```json
    {
      "code": "M001",
      "name": "Angga"
    }
    ```

## Dokumentasi API
Dokumentasi API menggunakan Swagger. Untuk mengakses dokumentasi, jalankan aplikasi dan buka URL berikut di browser: http://localhost:3000/api-docs

