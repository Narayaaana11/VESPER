// VESPER Enterprise Mailer & Notification Engine
// Dual-mode: Production SMTP via environment variables + Resilient local fallback

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailerResult {
  success: boolean;
  messageId: string;
  previewUrl?: string;
  error?: string;
}

class MailerService {
  private transporterPromise: Promise<any> | null = null;

  private async getTransporter() {
    if (this.transporterPromise) return this.transporterPromise;

    this.transporterPromise = (async () => {
      try {
        const nodemailerModule = await import(/* @vite-ignore */ "nodemailer");
        const nodemailer = nodemailerModule.default || nodemailerModule;

        const host = process.env["SMTP_HOST"];
        const port = Number(process.env["SMTP_PORT"]) || 587;
        const user = process.env["SMTP_USER"];
        const pass = process.env["SMTP_PASS"];

        if (host && user && pass) {
          console.log(`[VESPER Mailer] Initializing production SMTP transporter (${host}:${port})...`);
          return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
          });
        }

        console.log(
          "[VESPER Mailer] No SMTP credentials detected in environment. Using development simulated mailer.",
        );
        return null;
      } catch (err) {
        console.warn("[VESPER Mailer] Nodemailer dynamic initialization error:", err);
        return null;
      }
    })();

    return this.transporterPromise;
  }

  public async sendMail(options: SendMailOptions): Promise<MailerResult> {
    const fromAddress = process.env["SMTP_FROM"] || "VESPER Systems <contact@vesper.ai>";

    try {
      const transporter = await this.getTransporter();

      if (transporter) {
        const info = await transporter.sendMail({
          from: fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.subject,
        });

        console.log(`[VESPER Mailer] Email dispatched to ${options.to} (ID: ${info.messageId})`);
        return {
          success: true,
          messageId: info.messageId,
        };
      }

      // Simulated local transport
      const simulatedId = `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      console.log(`\n================== [VESPER MAIL DISPATCHED] ==================`);
      console.log(`To:      ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`ID:      ${simulatedId}`);
      console.log(`=============================================================\n`);

      return {
        success: true,
        messageId: simulatedId,
      };
    } catch (err: any) {
      console.error(`[VESPER Mailer] Failed to send email to ${options.to}:`, err);
      return {
        success: false,
        messageId: "",
        error: err?.message || "Unknown SMTP error",
      };
    }
  }

  public async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
    pin: string,
    licenseKey: string,
    origin = "http://localhost:8080",
  ): Promise<MailerResult> {
    const verifyUrl = `${origin}/api/auth/verify-email?email=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your VESPER Account & License</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 540px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 12px; padding: 36px; box-shadow: 0 16px 40px rgba(0,0,0,0.8); }
    .brand { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 24px; display: flex; align-items: center; }
    .heading { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #9a9cae; margin-bottom: 24px; }
    .code-box { background-color: #17181c; border: 1px solid #282a30; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 28px; }
    .pin { font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.3em; color: #ff6b00; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 14px 18px; margin-top: 24px; border-radius: 4px; }
    .license-title { font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 4px; }
    .license-key { font-family: monospace; font-size: 15px; font-weight: 700; color: #f4f4f7; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // SECURE PROTOCOL</div>
    <div class="heading">Verify Your Account</div>
    <p class="text">Hello ${name || "Developer"}, welcome to VESPER. Please verify your email to activate your account and software subscription license for the VESPER desktop application.</p>
    
    <div class="code-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9a9cae; margin-bottom: 6px;">Your 6-Digit Verification PIN</div>
      <div class="pin">${pin}</div>
    </div>

    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${verifyUrl}" class="btn">Verify Account Instantly</a>
    </div>

    <div class="license-box">
      <div class="license-title">Your Assigned Desktop License Key</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <p class="footer">
      If you did not request this email, please ignore this transmission.<br>
      VESPER Systems &copy; 2026. Local-First Voice & Context Engine.
    </p>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject: `[${pin}] Verify your VESPER Account & License`,
      html,
      text: `Your VESPER verification PIN is ${pin}. License Key: ${licenseKey}. Verify at: ${verifyUrl}`,
    });
  }

  public async sendInviteEmail(
    to: string,
    name: string,
    tier: string,
    licenseKey: string,
    origin = "http://localhost:8080",
  ): Promise<MailerResult> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your VESPER Access & License Key</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 540px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 12px; padding: 36px; }
    .brand { font-family: monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 24px; }
    .heading { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #9a9cae; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 8px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 14px 18px; margin-top: 24px; border-radius: 4px; }
    .license-key { font-family: monospace; font-size: 15px; font-weight: 700; color: #f4f4f7; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // FOUNDER ACCESS</div>
    <div class="heading">Your VESPER ${tier.toUpperCase()} Access is Ready</div>
    <p class="text">Hello ${name}, you have been provisioned access to the VESPER ${tier.toUpperCase()} desktop application suite.</p>
    
    <div class="license-box">
      <div style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 4px;">Desktop License Key</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${origin}/#download" class="btn">Download VESPER Desktop</a>
    </div>

    <p class="footer">VESPER Systems &copy; 2026. Local-First Voice & Context Engine.</p>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject: `Your VESPER ${tier.toUpperCase()} License Key & Access`,
      html,
      text: `Hello ${name}, your VESPER ${tier} license key is: ${licenseKey}. Download the app at: ${origin}/#download`,
    });
  }

  public async sendWelcomeEmail(
    to: string,
    name: string,
    licenseKey: string,
    tier = "pro",
    origin = "http://localhost:8080",
  ): Promise<MailerResult> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to VESPER — Your License Key &amp; Getting Started</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c0e; color: #f4f4f7; margin: 0; padding: 32px 16px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #111215; border: 1px solid #23252a; border-radius: 14px; padding: 36px; box-shadow: 0 16px 40px rgba(0,0,0,0.8); }
    .brand { font-family: monospace; font-size: 16px; font-weight: 700; letter-spacing: 0.2em; color: #ff6b00; margin-bottom: 20px; }
    .heading { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.65; color: #9a9cae; margin-bottom: 20px; }
    .btn { display: inline-block; background-color: #ff6b00; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 32px; border-radius: 9px; text-align: center; }
    .license-box { background-color: #17181c; border-left: 3px solid #ff6b00; padding: 16px 20px; margin: 24px 0; border-radius: 6px; }
    .license-title { font-size: 11px; text-transform: uppercase; font-family: monospace; color: #9a9cae; margin-bottom: 6px; }
    .license-key { font-family: monospace; font-size: 17px; font-weight: 700; color: #ff6b00; letter-spacing: 0.05em; }
    .feedback-box { background-color: #15161b; border: 1px solid #262830; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .feedback-title { font-size: 13px; font-weight: 600; color: #ffffff; margin-bottom: 6px; }
    .feedback-text { font-size: 13px; color: #9a9cae; line-height: 1.5; margin: 0; }
    .feedback-link { color: #ff6b00; text-decoration: none; font-weight: 600; }
    .footer { font-size: 11px; color: #525462; margin-top: 32px; text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">VESPER // AMBIENT VOICE ENGINE</div>
    <div class="heading">Welcome to VESPER, ${name || "Developer"}!</div>
    
    <p class="text">
      Thank you for choosing VESPER! Your account has been created and verified instantly. You have immediate access to our low-latency push-to-talk ambient intelligence engine for Windows.
    </p>

    <div class="license-box">
      <div class="license-title">Your Assigned Desktop License Key (${tier.toUpperCase()} TIER)</div>
      <div class="license-key">${licenseKey}</div>
    </div>

    <p class="text">
      To get started, install VESPER Desktop, hold <strong style="color: #ffffff;">F8</strong> anywhere in Windows (Cursor, VS Code, Slack, or Word), speak naturally, and watch your voice injected directly at your cursor with sub-180ms latency.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${origin}/#download" class="btn">Download VESPER Desktop for Windows</a>
    </div>

    <div class="feedback-box">
      <div class="feedback-title">Your Feedback Shapes VESPER</div>
      <p class="feedback-text">
        We are building VESPER to be the fastest, most ergonomic voice productivity suite in the world. If you have any feedback, questions, or ideas, you can reply directly to this email or write to us anytime at <a href="mailto:contact@vesper.ai" class="feedback-link">contact@vesper.ai</a>. We read and respond to every note!
      </p>
    </div>

    <p class="footer">
      No email verification needed &mdash; your software license is active immediately.<br>
      VESPER Platform &copy; 2026. Local-First Voice &amp; Context Intelligence.
    </p>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject: `Welcome to VESPER — Your ${tier.toUpperCase()} License Key & Getting Started`,
      html,
      text: `Hello ${name}! Thank you for joining VESPER. Your account is active and verified instantly with no verification needed. Your License Key: ${licenseKey}. Download VESPER at: ${origin}/#download. If you have any feedback, reply to this email or write to us at contact@vesper.ai!`,
    });
  }
}

export const mailer = new MailerService();
