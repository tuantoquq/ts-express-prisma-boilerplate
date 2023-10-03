import nodemailer from 'nodemailer';
import envConfig from '../configs/env-config';
import logger from '../configs/logger';
import { SendMailDto } from 'src/dtos/email';

const transporter = nodemailer.createTransport(envConfig.email.smtp);

if (envConfig.env !== 'test') {
  transporter
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((err) =>
      logger.error(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env. Details: ',
        err,
      ),
    );
}

/**
 * Send an email
 * @param {SendMailDto} send mail dto
 * @returns {Promise<void>} void
 */
const sendMail = async ({ to, subject, html }: SendMailDto): Promise<void> => {
  const msg = {
    from: `Express Application <${envConfig.email.smtp.auth.user}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(msg);
};

/**
 * Send email forgot password
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>} void
 */
const sendEmailResetPassword = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  const resetLink = `${envConfig.clientUrl}/reset-password?token=${token}`;
  const html = `<p>Dear user</p>
  <p>Please click on the following link to reset your password:</p>
  <p><a href="${resetLink}">${resetLink}</a></p>`;
  await sendMail({ to, subject, html });
};

/**
 * Send email verify email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>} void
 */
const sendEmailVerifyEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Verify email';
  const verifyLink = `${envConfig.clientUrl}/verify-email?token=${token}`;
  const html = `<p>Dear user</p>
  <p>Please click on the following link to verify your email:</p>
  <p><a href="${verifyLink}">${verifyLink}</a></p>`;
  await sendMail({ to, subject, html });
};

export default {
  sendMail,
  sendEmailResetPassword,
  sendEmailVerifyEmail,
};
