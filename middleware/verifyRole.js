const roleCheck = (roles) => {
    return (req, res, next) => {
        if (!req.roles || !roles.some((role) => req.roles.includes(role))) {
            return res
                .status(403)
                .json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = roleCheck;
