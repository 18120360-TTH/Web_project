const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }, 
    tls: {
      // do not fail on http & self-certificate
      rejectUnauthorized: false,
    },
});

let sendMail = (mailOptions)=>{
    transporter.sendMail(mailOptions,(error,info)=> {
        if(error){
            return console.log(error)
        }
    });
};

module.exports = sendMail;