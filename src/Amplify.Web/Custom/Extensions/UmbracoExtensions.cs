using System.Web;
using FaLinksPropertyEditor.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.Web.Models;

namespace Amplify.Web.Custom.Extensions
{
    public static class UmbracoExtensions
    {
        public static bool HasValue(this IPublishedContent content)
        {
            return content != null;
        }

        public static bool HasValue(this Link content)
        {
            return content != null && content.Url != "";
        }

        public static bool HasValue(this IPublishedElement content)
        {
            return content != null;
        }

        public static bool HasValue(this FaLink content)
        {
            return content != null;
        }

        public static bool HasValue(this FaIcon content)
        {
            return content != null;
        }

        public static string FullUrl(this IPublishedContent content)
        {
            var url = content.Url(mode: UrlMode.Absolute);
            if (url.StartsWith("http"))
            {
                return url;
            }

            var domainPrefix = $"https://{HttpContext.Current.Request.ServerVariables["HTTP_HOST"]}/";
            return $"{domainPrefix}{url}";
        }

        public static string FullUrl(this Link content)
        {
            if (!content.HasValue())
            {
                return string.Empty;
            }

            var url = content.Url;
            if (url.StartsWith("http"))
            {
                return url;
            }

            var domainPrefix = $"https://{HttpContext.Current.Request.ServerVariables["HTTP_HOST"]}/";
            return $"{domainPrefix}{url}";

        }
    }
}