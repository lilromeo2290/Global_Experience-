import nodemailer from 'nodemailer'

const NOTIFICATION_EMAILS = [
  'globalexperiencegh@gmail.com',
]

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailParams {
  to?: string[]
  subject: string
  html: string
}

export async function sendEmail({ to = NOTIFICATION_EMAILS, subject, html }: SendEmailParams) {
  try {
    const from = `"Global Experience Placements" <${process.env.SMTP_USER || 'noreply@globalexperiencegh.org'}>`
    const result = await transporter.sendMail({
      from,
      to: to.join(', '),
      subject,
      html,
    })
    console.log('Email sent:', result.messageId)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export function formatApplicationEmail(data: Record<string, string | undefined>) {
  const fields = [
    ['First Name', data.firstName],
    ['Last Name', data.lastName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Nationality', data.nationality],
    ['Program', data.program],
    ['Branch', data.branch],
    ['Duration', data.duration],
    ['Start Date', data.startDate],
    ['End Date', data.endDate],
    ['School / University', data.school],
    ['Course of Study', data.courseOfStudy],
    ['Country Coming From', data.countryOfOrigin],
    ['Airline', data.airline],
    ['Flight Number', data.flightNumber],
    ['Arrival Date', data.arrivalDate],
    ['Arrival Time', data.arrivalTime],
    ['How Did You Hear', data.referral],
    ['Message', data.message],
    ['Payment Status', data.paymentStatus],
    ['Payment Reference', data.paymentReference],
    ['Registration Fee', '$200.00 USD'],
    ['Payment Method', 'Credit Card / Mobile Money / Bank Transfer (via Paystack)'],
  ]

  const rows = fields
    .filter(([, val]) => val)
    .map(([label, val]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">${label}</td>
        <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${val}</td>
      </tr>`)
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #B31B1B, #8B1515); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Volunteer Application</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Global Experience Placements</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="color: #333; margin-bottom: 16px;">A new application has been submitted through the website:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}</table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #1A4D2E; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">Global Experience Placements &mdash; Aligning Skills with Corporate Goals</p>
      </div>
    </div>`
}

export function formatContactMessageEmail(data: Record<string, string | undefined>) {
  const fields = [
    ['First Name', data.firstName],
    ['Last Name', data.lastName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Inquiry Type', data.inquiry],
    ['Interested Program', data.program],
    ['Message', data.message],
  ]

  const rows = fields
    .filter(([, val]) => val)
    .map(([label, val]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">${label}</td>
        <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${val}</td>
      </tr>`)
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #B31B1B, #8B1515); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Message</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Global Experience Placements</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="color: #333; margin-bottom: 16px;">A new message has been received through the contact form:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}</table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #1A4D2E; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">Global Experience Placements &mdash; Aligning Skills with Corporate Goals</p>
      </div>
    </div>`
}

export function formatOutreachDonationEmail(data: Record<string, string | undefined>) {
  const fields = [
    ['Program Area', data.programArea],
    ['Full Name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Organization', data.organization],
    ['Country', data.country],
    ['City', data.city],
    ['Category', data.category],
    ['Item Condition', data.itemCondition],
    ['Quantity', data.quantity],
    ['Description', data.description],
    ['Delivery Method', data.deliveryMethod],
    ['Pickup Address', data.pickupAddress],
    ['Additional Message', data.message],
  ]

  const rows = fields
    .filter(([, val]) => val)
    .map(([label, val]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">${label}</td>
        <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${val}</td>
      </tr>`)
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1A4D2E, #0D2818); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Outreach Donation Offer</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Global Experience Placements</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="color: #333; margin-bottom: 16px;">A new outreach donation offer has been submitted:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}</table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #1A4D2E; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">Global Experience Placements &mdash; Aligning Skills with Corporate Goals</p>
      </div>
    </div>`
}

export function formatPickupRequestEmail(data: Record<string, string | undefined>) {
  const fields = [
    ['Full Name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Nationality', data.nationality],
    ['Flight Number', data.flightNumber],
    ['Airline', data.airline],
    ['Arrival Date', data.arrivalDate],
    ['Arrival Time', data.arrivalTime],
    ['Airport', data.airport],
    ['Accommodation', data.accommodation],
    ['Special Requests', data.specialRequests],
  ]

  const rows = fields
    .filter(([, val]) => val)
    .map(([label, val]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0; white-space: nowrap;">${label}</td>
        <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${val}</td>
      </tr>`)
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1A4D2E, #0D2818); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Airport Pickup Request</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Global Experience Placements</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="color: #333; margin-bottom: 16px;">A new airport pickup request has been submitted:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}</table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #1A4D2E; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">Global Experience Placements &mdash; Aligning Skills with Corporate Goals</p>
      </div>
    </div>`
}

export function formatDonationEmail(data: { name?: string; email?: string; phone?: string; amount?: number; currency?: string; reference?: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #B31B1B, #8B1515); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">New Donation Received!</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Global Experience Placements</p>
      </div>
      <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="color: #333; margin-bottom: 16px;">A new donation has been successfully processed:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0;">Donor Name</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${data.name || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0;">Email</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${data.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0;">Phone</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${data.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0;">Amount</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${data.currency || 'GHS'} ${data.amount || '0'}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: 600; color: #1A4D2E; border-bottom: 1px solid #f0f0f0;">Reference</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">${data.reference || 'N/A'}</td></tr>
        </table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Processed at ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #1A4D2E; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">Global Experience Placements &mdash; Aligning Skills with Corporate Goals</p>
      </div>
    </div>`
}
