const { User } = require('../config/dbConfig')

const saveAdminUser = async (data) => {
    const adminData = new User({
        name: data.name,
        email: data.email,
        role: 'admin',
        status: 'AccountCreated',
        permissions: 'admin',
        password: data.password,
        vendor: data.vendor || "ohm"
    })
    return await adminData.save()
}

const saveUser = async (data) => {
     const isExist = await User.findOne({email: data.email})
     if (!!isExist) return {
         status: '00',
         message: 'user already exists with this email'
     }
    const userData = new User({
        adminUser: data.adminUserid,
        name: data.name,
        email: data.email,
        role: data.role.split(','),
        permissions: data.role.split(','),
        status: 'AccountCreated',
        password: data.password,
        vendor: data.vendor
    })
    return await userData.save()
}

const fetchUser = async condition => {
    try {
        const user = await User.findOne({ ...condition })
        if(!!user) return { status: '01', user }
        return 'No user found for this email id!'
    } catch (error) {
        console.log('Error while user login!')
    }
}


const updateUser = async (condition, data) => {
    try {
        const doc = await User.findOneAndUpdate({ ...condition }, { ...data }, { new: true });
        return doc
    } catch (error) {
        console.log('Error While updating user!')
    }
}

const fetchAdminUsers = async adminId => await User.find({ adminUser: adminId })

const deleteUser = async userId => {
    try {
        const user = await User.findByIdAndDelete({ _id: userId })
        if(!user) return { status: 'failed' }
        return { status: 'success' }
    } catch (error) {
        console.log('Something went wrong while deleting user')
    }
}

module.exports = {
    saveAdminUser,
    updateUser,
    fetchUser,
    saveUser,
    fetchAdminUsers,
    deleteUser
}