const checkActive = () => {
    return (req, res, next) => {
        if (req.active) next();
        else return res.status(403).json({ message: 'User inactive' });
    };
};

module.exports = checkActive;
