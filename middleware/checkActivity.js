const checkActive = (req, res, next) => {
    console.log('Checking if user is active');
    if (req.active) {
        next();
    } else {
        return res.status(403).json({ message: 'User inactive' });
    }
};

module.exports = checkActive;
