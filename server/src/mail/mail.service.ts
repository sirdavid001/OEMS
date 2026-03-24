import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend?: Resend;
  private readonly fromEmail =
    process.env.MAIL_FROM_EMAIL || 'OEMS <onboarding@resend.dev>';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY is not configured. Email delivery is disabled; messages will be logged instead.',
      );
      return;
    }

    this.resend = new Resend(apiKey);
  }

  private async sendMail(to: string, subject: string, body: string) {
    if (!this.resend) {
      this.logger.warn(
        `Email delivery skipped because RESEND_API_KEY is missing. Intended recipient: ${to}`,
      );
      console.log('--- FALLBACK ENVELOPE ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(body);
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        text: body,
      });

      if (error) {
        this.logger.error(`Resend Error: ${JSON.stringify(error)}`);
        return false;
      }

      this.logger.log(`Resend Success: ${data?.id}`);
      return true;
    } catch (err) {
      this.logger.error(`Mail Delivery Failed: ${err instanceof Error ? err.message : String(err)}`);
      // Fallback to console log in dev if Resend fails/no key
      console.log('--- FALLBACK ENVELOPE ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(body);
      return false;
    }
  }

  async sendCredentials(email: string, name: string, password: string, identifier: string) {
    const body = `
      Hello ${name},
      
      Your account for the Online Examination Management System has been approved!
      
      You can now log in using the following credentials:
      
      Identifier: ${identifier}
      Password: ${password}
      
      Login here: http://localhost:5173/login
      
      Best regards,
      OEMS Administration
    `;
    return this.sendMail(email, 'Your OEMS Account Credentials', body);
  }

  async sendExamScheduled(email: string, name: string, examTitle: string, startTime: Date | null, duration: number) {
    const body = `
      Hello ${name},
      
      A new examination has been scheduled for you:
      
      Exam: ${examTitle}
      Date: ${startTime ? new Date(startTime).toLocaleString() : 'TBD'}
      Duration: ${duration} minutes
      
      Please log in to your dashboard for more details.
      
      Best regards,
      OEMS Administration
    `;
    return this.sendMail(email, `New Exam Scheduled: ${examTitle}`, body);
  }

  async sendResultAvailable(email: string, name: string, examTitle: string, score: number) {
    const body = `
      Hello ${name},
      
      Your result for "${examTitle}" is now available.
      
      Score: ${score}%
      
      Log in to view your detailed performance breakdown.
      
      Best regards,
      OEMS Administration
    `;
    return this.sendMail(email, `Result Available: ${examTitle}`, body);
  }
}
