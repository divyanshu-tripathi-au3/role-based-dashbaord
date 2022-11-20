const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../config/index');
const { fetchUser } = require('../repo/user')

const jwtPrivateKey = config.JWT_PRIVATE_KEY
const saltRounds = config.saltRounds;

const createPasswordHash = async rawPassword => await bcrypt.hashSync(rawPassword, saltRounds);

const comparePassword = async (rawPassword, hash) => await bcrypt.compareSync(rawPassword, hash);

const generateAccessToken = userData => {
    const data = {
        userId: userData.userId,
        name: userData.name,
        permissions: userData.permissions,
        email: userData.email,
        vendor: userData.vendor
    }
    const token = jwt.sign(data, jwtPrivateKey);
    return token
}

const verifyAccess = (routePermissions) => async (req, res, next) => {
    const userPermissions = req.userPermissions;
    const permissions = routePermissions.filter(elm => userPermissions.includes(elm))
    if(!!permissions && permissions.length) {
        next()
    } else {
        res.statusCode = 403;
        res.send({
            message: 'You do not have the authorization to access this route'
        })
    }
};

const authorize = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            res.statusCode = 401;
            res.send({ message: 'Authentication required!' })
        }
        const token = req.headers.authorization;
        const { userId, permissions, vendor } = jwt.verify(token, jwtPrivateKey)

        const user = await fetchUser({ _id: userId })
        if(!user) {
            res.statusCode = 401;
            res.send({ message: 'Authentication Failed' })
        }
        if(user.user.status !== 'active') {
            res.statusCode = 401;
            res.send({ message: 'User inactive. Please validate your email!' })
        }
        req.userPermissions = permissions;
        req.userId = userId;
        req.vendor = vendor;
        next();
    } catch (error) {
        console.error('Error while user authorization!');
        res.statusCode = 401;
        res.send({ message: 'Authentication Failed' })
    }
}

module.exports = {
    createPasswordHash,
    comparePassword,
    generateAccessToken,
    verifyAccess,
    authorize
}