import Handlebars from "handlebars";

// Table-based layout with inline styles + MSO conditionals: the only markup
// style that reliably renders the same across Outlook/Gmail/Apple
// Mail/webmail clients (no flexbox/grid, no external CSS).
const LAYOUT_SOURCE = `<!doctype html>
<html lang="{{lang}}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>{{title}}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">{{previewText}}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; border:1px solid #e4e4e7;">
        <tr>
          <td style="padding:24px 32px; border-bottom:1px solid #e4e4e7;">
            <span style="font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:bold; color:#000000;">{{siteName}}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px; font-family:Arial, Helvetica, sans-serif; color:#27272a; font-size:15px; line-height:1.6;">
            {{{content}}}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px; border-top:1px solid #e4e4e7; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#71717a;">
            {{footerText}}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

Handlebars.registerHelper("nl2br", (text: unknown) => {
  const escaped = Handlebars.Utils.escapeExpression(String(text ?? ""));
  return new Handlebars.SafeString(escaped.replace(/\r\n|\r|\n/g, "<br>\n"));
});

export const layoutTemplate = Handlebars.compile(LAYOUT_SOURCE);
