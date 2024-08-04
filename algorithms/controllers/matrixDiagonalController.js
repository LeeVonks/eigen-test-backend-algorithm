exports.matrixDiagonalDifference = (req, res) => {
    const { matrix } = req.body;
    const n = matrix.length;
    let primaryDiagonal = 0;
    let secondaryDiagonal = 0;

    for (let i = 0; i < n; i++) {
        primaryDiagonal += matrix[i][i];
        secondaryDiagonal += matrix[i][n - 1 - i];
    }

    const difference = primaryDiagonal - secondaryDiagonal;
    res.json({ difference });
};
