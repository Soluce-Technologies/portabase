"use server"
import type {EventPayload, DispatchResult} from '../types';
import nodemailer from 'nodemailer';
import TestEmailSettings from "@/components/emails/email-settings-test"

export async function sendSmtp(
    config: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        password: string;
        from: string;
        to: string | string[];
    },
    payload: EventPayload
): Promise<DispatchResult> {
    console.log(config)
    const transporter = nodemailer.createTransport({
        pool: true,
        host: config.host,
        port: config.port,
        // secure: config.secure,
        secure: true,
        auth: {user: config.user, pass: config.password},
    });



    const result = await transporter.verify();
    console.log(result);

      const html = `
      <h2>${payload.title}</h2>
      <p><strong>Level:</strong> ${payload.level}</p>
      <p>${payload.message.replace(/\n/g, '<br>')}</p>
      ${payload.data ? `<pre>${JSON.stringify(payload.data, null, 2)}</pre>` : ''}
    `;

    const info = await transporter.sendMail({
        from: config.from,
        to: Array.isArray(config.to) ? config.to.join(', ') : config.to,
        // to: config.from,
        subject: `[${payload.level.toUpperCase()}] ${payload.title}`,
        html,
        // subject: "Portabase",
        // html: await render(TestEmailSettings(), {}),
    });

    console.log(info);

    return {
        success: true,
        provider: 'smtp',
        message: `Email sent: ${info.messageId}`,
        response: info,
    };
}