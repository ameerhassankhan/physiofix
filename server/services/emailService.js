const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getApprovalEmailTemplate = (bookingDetails) => {
  const appointmentDate = new Date(bookingDetails.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; line-height: 1.6; }
        .status-badge { display: inline-block; background-color: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .appointment-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .appointment-box h3 { margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px; }
        .appointment-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0f2fe; color: #475569; font-size: 14px; }
        .appointment-detail:last-child { border-bottom: none; }
        .appointment-label { font-weight: 600; color: #334155; }
        .appointment-value { color: #64748b; text-align: right; }
        .cta-section { margin: 30px 0; text-align: center; }
        .cta-button { display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .cta-button:hover { background-color: #059669; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer p { margin: 5px 0; }
        .highlight { color: #0ea5e9; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Appointment Approved!</h1>
          <p>Your appointment has been successfully confirmed</p>
        </div>

        <div class="content">
          <p class="greeting">Hi <span class="highlight">${bookingDetails.name}</span>,</p>

          <p style="font-size: 16px; color: #1e293b; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your appointment request has been <span class="status-badge">APPROVED</span>
          </p>

          <div class="appointment-box">
            <h3>📅 Appointment Details</h3>
            <div class="appointment-detail">
              <span class="appointment-label">Date</span>
              <span class="appointment-value">${appointmentDate}</span>
            </div>
            <div class="appointment-detail">
              <span class="appointment-label">Time</span>
              <span class="appointment-value">${bookingDetails.slot}</span>
            </div>
            <div class="appointment-detail">
              <span class="appointment-label">Type</span>
              <span class="appointment-value">${bookingDetails.type === "online" ? "🖥️ Online" : "🏥 In-Clinic"}</span>
            </div>
            <div class="appointment-detail">
              <span class="appointment-label">Name</span>
              <span class="appointment-value">${bookingDetails.name}</span>
            </div>
          </div>

          ${bookingDetails.note ? `<p style="font-size: 14px; color: #64748b; background-color: #f1f5f9; padding: 12px; border-radius: 6px;"><strong>Note:</strong> ${bookingDetails.note}</p>` : ""}

          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 20px;">
            Please mark your calendar and ensure you're ready a few minutes before the scheduled time. If this is an online appointment, you'll receive a meeting link prior to your appointment.
          </p>

          <div class="cta-section">
            <a href="mailto:support@physiofix.com" class="cta-button">Contact Support</a>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 20px; text-align: center;">
            If you need to reschedule or have any questions, please don't hesitate to reach out.
          </p>
        </div>

        <div class="footer">
          <p><strong>PhysioFix Clinic</strong></p>
          <p>Transforming Lives Through Physiotherapy</p>
          <p>© 2026 PhysioFix. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getRejectionEmailTemplate = (bookingDetails) => {
  const appointmentDate = new Date(bookingDetails.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 16px; color: #1e293b; margin-bottom: 20px; line-height: 1.6; }
        .status-badge { display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .appointment-box { background-color: #fef2f2; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .appointment-box h3 { margin: 0 0 15px 0; color: #7c2d12; font-size: 16px; }
        .appointment-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fed7aa; color: #475569; font-size: 14px; }
        .appointment-detail:last-child { border-bottom: none; }
        .appointment-label { font-weight: 600; color: #334155; }
        .appointment-value { color: #64748b; text-align: right; }
        .contact-box { background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .contact-box p { margin: 0; font-size: 14px; color: #1e293b; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        .footer p { margin: 5px 0; }
        .highlight { color: #f97316; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Status Update</h1>
          <p>We've made a decision regarding your appointment request</p>
        </div>

        <div class="content">
          <p class="greeting">Hi <span class="highlight">${bookingDetails.name}</span>,</p>

          <p style="font-size: 16px; color: #1e293b; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your appointment request. Unfortunately, we are unable to accommodate it at this time. Status: <span class="status-badge">REJECTED</span>
          </p>

          <div class="appointment-box">
            <h3>📅 Appointment Details</h3>
            <div class="appointment-detail">
              <span class="appointment-label">Date</span>
              <span class="appointment-value">${appointmentDate}</span>
            </div>
            <div class="appointment-detail">
              <span class="appointment-label">Time</span>
              <span class="appointment-value">${bookingDetails.slot}</span>
            </div>
            <div class="appointment-detail">
              <span class="appointment-label">Type</span>
              <span class="appointment-value">${bookingDetails.type === "online" ? "🖥️ Online" : "🏥 In-Clinic"}</span>
            </div>
          </div>

          <div class="contact-box">
            <p><strong>📞 What's Next?</strong></p>
            <p style="margin-top: 8px;">Please feel free to reach out to our clinic to discuss alternative time slots or to provide any additional information that might help us accommodate your appointment.</p>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 20px;">
            We sincerely apologize for any inconvenience. We hope to assist you with your healthcare needs in the near future. If you have any questions or would like to reschedule, please don't hesitate to contact us.
          </p>
        </div>

        <div class="footer">
          <p><strong>PhysioFix Clinic</strong></p>
          <p>Transforming Lives Through Physiotherapy</p>
          <p>© 2026 PhysioFix. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendApprovalEmail = async (toEmail, bookingDetails) => {
  try {
    const htmlContent = getApprovalEmailTemplate(bookingDetails);
    const plainTextContent = `Hello ${bookingDetails.name},\n\nYour appointment on ${new Date(bookingDetails.date).toLocaleDateString()} at ${bookingDetails.slot} has been successfully approved!\n\nType: ${bookingDetails.type}\n\nThank you,\nPhysioFix Team`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Appointment Approved! 🎉",
      text: plainTextContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Approval email sent to ${toEmail}:`,
      info.response,
    );
    return { success: true, response: info.response };
  } catch (error) {
    console.error("[Email Service] Failed to send approval email:", error);
    return { success: false, error: error.message };
  }
};

const sendRejectionEmail = async (toEmail, bookingDetails) => {
  try {
    const htmlContent = getRejectionEmailTemplate(bookingDetails);
    const plainTextContent = `Hello ${bookingDetails.name},\n\nUnfortunately, your appointment request on ${new Date(bookingDetails.date).toLocaleDateString()} at ${bookingDetails.slot} has been rejected.\n\nPlease contact us for further assistance.\n\nThank you,\nPhysioFix Team`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Appointment Status Updated",
      text: plainTextContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Rejection email sent to ${toEmail}:`,
      info.response,
    );
    return { success: true, response: info.response };
  } catch (error) {
    console.error("[Email Service] Failed to send rejection email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};
