export interface SentEmailRecord {
  id: string;
  to: string;
  subject: string;
  html: string;
  otpCode?: string;
  sentAt: string;
  provider: string;
}

// Global in-memory development inbox so developers and automated tests can view dispatched emails in real time
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
  const from = process.env.EMAIL_FROM || "ExamForge Verification <no-reply@examforge.ai>";
  const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;

  let providerUsed = "DEV_CONSOLE";
  let messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 1. Try Resend API if configured
  if (resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
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
        console.log(`[EMAIL DISPATCH] Sent via Resend to ${to} (ID: ${data.id})`);
      }
    } catch (e) {
      console.warn("[EMAIL DISPATCH] Resend failed, falling back to local provider:", e);
    }
  }

  // 2. Try Brevo API if configured
  if (providerUsed === "DEV_CONSOLE" && brevoApiKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "ExamForge", email: from.includes("<") ? from.split("<")[1].replace(">", "") : from },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });
      const data = await res.json();
      if (res.ok && data.messageId) {
        providerUsed = "BREVO";
        messageId = data.messageId;
        console.log(`[EMAIL DISPATCH] Sent via Brevo to ${to} (ID: ${data.messageId})`);
      }
    } catch (e) {
      console.warn("[EMAIL DISPATCH] Brevo failed, falling back to local provider:", e);
    }
  }

  // Record in dev mailbox store
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

  // Highlight in console for instant developer feedback
  console.log(`\n======================================================`);
  console.log(`📧 [EXAMFORGE EMAIL SERVICE] [${providerUsed}]`);
  console.log(`TO:      ${to}`);
  console.log(`SUBJECT: ${subject}`);
  if (otpCode) {
    console.log(`🔑 OTP CODE: >>> ${otpCode} <<< (Valid for 10 minutes)`);
  }
  console.log(`TIMESTAMP: ${new Date().toLocaleTimeString()}`);
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
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
          .header span { color: #38bdf8; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #0284c7; background: #e0f2fe; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px; }
          .otp-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0284c7; font-family: monospace; }
          .info { font-size: 13px; color: #64748b; line-height: 1.6; }
          .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ExamForge<span>.AI</span></h1>
          </div>
          <div class="content">
            <span class="badge">Official Verification</span>
            <h2 style="font-size: 18px; margin: 0 0 12px; color: #0f172a;">${titles[purpose]}</h2>
            <p class="info">${descriptions[purpose]}</p>
            <div class="otp-box">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Your 6-Digit OTP</div>
              <div class="otp-code">${otp}</div>
            </div>
            <p class="info">
              &bull; This code is valid for <strong>10 minutes</strong>.<br>
              &bull; Never share this code with anyone.<br>
              &bull; If you did not request this, please ignore this email.
            </p>
          </div>
          <div class="footer">
            &copy; 2026 ExamForge Testing Systems. All rights reserved.<br>
            Secure Computer-Based Testing Infrastructure for SSC, UP Police & National Exams.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `${titles[purpose]}: Your ExamForge verification code is ${otp}. Valid for 10 minutes.`,
    otpCode: otp,
  });
}
