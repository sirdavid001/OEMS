import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private fromEmail = 'OEMS <onboarding@resend.dev>';

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async sendMail(to: string, subject: string, body: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        text: body,
      });

      if (error) {
        console.error('Resend Error:', error);
        return false;
      }

      console.log('Resend Success:', data?.id);
      return true;
    } catch (err) {
      console.error('Mail Delivery Failed:', err);
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
