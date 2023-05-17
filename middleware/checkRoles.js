const roleList = {
    guest: 0,
    user: 2 ** 0,
    vip: 2 ** 1,
    guide: 2 ** 2,
    globalRoles: 2 ** 3,
    localMod: 2 ** 4,
    admin: 2 ** 5,
    superAdmin: 2 ** 6,
};

const hasRoles = (...args) => {
    return (req, res, next) => {
        let flag = false;
        args.forEach((arg) => {
            if (req.roles & arg) flag = true;
        });
        if (flag) next();
        else
            return res
                .status(403)
                .json({ message: 'Insuffcient permissions.' });
    };
};

const hasAllRoles = (...args) => {
    return (req, res, next) => {
        args.forEach((arg) => {
            if ((req.roles & arg) === 0)
                return res
                    .status(403)
                    .json({ message: 'Insuffcient permissions.' });
        });
        next();
    };
};
const hasNoRoles = () => {
    return (req, res, next) => {
        if (req.roles)
            return res.status(403).json({ message: 'User has roles.' });
        next();
    };
};

const CanPerfomAction = () => {
    return (req, res, next) => {
        const isUserActionOnThemselves =
            req.user === req.body.username || req.body.username === undefined;
        if (isUserActionOnThemselves) {
            next();
        } else {
            const checkRolesMiddleware = hasRoles(
                roleList.admin,
                roleList.superAdmin,
            );
            checkRolesMiddleware(req, res, next);
        }
    };
};

module.exports = {
    roleList,
    hasAllRoles,
    hasRoles,
    hasNoRoles,
    CanPerfomAction,
};
