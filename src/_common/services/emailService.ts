import { Service, Token } from 'typedi'
import { SES } from 'aws-sdk'
import { SendEmailResponse } from 'aws-sdk/clients/ses'
import { AWSError } from 'aws-sdk/global'
import { PromiseResult } from 'aws-sdk/lib/request'

const ses = new SES()

export const EmailService = new Token<EmailService>()

export interface EmailServiceSendEmailInput {
  to: string
  subject: string
  message: string
}

export interface EmailService<SendEmailResponseType = void> {
  sendEmail(input: EmailServiceSendEmailInput): Promise<SendEmailResponseType>
}

@Service()
export class SesEmailService
  implements EmailService<PromiseResult<SendEmailResponse, AWSError>> {
  async sendEmail(input: { to: string; subject: string; message: string }) {
    return ses
      .sendEmail({
        Destination: {
          ToAddresses: [input.to],
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: input.message,
            },
            // TODO Html: {
            //   Charset: 'UTF-8',
            //   Data: input.message,
            // },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: input.subject,
          },
        },
        Source: 'rudierosdfr@gmail.com',
      })
      .promise()
  }
}
