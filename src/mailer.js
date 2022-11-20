const sgMail = require('@sendgrid/mail')
const config = require('./config')

sgMail.setApiKey(config.SENDGRID_API_KEY)

const sendEmail = async (to, subject, text) => {
    try {
        return await sgMail.send({ to, from: config.SENDGRID_FROM_EMAIL, subject, text })
    } catch (error) {
        console.log('Email send failed!')
    }
}


const sendVerificationMail = async (to, code) => {
    const message = {
        to,
        subject: 'Verification Code',
        text: `Here is your verification code ${code}

        Thanks & Regards
        `
    }
    return await sendEmail(to, message.subject, message.text)
}



const sendPasswordCreationEmail = async (to, userId, name,  email, password) => {
   
    const message = {
        to,
        subject: 'You have been added to the Dashboard',
        text: `Hello ${name}
        
         Please click on below button to enter the Dashboard:
        https://modular-support-frontend.web.app/login 

                 
                   
        Your credentials are given below:
        Username: ${email}
        Password: ${password}

        Thanks & Regards
        `
      
    }
    return await sendEmail(to, message.subject, message.text)
}

module.exports = {
    sendVerificationMail,
    sendPasswordCreationEmail
}