namespace Amplify.Web.Custom.Services
{
    public interface IEmailService
    {
        void SendEmail(string subject, string body, string to, string from, string fromName);
        string RenderEmailTemplate(string templateName, object data);
    }
}