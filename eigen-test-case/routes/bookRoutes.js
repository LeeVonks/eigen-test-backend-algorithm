const express = require("express");
const {
  addBook,
  deleteBook,
  getAllBooks,
  checkBooks,
} = require("../controllers/bookController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Manajemen buku
 */

/**
 * @swagger
 * /books/check:
 *   get:
 *     summary: Cek buku - Menampilkan semua buku yang ada dan jumlahnya
 *     tags: [Books]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Daftar buku.
 *       500:
 *         description: Kesalahan server
 */
router.get("/check", checkBooks);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Cek buku - Buku yang sedang dipinjam tidak dihitung
 *     tags: [Books]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Daftar buku.
 *       500:
 *         description: Kesalahan server
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Tambahkan buku baru
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: JK-45
 *               title:
 *                 type: string
 *                 example: Harry Potter
 *               author:
 *                 type: string
 *                 example: J.K Rowling
 *               stock:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Buku berhasil ditambahkan.
 */
router.post("/", addBook);

/**
 * @swagger
 * /books:
 *   delete:
 *     summary: Hapus buku
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: string
 *                    example: JK-45
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus.
 */
router.delete("/", deleteBook);

module.exports = router;
