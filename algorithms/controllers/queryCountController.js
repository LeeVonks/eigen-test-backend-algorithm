exports.queryCount = (req, res) => {
    const { input, query } = req.body;
    const output = query.map(q => input.filter(item => item === q).length);
    res.json({ output });
};
