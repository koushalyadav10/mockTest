import nodemailer from "nodemailer";

export interface SentEmailRecord {
  id: string;
  to: string;
  subject: string;
  html: string;
  otpCode?: string;
  sentAt: string;
  provider: string;
}

// Global in-memory development store
declare global {
  var __DEV_EMAIL_STORE__: SentEmailRecord[] | undefined;
}

if (!global.__DEV_EMAIL_STORE__) {
  global.__DEV_EMAIL_STORE__ = [];
}

export const devMailbox = global.__DEV_EMAIL_STORE__!;

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  otpCode?: string;
}): Promise<{ success: boolean; messageId: string; provider: string; previewUrl?: string }> {
  const { to, subject, html, text, otpCode } = params;
  let providerUsed = "DEV_CONSOLE";
  let messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 1. Check for real Gmail App Password SMTP credentials
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"ExamForge Verification" <${gmailUser}>`,
        to,
        subject,
        html,
        text: text || subject,
      });

      providerUsed = "GMAIL_SMTP";
      messageId = info.messageId;
      console.log(`[EMAIL DISPATCH] 🚀 Real Gmail sent to ${to} (MessageId: ${info.messageId})`);
    } catch (err) {
      console.error("[EMAIL DISPATCH] ❌ Gmail SMTP delivery failed:", err);
    }
  }

  // 2. Check for generic standard SMTP (e.g. Brevo SMTP, Amazon SES, SendGrid SMTP)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (providerUsed === "DEV_CONSOLE" && smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"ExamForge" <${smtpUser}>`,
        to,
        subject,
        html,
        text: text || subject,
      });

      providerUsed = "CUSTOM_SMTP";
      messageId = info.messageId;
      console.log(`[EMAIL DISPATCH] 🚀 Custom SMTP sent to ${to} (MessageId: ${info.messageId})`);
    } catch (err) {
      console.error("[EMAIL DISPATCH] ❌ Custom SMTP delivery failed:", err);
    }
  }

  // 3. Check for Resend API
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (providerUsed === "DEV_CONSOLE" && resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "ExamForge Verification <no-reply@examforge.ai>",
          to: [to],
          subject,
          html,
          text: text || subject,
        }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        providerUsed = "RESEND";
        messageId = data.id;
        console.log(`[EMAIL DISPATCH] 🚀 Resend API sent to ${to} (ID: ${data.id})`);
      }
    } catch (e) {
      console.warn("[EMAIL DISPATCH] Resend failed:", e);
    }
  }

  // Record in dev mailbox store for backup & verification
  const record: SentEmailRecord = {
    id: messageId,
    to,
    subject,
    html,
    otpCode,
    sentAt: new Date().toISOString(),
    provider: providerUsed,
  };
  devMailbox.unshift(record);
  if (devMailbox.length > 50) devMailbox.pop();

  // Console output
  console.log(`\n======================================================`);
  console.log(`📧 [EXAMFORGE EMAIL SERVICE] [${providerUsed}]`);
  console.log(`TO:      ${to}`);
  console.log(`SUBJECT: ${subject}`);
  if (otpCode) {
    console.log(`🔑 OTP CODE: >>> ${otpCode} <<< (Valid for 10 minutes)`);
  }
  console.log(`TIMESTAMP: ${new Date().toLocaleTimeString()}`);
  if (providerUsed === "DEV_CONSOLE") {
    console.log(`ℹ️ NOTE: To send actual emails to your Gmail inbox, add your GMAIL_USER and GMAIL_APP_PASSWORD in .env`);
  }
  console.log(`======================================================\n`);

  return { success: true, messageId, provider: providerUsed };
}

export async function sendOtpEmail(to: string, otp: string, purpose: "SIGNUP" | "LOGIN" | "RESET_PASSWORD" = "SIGNUP") {
  const titles = {
    SIGNUP: "Verify Your ExamForge Account",
    LOGIN: "Your One-Time Login Code",
    RESET_PASSWORD: "Reset Your ExamForge Password",
  };

  const descriptions = {
    SIGNUP: "Thank you for creating an account on ExamForge. Please use the 6-digit One-Time Password (OTP) below to complete your registration.",
    LOGIN: "You requested a secure login to your ExamForge student portal. Use this code to authenticate your session.",
    RESET_PASSWORD: "We received a request to reset the password for your ExamForge account. Use this code to proceed.",
  };

  const subject = `${titles[purpose]} - ${otp}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 3px 8px; border-radius: 9999px; text-transform: uppercase; margin-top: 6px; }
          .otp-box { text-align: center; margin: 28px 0; background: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 20px; }
          .otp-code { font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0f172a; margin: 0; }
          .expiry-note { font-size: 12px; color: #64748b; margin-top: 8px; }
          .footer { text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="brand">ExamForge</div>
            <div class="badge">Official Examination Verification</div>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            ${descriptions[purpose]}
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry-note">This one-time passcode expires in <strong>10 minutes</strong>. Do not share it with anyone.</div>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            If you did not request this verification code, you can safely ignore this email. Your account credentials remain secure.
          </p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} ExamForge CBT Testing Engine. All rights reserved.<br>
            Secure, Server-Authoritative Competitive Examination Portal
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `${descriptions[purpose]}\n\nYour OTP Code: ${otp}\n\nThis code expires in 10 minutes.`,
    otpCode: otp,
  });
}
