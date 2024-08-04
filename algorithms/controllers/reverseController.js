exports.reverseString = (req, res) => {
    const { str } = req.body;
    const reversedAlphabet = str.slice(0, -1).split('').reverse().join('');
    const result = reversedAlphabet + str.slice(-1);
    res.json({ result });
};
