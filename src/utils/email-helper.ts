"use server"
import {prisma} from "@/prisma";
import nodemailer from "nodemailer";

type Payload = {
    to: string;
    subject: string;
    html: any
};

export const sendEmail = async (data: Payload) => {

    const settings = await prisma.settings.findUnique({
        where: {
            name: "system"
        }
    })

    const smtpSettings = {
        host: settings.smtpHost,
        port: parseInt(settings.smtpPort),
        auth: {
            user: settings.smtpUser,
            pass: settings.smtpPassword,
        },
    };

    // Create a transporter object using nodemailer
    const transporter = nodemailer.createTransport({
        ...smtpSettings
    });

    // Set up email options
    const mailOptions = {
        ...data
    };

    return await transporter.sendMail({
        from: settings.smtpFrom,
        ...mailOptions,
    });

};