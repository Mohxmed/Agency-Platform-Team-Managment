import nodemailer from "nodemailer";

const BRAND = {
  name: "نقطة",
  nameEn: "No2ta",
  email: "hello@nokta.com",
  primary: "#e82125",
  primaryDark: "#b2171a",
  primaryLight: "#ff595c",
  bg: "#f9fafb",
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
};

function emailTemplate({ name, email, phone, message }) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>رسالة جديدة من ${name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Segoe UI',Tahoma,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryDark});border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.15);line-height:56px;text-align:center;margin-bottom:12px;">
                      <span style="font-size:26px;color:#fff;">✦</span>
                    </div>
                    <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">
                      ${BRAND.name}
                      <span style="font-weight:400;opacity:0.6;"> | </span>
                      <span style="font-weight:300;">${BRAND.nameEn}</span>
                    </h1>
                    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">
                      رسالة جديدة من نموذج التواصل
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px;border-left:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};">

              <!-- INTRO -->
              <p style="margin:0 0 24px;font-size:15px;color:${BRAND.text};line-height:1.8;">
                تم استقبال رسالة جديدة من خلال موقع <strong>${BRAND.name}</strong>، إليك تفاصيلها:
              </p>

              <!-- INFO CARD -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:middle;">
                                <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:${BRAND.primary}15;line-height:32px;text-align:center;font-size:14px;">👤</span>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0;font-size:11px;color:${BRAND.muted};">الاسم</p>
                                <p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${BRAND.text};">${name}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:middle;">
                                <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:${BRAND.primary}15;line-height:32px;text-align:center;font-size:14px;">✉️</span>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0;font-size:11px;color:${BRAND.muted};">البريد الإلكتروني</p>
                                <p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${BRAND.primary};">
                                  <a href="mailto:${email}" style="color:${BRAND.primary};text-decoration:none;">${email}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid ${BRAND.border};">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:middle;">
                                <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:${BRAND.primary}15;line-height:32px;text-align:center;font-size:14px;">📞</span>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0;font-size:11px;color:${BRAND.muted};">رقم الهاتف</p>
                                <p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${BRAND.text};">${phone}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding:16px 20px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;">
                                <span style="display:inline-block;width:32px;height:32px;border-radius:8px;background:${BRAND.primary}15;line-height:32px;text-align:center;font-size:14px;">💬</span>
                              </td>
                              <td style="vertical-align:top;">
                                <p style="margin:0;font-size:11px;color:${BRAND.muted};">الرسالة</p>
                                <p style="margin:4px 0 0;font-size:14px;line-height:1.8;color:${BRAND.text};">${message}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- REPLY CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}"
                       style="display:inline-block;padding:12px 32px;border-radius:10px;background:${BRAND.primary};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
                      رد على ${name}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-size:12px;color:${BRAND.muted};text-align:center;">
                أو يمكنك الرد مباشرة على هذا البريد الإلكتروني
              </p>

            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;background:#ffffff;">
              <hr style="margin:0;border:none;border-top:1px solid ${BRAND.border};" />
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:24px 40px 32px;border-left:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};border-bottom:1px solid ${BRAND.border};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <a href="mailto:${BRAND.email}" style="color:${BRAND.primary};font-size:13px;text-decoration:none;">
                      ${BRAND.email}
                    </a>
                    <span style="color:${BRAND.border};margin:0 8px;">|</span>
                    <span style="color:${BRAND.muted};font-size:13px;">${BRAND.name} ${BRAND.nameEn}</span>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:11px;color:${BRAND.muted};line-height:1.6;">
                      تم الإرسال تلقائياً من موقع ${BRAND.name}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "الاسم والبريد الإلكتروني والرسالة مطلوبين." },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `✉️ رسالة جديدة من ${name} — ${BRAND.name}`,
      html: emailTemplate({ name, email, phone, message }),
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return Response.json(
      { error: error.message || "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى." },
      { status: 500 },
    );
  }
}
