const notFound = (req, res) => res.status(404).json({ERROR:`NOT FOUND ERROR`,message:'Route does not exist'})

module.exports = notFound
