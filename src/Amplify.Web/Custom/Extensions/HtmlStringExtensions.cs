using System.Text.RegularExpressions;
using System.Web;

namespace Amplify.Web.Custom.Extensions
{
    public static class HtmlStringExtensions
    {
        public static bool HasValue(this IHtmlString value)
        {
            return !string.IsNullOrWhiteSpace(value.ToString());
        }

        public static IHtmlString StripHtml(this IHtmlString value)
        {
            const string pattern = @"<(.|\n)*?>";
            var result = new HtmlString(Regex.Replace(value.ToString(), pattern, string.Empty));
            return result;
        }
    }
}