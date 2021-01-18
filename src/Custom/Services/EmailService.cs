using System;
using System.Net.Mail;
using Nustache.Core;
using Umbraco.Core.Logging;

namespace Amplify.Web.Custom.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger _logger;

        public EmailService(ILogger logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Send an SMTP email
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="to"></param>
        /// <param name="from"></param>
        /// <param name="fromName"></param>
        public void SendEmail(string subject, string body, string to, string from, string fromName)
        {
            try
            {
                var mail = new MailMessage(from, to)
                {
                    From = new MailAddress(from, fromName),
                    IsBodyHtml = true,
                    Subject = subject,
                    Body = body,
                    BodyEncoding = System.Text.Encoding.UTF8,
                    SubjectEncoding = System.Text.Encoding.UTF8
                };

                var client = new SmtpClient();
                client.Send(mail);
            }
            catch (Exception e)
            {
                _logger.Error(typeof(EmailService), e);
            }
        }

        /// <summary>
        /// Render a Mustache view into a string, used to quickly create templates.
        /// </summary>
        /// <param name="templateName">The name of the template without the ".mustache" extension</param>
        /// <param name="data">The data to pass into the view</param>
        /// <returns>The rendered template</returns>
        public string RenderEmailTemplate(string templateName, object data)
        {
            var template = AppDomain.CurrentDomain.BaseDirectory + "Views\\EmailTemplates\\" + templateName + ".mustache";
            return Render.FileToString(template, data);
        }

    }
}
