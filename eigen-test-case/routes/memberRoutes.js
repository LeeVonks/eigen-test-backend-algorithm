const express = require("express");
const {
  addMember,
  MemberBorrowBook,
  MemberReturnsBook,
  checkAllMembers,
  getAllMembers,
} = require("../controllers/memberController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Admin Members
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Cek Anggota - Menampilkan semua anggota yang ada
 *     tags: [Members]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Daftar semua anggota yang ada.
 *       500:
 *         description: Kesalahan server
 */
router.get("/", getAllMembers);

/**
 * @swagger
 * /members/check:
 *   get:
 *     summary: Cek Anggota - Jumlah buku yang sedang dipinjam oleh setiap anggota
 *     tags: [Members]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Daftar anggota dan jumlah buku yang sedang dipinjam oleh setiap anggota.
 *       500:
 *         description: Kesalahan server
 */
router.get("/check", checkAllMembers);

/**
 * @swagger
 * /members/borrow:
 *   post:
 *     summary: Anggota meminjam buku
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 example: M004
 *               books:
 *                 type: array
 *                 example: ["JK-45", "SHR-1"]
 *     responses:
 *       200:
 *         description: Buku berhasil dipinjam.
 *       400:
 *         description: Permintaan buruk, input tidak valid.
 */
router.post("/borrow", MemberBorrowBook);

/**
 * @swagger
 * /members/returns:
 *   post:
 *     summary: Anggota mengembalikan buku
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 example: M004
 *               books:
 *                 type: array
 *                 example: ["JK-45", "SHR-1"]
 *     responses:
 *       200:
 *         description: Buku berhasil dikembalikan.
 *       400:
 *         description: Permintaan buruk, input tidak valid.
 */
router.post("/returns", MemberReturnsBook);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Tambahkan anggota baru
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: M001
 *               name:
 *                 type: string
 *                 example: Angga
 *     responses:
 *       200:
 *         description: Anggota berhasil ditambahkan.
 */
router.post("/", addMember);

module.exports = router;
