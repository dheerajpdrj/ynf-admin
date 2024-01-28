import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";

const gmailEmail = functions.config().gmail.email;

const smtpConfig = {
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: "mlpd npdq kjcs jerp",
  },
};

export const sendEmailCallable = functions.https.onCall(async (data) => {
  const { email, registrationLink } = data;

  try {
    const transporter = nodemailer.createTransport(smtpConfig);

    const subject = "Registration Email";

    // Send the email with an HTML link
    await transporter.sendMail({
      from: gmailEmail,
      to: email,
      subject: subject,
      html: `
        <p>Please click the following link to complete your YNF registration:</p>
        <a href="${registrationLink}">Complete Registration</a>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while sending the email."
    );
  }
});

admin.initializeApp();

export const deleteUserByUid = functions.https.onCall(async (data) => {
  admin.auth().deleteUser(data);
});
