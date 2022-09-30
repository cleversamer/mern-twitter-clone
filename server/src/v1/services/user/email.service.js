const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const mail = require("../../config/mail");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: mail.auth.user,
    pass: mail.auth.password,
  },
});

module.exports.registerEmail = async (email, user) => {
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "منصة بيان التعليمية",
        link: "#",
        copyright: "حقوق النسخ © 2022 منصة بيان التعليمية. حميع الحقوق محفوظة.",
      },
    });

    const emailBody = mailGenerator.generate({
      body: {
        title: `<br />
        <center text-align="right">
          هذا هو الكود الخاص بتفعيل بريدك الإلكتروني صالح لمدة 10 دقائق:
          <br /> 
          ${user.emailVerificationCode.code}
          </center>
         <br />`,
        greeting: "Dear",
        signature: user.name || "مستخدم منصة بيان",
      },
    });

    const message = {
      to: email,
      from: "منصة بيان التعليمية",
      html: emailBody,
      subject: "أهلاً بك في منصة بيان التعليمية",
    };

    await transporter.sendMail(message);
    return true;
  } catch (err) {
    throw err;
  }
};

module.exports.forgotPasswordEmail = async (email, user) => {
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "منصة بيان التعليمية",
        link: "#",
        copyright: "حقوق النسخ © 2022 منصة بيان التعليمية. حميع الحقوق محفوظة.",
      },
    });

    const emailBody = mailGenerator.generate({
      body: {
        title: `<br />
        <center text-align="right">
          هذا هو الكود الخاص باستعادة كلمة المرور صالح لمدة 10 دقائق:
          <br /> 
          ${user.resetPasswordCode.code}
          </center>
         <br />`,
        greeting: "Dear",
        signature: user.name || "مستخدم منصة بيان",
      },
    });

    const message = {
      to: email,
      from: "منصة بيان التعليمية",
      html: emailBody,
      subject: "إعادة تعيين كلمة المرور",
    };

    await transporter.sendMail(message);
    return true;
  } catch (err) {
    throw err;
  }
};
