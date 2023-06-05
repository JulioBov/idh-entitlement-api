import * as aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import nodemailer from 'nodemailer';
import env from '../env.mjs';

const ses = new aws.SES({
  region: env.AWS_REGION,
  defaultProvider,
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

const sendMail = (html, emailTo, subject, attachments = []) => {
  transporter.sendMail(
    {
      from: env.SENDER_EMAIL_ADDRESS,
      to: emailTo,
      subject,
      html,
      attachments,
    },
    // callback
    (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.messageId);
      }
    }
  );
};

export default sendMail;
