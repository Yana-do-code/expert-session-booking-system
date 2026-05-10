const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

async function sendBookingConfirmation({ to, name, expert, date, startTime, endTime, hourlyRate }) {
  const formattedDate = formatDate(date);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Vedaz</h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">World's Smartest Astrology Platform</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:16px;color:#111827;">Hi <strong>${name}</strong>,</p>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                Your session has been booked successfully. Here are your booking details:
              </p>

              <!-- Booking card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;border-radius:12px;padding:0;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Expert</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#111827;">${expert.name}</span>
                          <span style="display:inline-block;margin-left:8px;padding:2px 10px;background:#eef2ff;color:#4338ca;border-radius:999px;font-size:11px;font-weight:500;">${expert.category}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#111827;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Time Slot</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#111827;">${startTime} – ${endTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Rate</span><br/>
                          <span style="font-size:15px;font-weight:600;color:#4f46e5;">₹${hourlyRate}/hr</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                You can view or manage your booking anytime by visiting <strong>My Bookings</strong> on the Vedaz platform and entering this email address.
              </p>

              <p style="margin:0;font-size:14px;color:#374151;">
                May the stars guide you,<br/>
                <strong style="color:#4f46e5;">Team Vedaz</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Vedaz Astrology" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed – ${expert.name} on ${formattedDate}`,
    html,
  });
}

module.exports = { sendBookingConfirmation };
