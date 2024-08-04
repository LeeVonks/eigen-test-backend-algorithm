const pool = require("../config/db");

const addMember = async (req, res) => {
  const { code, name } = req.body;

  try {
    // Cek apakah kode sudah ada
    const [existingMember] = await pool.query(
      "SELECT * FROM member WHERE code = ?",
      [code]
    );

    if (existingMember.length > 0) {
      return res.status(400).json({ error: "Gagal menambahkan anggota, silakan input kode yang berbeda" });
    }

    // Tambahkan anggota baru
    const [result] = await pool.query(
      "INSERT INTO member (code, name, penalized_f) VALUES (?, ?, 'F')",
      [code, name]
    );

    const newMemberId = result.insertId;

    const [[newMember]] = await pool.query(
      "SELECT id, code, name FROM member WHERE id = ?",
      [newMemberId]
    );

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambahkan anggota" });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM member");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data anggota" });
  }
};

const checkAllMembers = async (req, res) => {
  try {
    const query = `SELECT a.code,a.name,(select count(b.id) FROM member_borrow b WHERE a.code=b.member_code) as borrowed_books FROM member a`;
    const [rows] = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data anggota" });
  }
};

const MemberBorrowBook = async (req, res) => {
  const { member_code, books } = req.body;

  try {
    // Format tanggal
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
    const proposedReturnDate = new Date(currentDate);
    proposedReturnDate.setDate(proposedReturnDate.getDate() + 7);
    const formattedProposedReturnDate = proposedReturnDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    // Cek apakah anggota ada
    const checkMemberQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [memberRows] = await pool.query(checkMemberQuery, [member_code]);
    if (memberRows.length === 0) {
      return res.status(400).json({ message: "Anggota tidak ada." });
    }

    // Cek apakah anggota meminjam lebih dari 2 buku atau sudah meminjam 2 buku atau lebih
    if (books.length > 2) {
      return res
        .status(400)
        .json({ message: "Tidak bisa meminjam lebih dari 2 buku." });
    }
    var checkBorrowedBookQuery = `SELECT * FROM member_borrow WHERE member_code in (?)`;
    var [borrowedBookRows] = await pool.query(checkBorrowedBookQuery, [
      member_code,
    ]);
    if (borrowedBookRows.length >= 2) {
      return res.status(400).json({
        status: false,
        message: "Anda sudah meminjam 2 buku.",
      });
    }

    // Cek apakah anggota dikenai sanksi
    const checkPenalizedQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [penalizedRow] = await pool.query(checkPenalizedQuery, [member_code]);
    if (
      penalizedRow.length === 0 ||
      penalizedRow[0].penalized_f.toLowerCase() == "y" ||
      penalizedRow[0].penalized_f.toLowerCase() == "t"
    ) {
      return res
        .status(400)
        .json({ message: "Anggota dikenai sanksi dan tidak bisa meminjam buku." });
    }

    // Cek apakah buku sudah dipinjam oleh anggota lain
    const checkBorrowedQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code in (?)`;
    const [borrowedRows] = await pool.query(checkBorrowedQuery, [
      books,
      member_code,
    ]);
    if (borrowedRows.length >= 2) {
      return res.status(400).json({
        status: false,
        message: "Anda sudah meminjam 2 buku.",
      });
    }

    // Lanjutkan untuk meminjam buku
    let successBooksArray = [];
    let failedBooksArray = [];
    let failedBooksMeArray = [];
    let outofstockBooksArray = [];
    const promises = books.map(async (book_code) => {
      let proceed = true;

      // Cek apakah stok masih > 0 atau tidak
      const checkStockQuery = `SELECT stock FROM book WHERE code = ?`;
      const [stockRows] = await pool.query(checkStockQuery, [book_code]);
      if (stockRows.length === 0 || stockRows[0].stock <= 0) {
        // Stok habis
        outofstockBooksArray.push(book_code);
        proceed = false;
      } else {
        // Stok tersedia
        successBooksArray.push(book_code);
      }

      // Cek apakah sedang dipinjam oleh orang lain
      const checkBorrowedQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code not in (?)`;
      const [borrowedRows] = await pool.query(checkBorrowedQuery, [
        book_code,
        member_code,
      ]);
      if (borrowedRows.length > 0) {
        // Dipinjam oleh orang lain
        failedBooksArray.push(book_code);
        successBooksArray.pop(book_code);
        proceed = false;
      }

      if (proceed) {
        // Lanjutkan Peminjaman
        const borrowBookQuery = `INSERT INTO member_borrow (member_code, book_code, borrow_date) VALUES (?, ?, ?)`;
        await pool.query(borrowBookQuery, [
          member_code,
          book_code,
          formattedCurrentDate,
        ]);

        // Kurangi stok
        const decreaseStockQuery = `UPDATE book SET stock = stock - 1 WHERE code = ?`;
        await pool.query(decreaseStockQuery, [book_code]);
      }
    });

    await Promise.all(promises);

    let failedBookMsg = "";
    if (failedBooksArray.length == 1) {
      failedBookMsg = ` Buku ${failedBooksArray.join(
        ", "
      )} masih dipinjam oleh orang lain.`;
    } else if (failedBooksArray.length == 2) {
      // jika semua buku habis dipinjam
      return res.status(400).json({
        status: false,
        message: `Semua buku ${outofstockBooksArray.join(
          ", "
        )} sedang dipinjam oleh orang lain`,
      });
    }

    let outofstockBookMsg = "";
    if (outofstockBooksArray.length == 1) {
      outofstockBookMsg = ` Buku ${outofstockBooksArray.join(
        ", "
      )} stok habis.`;
    } else if (outofstockBooksArray.length == 2) {
      // jika semua buku habis stoknya
      return res.status(400).json({
        status: false,
        message: `Semua buku ${outofstockBooksArray.join(
          ", "
        )} stok habis`,
      });
    }

    return res.status(200).json({
      status: true,
      message: `${member_code} meminjam buku ${successBooksArray.join(
        ", "
      )} dengan sukses. Silakan kembalikan buku sebelum ${formattedProposedReturnDate}, atau Anda akan dikenai sanksi. Anggota dengan sanksi tidak bisa meminjam buku selama 3 hari.${failedBookMsg}${outofstockBookMsg}${failedBookMeMsg}`,
    });
  } catch (error) {
    console.error("Error borrowing books:", error);
    return res
      .status(500)
      .json({ status: false, message: "Kesalahan server internal" });
  }
};

