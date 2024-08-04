exports.longestWord = (req, res) => {
    const { sentence } = req.body;
    const words = sentence.split(' ');
    let longest = '';

    words.forEach(word => {
        if (word.length > longest.length) {
            longest = word;
        }
    });

    res.json({ longest, length: longest.length });
};
