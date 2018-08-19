var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../config/config')

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

module.exports={
    sendMailText(text,subject='关注此条信息'){
        this.sendMail('923731573@qq.com',subject,text);
    },
    sendMail(recipient, subject, html){
        smtpTransport.sendMail({
            from: config.email.user,
            to: recipient,
            subject: subject,
            html: html

        }, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    }
}