const MemberReturnsBook = async (req, res) => {
  const { member_code, books } = req.body;
  const currentDate = new Date();
  let borrowDate;
  let returnDueDate;
  let formattedReturnDueDate;

  try {
    // Cek apakah anggota ada
    const checkMemberQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [memberRows] = await pool.query(checkMemberQuery, [member_code]);
    if (memberRows.length === 0) {
      return res.status(400).json({ message: "Anggota tidak ada." });
    }

    // Lanjutkan untuk mengembalikan buku
    let successBooksArray = [];
    let failedBooksArray = [];
    const promises = books.map(async (book_code) => {
      let proceed = true;
      // Jika buku benar-benar dipinjam oleh SAYA
      const checkBorrowedMeQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code in (?)`;
      const [borrowedMeRows] = await       pool.query(checkBorrowedMeQuery, [
        book_code,
        member_code,
      ]);
      if (borrowedMeRows.length > 0) {
        // Dipinjam oleh SAYA
        // Jika dikembalikan lebih dari 7 hari, kena sanksi. Hitung 7 hari setelah tanggal pinjam
        borrowDate = new Date(borrowedMeRows[0].borrow_date);
        returnDueDate = new Date(borrowDate);
        returnDueDate.setDate(returnDueDate.getDate() + 7);
        formattedReturnDueDate = returnDueDate.toISOString().slice(0, 10);

        // Cek apakah hari ini sudah melewati tanggal pengembalian
        if (currentDate > returnDueDate) {
          const penalizedMemberQuery = `UPDATE member SET penalized_f = 'Y', penalized_date = CURRENT_DATE() WHERE code = ?`;
          await pool.query(penalizedMemberQuery, [member_code]);
        }
        successBooksArray.push(book_code);
      } else {
        failedBooksArray.push(book_code);
        proceed = false;
      }

      if (proceed) {
        // Lanjutkan Pengembalian
        // Hapus buku dari member_borrow
        const returnBookQuery = `DELETE FROM member_borrow WHERE member_code = ? AND book_code = ?`;
        await pool.query(returnBookQuery, [member_code, book_code]);

        // Tambah stok buku
        const increaseStockQuery = `UPDATE book SET stock = stock + 1 WHERE code = ?`;
        await pool.query(increaseStockQuery, [book_code]);
      }
    });

    await Promise.all(promises);

    let failedBookMsg = "";
    if (failedBooksArray.length == 1) {
      failedBookMsg = ` Buku ${failedBooksArray.join(
        ", "
      )} tidak sedang dipinjam oleh anggota.`;
    } else if (failedBooksArray.length == 2) {
      // semua buku tidak sedang dipinjam
      return res.status(400).json({
        status: false,
        message: `Semua buku ${failedBooksArray.join(
          ", "
        )} tidak sedang dipinjam oleh anggota.`,
      });
    }
    if (successBooksArray.length == 0) {
      return res.status(400).json({
        status: false,
        message: `Semua buku ${failedBooksArray.join(
          ", "
        )} tidak sedang dipinjam oleh anggota.`,
      });
    }

    return res.status(200).json({
      status: true,
      message: `Buku ${successBooksArray.join(
        ", "
      )} berhasil dikembalikan oleh ${member_code}.${failedBookMsg}`,
    });
  } catch (error) {
    console.error("Error returning books:", error);
    return res
      .status(500)
      .json({ status: false, message: "Kesalahan server internal" });
  }
};

module.exports = {
  addMember,
  getAllMembers,
  checkAllMembers,
  MemberBorrowBook,
  MemberReturnsBook,
};
