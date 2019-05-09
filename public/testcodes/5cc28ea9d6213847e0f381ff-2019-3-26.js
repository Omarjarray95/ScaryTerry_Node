const nodemailer = require('nodemailer');

var testMail = async (req) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = await nodemailer.createTestAccount();

    let user = account.user;
    let pass = account.pass;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log(account);

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'saidi3mahdi@gmail.com', // sender address
        to: "elmahdi.saidi@esprit.tn", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>', // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            //req.status(500).json(error);
            return process.exit(1);
        }
        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        transporter.close();
    });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

testMail();