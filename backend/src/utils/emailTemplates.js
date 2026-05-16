/**
 * ForgeShare Premium Email System
 * Optimized for clarity, responsiveness, and professional aesthetics.
 * Uses robust table-based buttons for cross-client reliability.
 */

const getBaseTemplate = (content) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ForgeShare Notification</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700&display=swap');
    
    /* Client-specific Styles */
    #outlook a { padding: 0; }
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* Reset Styles */
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0A0A0A; }
    table { border-collapse: collapse !important; }
    
    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .header-title { font-size: 32px !important; }
      .content-text { font-size: 14px !important; }
      .details-box { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A;">
  <center>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A0A0A;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- MAIN CONTAINER -->
          <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #0F0F0F; border: 1px solid #1A1A1A;">
            
            <!-- TOP DECORATION -->
            <tr>
              <td height="4" style="background-color: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>

            <!-- HEADER -->
            <tr>
              <td style="padding: 40px 40px 20px 40px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 0.5em; font-weight: bold;">
                      FORGESHARE // NOTIFICATION
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 10px;">
                      <span style="font-family: 'Inter', sans-serif; font-weight: 900; color: #FFFFFF; font-size: 20px; text-transform: uppercase; letter-spacing: 0.2em;">Forge<span style="color: #A0A0A0;">Share</span></span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                ${content}
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding: 40px; background-color: #050505; border-top: 1px solid #1A1A1A;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #333333; text-transform: uppercase; letter-spacing: 0.3em; line-height: 1.6;">
                      ForgeShare Community / Artisan Network<br/>
                      Connecting makers around the world<br/>
                      &copy; 2026 / ForgeShare Platform.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;

/**
 * Robust Table-Based Button Helper
 */
const renderButton = (text, url) => `
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" bgcolor="#FFFFFF" style="border-radius: 0;">
              <a href="${url}" target="_blank" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 900; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 0.2em; padding: 18px 32px; border: 1px solid #FFFFFF; display: inline-block;">
                ${text}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

/**
 * Shared Component Styles
 */
const badgeStyle = "display: inline-block; background-color: #1A1A1A; border: 1px solid #333333; color: #A0A0A0; font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 4px 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 24px;";
const h1Style = "font-family: 'Inter', sans-serif; font-size: 44px; font-weight: 900; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.04em; line-height: 0.95; margin: 0 0 24px 0;";
const contentStyle = "font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.6; color: #888888; margin-bottom: 32px;";
const detailsBoxStyle = "background-color: #050505; border: 1px solid #1A1A1A; padding: 24px; margin-bottom: 32px;";
const detailRowStyle = "padding: 12px 0; border-bottom: 1px solid #141414;";
const detailLabelStyle = "font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase; color: #444444; display: block; margin-bottom: 4px;";
const detailValueStyle = "font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase;";

exports.getBookingRequestTemplate = (data) => getBaseTemplate(`
  <div style="${badgeStyle}">New Request</div>
  <h1 style="${h1Style}">Gear <br/> Requested.</h1>
  <p style="${contentStyle}">
    Another user is interested in renting your gear. Please review the booking details below to accept or decline the request.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Tool / Gear</span>
      <span style="${detailValueStyle}">${data.listingTitle}</span>
    </div>
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Renter</span>
      <span style="${detailValueStyle}">${data.renterName}</span>
    </div>
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Rental Period</span>
      <span style="${detailValueStyle}">${data.duration}</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Earnings</span>
      <span style="${detailValueStyle}; color: #00FF00;">₹${data.totalPrice}</span>
    </div>
  </div>
  ${renderButton('Review Request', `${process.env.FRONTEND_URL}/profile`)}
`);

exports.getBookingConfirmedTemplate = (data) => getBaseTemplate(`
  <div style="${badgeStyle}">Booking Confirmed</div>
  <h1 style="${h1Style}">Gear <br/> Confirmed.</h1>
  <p style="${contentStyle}">
    Your rental request has been approved. You can now coordinate with the owner to arrange the pickup.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Tool / Gear</span>
      <span style="${detailValueStyle}">${data.listingTitle}</span>
    </div>
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Owner</span>
      <span style="${detailValueStyle}">${data.ownerName}</span>
    </div>
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Rental Period</span>
      <span style="${detailValueStyle}">${data.duration}</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Total Paid</span>
      <span style="${detailValueStyle}">₹${data.totalPrice}</span>
    </div>
  </div>
  ${renderButton('View Booking', `${process.env.FRONTEND_URL}/profile`)}
`);

exports.getBookingCancelledTemplate = (data) => getBaseTemplate(`
  <div style="${badgeStyle}">Booking Cancelled</div>
  <h1 style="${h1Style}">Booking <br/> Cancelled.</h1>
  <p style="${contentStyle}">
    The booking for the gear mentioned below has been cancelled. If you have any questions, please contact support.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Tool / Gear</span>
      <span style="${detailValueStyle}">${data.listingTitle}</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Status</span>
      <span style="${detailValueStyle}">Cancelled</span>
    </div>
  </div>
  ${renderButton('Browse Other Gear', `${process.env.FRONTEND_URL}/rent`)}
`);

exports.getPasswordResetTemplate = (resetUrl) => getBaseTemplate(`
  <div style="${badgeStyle}">Security Update</div>
  <h1 style="${h1Style}">Reset <br/> Password.</h1>
  <p style="${contentStyle}">
    A password reset was requested for your account. If you did not make this request, please ignore this email.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Action</span>
      <span style="${detailValueStyle}">Password Reset</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Security Level</span>
      <span style="${detailValueStyle}">Secure</span>
    </div>
  </div>
  ${renderButton('Reset My Password', resetUrl)}
  <p style="margin-top: 32px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #444444; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">
    This link will expire in 10 minutes.
  </p>
`);

exports.getVerificationTemplate = (verificationUrl) => getBaseTemplate(`
  <div style="${badgeStyle}">Welcome to ForgeShare</div>
  <h1 style="${h1Style}">Verify <br/> Email.</h1>
  <p style="${contentStyle}">
    Thank you for joining our community. Please verify your email address to get started and unlock all features.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Purpose</span>
      <span style="${detailValueStyle}">Email Verification</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Status</span>
      <span style="${detailValueStyle}; color: #FFFF00;">Action Required</span>
    </div>
  </div>
  ${renderButton('Verify My Email', verificationUrl)}
`);

exports.getTwoFactorTemplate = (otp) => getBaseTemplate(`
  <div style="${badgeStyle}">Security Code</div>
  <h1 style="${h1Style}">Security <br/> Code.</h1>
  <p style="${contentStyle}">
    Please use the verification code below to complete your sign-in or authorized action. Do not share this code with anyone.
  </p>
  <div style="${detailsBoxStyle}; text-align: center; border: 2px solid #333333;">
    <span style="${detailLabelStyle}; margin-bottom: 12px;">Your Code</span>
    <span style="font-family: 'JetBrains Mono', monospace; font-size: 42px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3em;">${otp}</span>
  </div>
  <p style="margin-top: 32px; font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #444444; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">
    Code expires in 10 minutes.
  </p>
`);

exports.getSignupWelcomeTemplate = (userName) => getBaseTemplate(`
  <div style="${badgeStyle}">Welcome</div>
  <h1 style="${h1Style}">Hello, <br/> ${userName.split(' ')[0]}.</h1>
  <p style="${contentStyle}">
    We're excited to have you on board. Your account has been successfully created. You're now part of a global community of makers.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Account Status</span>
      <span style="${detailValueStyle}">Active</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Next Step</span>
      <span style="${detailValueStyle}">Complete Your Profile</span>
    </div>
  </div>
  ${renderButton('Complete My Profile', `${process.env.FRONTEND_URL}/onboarding`)}
`);

exports.getOnboardingCompleteTemplate = (userName) => getBaseTemplate(`
  <div style="${badgeStyle}">Profile Completed</div>
  <h1 style="${h1Style}">All <br/> Set.</h1>
  <p style="${contentStyle}">
    Hi ${userName.split(' ')[0]}, your profile is now complete. You have full access to browse and rent gear from the community.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Verification</span>
      <span style="${detailValueStyle}; color: #00FF00;">Complete</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Membership</span>
      <span style="${detailValueStyle}">Full Access</span>
    </div>
  </div>
  ${renderButton('Go to Marketplace', `${process.env.FRONTEND_URL}/marketplace`)}
`);

exports.getLoginAlertTemplate = (data) => getBaseTemplate(`
  <div style="${badgeStyle}">New Login</div>
  <h1 style="${h1Style}">New <br/> Login.</h1>
  <p style="${contentStyle}">
    We noticed a new login to your account. If this was you, you can ignore this email. If not, please change your password immediately.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Date & Time</span>
      <span style="${detailValueStyle}">${new Date().toLocaleString()}</span>
    </div>
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">IP Address</span>
      <span style="${detailValueStyle}">${data.ip || 'Unknown'}</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Device</span>
      <span style="${detailValueStyle}">${data.location || 'Recognized Device'}</span>
    </div>
  </div>
  ${renderButton('Review My Account', `${process.env.FRONTEND_URL}/profile`)}
`);

exports.getPasswordResetSuccessTemplate = () => getBaseTemplate(`
  <div style="${badgeStyle}">Password Changed</div>
  <h1 style="${h1Style}">Key <br/> Updated.</h1>
  <p style="${contentStyle}">
    Your password has been successfully reset. You can now log in to your account with your new password.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Action</span>
      <span style="${detailValueStyle}">Password Reset</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Status</span>
      <span style="${detailValueStyle}; color: #00FF00;">Successful</span>
    </div>
  </div>
  ${renderButton('Log In Now', `${process.env.FRONTEND_URL}/login`)}
`);

exports.getPasswordChangedTemplate = () => getBaseTemplate(`
  <div style="${badgeStyle}">Security Alert</div>
  <h1 style="${h1Style}">Password <br/> Changed.</h1>
  <p style="${contentStyle}">
    Your account password was recently changed. If you did not make this change, please contact our support team immediately.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Action</span>
      <span style="${detailValueStyle}">Password Update</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Method</span>
      <span style="${detailValueStyle}">Profile Settings</span>
    </div>
  </div>
  ${renderButton('Review Security', `${process.env.FRONTEND_URL}/profile`)}
`);

exports.getOnboardingPendingTemplate = (userName) => getBaseTemplate(`
  <div style="${badgeStyle}">Reminder</div>
  <h1 style="${h1Style}">Almost <br/> There.</h1>
  <p style="${contentStyle}">
    Hi ${userName.split(' ')[0]}, you haven't finished setting up your profile yet. Complete the steps to start renting and sharing gear.
  </p>
  <div style="${detailsBoxStyle}">
    <div style="${detailRowStyle}">
      <span style="${detailLabelStyle}">Task</span>
      <span style="${detailValueStyle}">Profile Setup</span>
    </div>
    <div style="${detailRowStyle}; border-bottom: none;">
      <span style="${detailLabelStyle}">Status</span>
      <span style="${detailValueStyle}; color: #FFFF00;">Incomplete</span>
    </div>
  </div>
  ${renderButton('Finish Setup', `${process.env.FRONTEND_URL}/onboarding`)}
`);
