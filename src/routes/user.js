const router = require("express").Router();
const { createPasswordHash, comparePassword, generateAccessToken, verifyAccess, authorize } = require('../controllers/userController')
const { saveCode, verifyCode } = require('../repo/code')
const { sendPasswordCreationEmail } = require('../mailer')
const { saveAdminUser, updateUser, fetchUser, saveUser, fetchAdminUsers, deleteUser } = require('../repo/user')
const { validateEmailInput, validateUserData, verifyUser, verifyLoginData, validateUserInput, validateUserConfirmation, validateCode, validateForgetPasswordInput, editUser } = require('../validation/validations')
const config = require('../config')



const permissions = {
    admin: 'admin',
    developer: 'developer',
    legal: 'legal',
    analyst: 'analyst',
    support: 'support'
}


// ==============================================================

router.post('/create-admin', async (req, res) => {
    const { name, email, password ,vendor} = req.body;

    const { errors, isValid } = validateUserData(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

   
    const isUserExist = await fetchUser({ email })
    if (!!isUserExist && isUserExist.status === '01') {
        res.status(400).json({
            message: 'user already exists with this email'
        })
    } else {

        const passHash = await createPasswordHash(password)
        // await saveCode(email)
        const result = await saveAdminUser({
            name,
            email,
            password: passHash,
            vendor: vendor
        
        })

        res.status(200).send({
            message: 'Admin is created!',
            data: result
        })
    }    
})


// =========================================================================

router.post('/resend-verification-code', async (req, res) => {
    const { email } = req.body;

    // Handle empty email and invalid email
    const { errors, isValid } = validateEmailInput(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    await saveCode(email)
    res.status(200).send({ message: 'Verification code is sent!' })
})

// =====================================================================

router.post('/verify/admin', async (req, res) => {
    const { email, code } = req.body;

    // Handle empty email and invalid email
    const { errors, isValid } = verifyUser(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    const latestCode = await verifyCode(email)

    if (latestCode !== code) {
        res.status(400).send({ message: 'Email verification failed. Wrong Code!' })
    } else {
        // update and return User data
        const user = await updateUser({ email }, { status: 'active' })
        res.status(200).send({
            message: 'User has been verified!',
            user
        })
    }
})

// ============================================================


router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // verify login data
    const { errors, isValid } = verifyLoginData(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    const result = await fetchUser({ email })
    const user = await updateUser({ email: email }, { status: 'active' })

    if (!!result && result.status && result.status === '01') {
        const passHash = await comparePassword(password, result.user.password)
        if (passHash) {
            // Generate JWT Token
            const token = generateAccessToken({ userId: result.user._id, name: result.user.name, email: result.user.email, permissions: result.user.permissions, vendor: result.user.vendor })
            res.status(200).send({ token: token, message: "success" })
        } else res.status(400).send({ message: 'Incorrect password!' })
    } else {
        res.status(400).send({
            result,
            message: 'No user with this email'
        })
    }
})

// ===========================================================================

router.post('/add-user', authorize, verifyAccess([permissions.admin]), async (req, res) => {
    const { email, name, role } = req.body;

    const { errors, isValid } = validateUserInput(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    const isUserExist = await fetchUser({ email })
    if (!!isUserExist && isUserExist.status === '01') {
        res.status(400).send({
            message: 'user already exists with this email'
        })
    } else {

       
        const password =  Math.random().toString(36).substr(2, 8).toUpperCase();
        // console.log(password)
        const passHash = await createPasswordHash(password)
        
        
        const result = await saveUser({
            adminUserid: req.userId,
            name,
            email,
            password: passHash,
            role: role,
            permissions: role,
            vendor: req.vendor
            
        })
        
        await sendPasswordCreationEmail(email, result._id, name, email, password)
        res.status(200).send({
            message: 'Email has been sent to user!',
            userData: result
        })
    }
})

// ===============================================================================

router.post('/resend-email', authorize, verifyAccess([permissions.admin]), async (req, res) => {
    const { userId } = req.body;
    const isUserExist = await fetchUser({ _id: userId })
    if (!!isUserExist && isUserExist.status === '01') {
        const { name, email, _id } = isUserExist.user; 

        const rawpassword =  Math.random().toString(36).substr(2, 8).toUpperCase();
        console.log(rawpassword)
        const passHash = await createPasswordHash(rawpassword)  
        console.log(passHash)
        const user = await updateUser({ _id: userId }, { password: passHash })

        await sendPasswordCreationEmail(email, _id, name, email, rawpassword)
        res.status(200).send({
            message: 'Email has been sent to user!',
            userData: user
        })
    } else {
        res.status(400).send({
            message: 'No user with this id'
        })
    }
})


// ================================================================================

router.post('/user-confirmation', async (req, res) => {
    const { userId, password } = req.body;

    const { errors, isValid } = validateUserConfirmation(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});


    const passHash = await createPasswordHash(password)
    const user = await updateUser({ _id: userId }, { status: 'active', password: passHash })

    if (!!user) {
        res.status(200).send({
            message: 'User confirmation done!',
            userData: user
        })
    }
})

// =======================================================================

router.get('/users', authorize, verifyAccess([permissions.admin]), async (req, res) => {
    const { userId } = req;
    const result = await fetchAdminUsers(userId)
    res.status(200).send({
        message: 'Success',
        users: result
    })
})


// =============================================================================


router.post('/edit-user', authorize, verifyAccess([permissions.admin]), async (req, res) => {
    const { userId, role } = req.body;

    const { errors, isValid } = editUser(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    const user = await updateUser({ _id: userId }, { role: role.split(',') , permissions: role.split(',') })
    if(!!user) {
        res.status(200).send({
            message: 'user info updated!',
        })
    } else {
        res.status(400).send({
            message: 'Something went wrong'
        })
    }
})


// =======================================================================

router.post('/delete-user', authorize, verifyAccess([permissions.admin]), async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).send({
            message: 'User Id is required!'
        })
    } else {
        const user = await deleteUser(userId)
        if(!!user) {
            res.status(200).send({user, message: 'success'})
        } else {
            res.status(400).send({
                message: 'Something went wrong!'
            })
        }
    }

})

// ================================================================

router.post('/verify-code', async (req, res) => {
    const { code, email } = req.body;
   
    const { errors, isValid } = validateCode(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    const latestCode = await verifyCode(email)

    if (latestCode !== code) {
        res.status(400).send({ message: 'Wrong Code!' })
    } else {
            res.status(200).send({
            message: 'Verification-code is verified.'
           
        })
    }
})



// ==============================================================

router.post('/forget-password', async (req, res) => {
    const { password, email } = req.body;

    const { errors, isValid } = validateForgetPasswordInput(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    // const latestCode = await verifyCode(email)

    // if (latestCode !== code) {
    //     res.status(400).send({ message: 'Wrong Code!' })
    // } else {
        // update and return User data
        const passHash = await createPasswordHash(password)
        const user = await updateUser({ email }, { password: passHash })
        res.status(200).send({
            message: 'Password is changed now.',
            user
        })
    // }
})


// =======================================================================



module.exports = router;