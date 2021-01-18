using System;
using System.Reflection;
using Umbraco.Core.Models.PublishedContent;

namespace Amplify.Web.Custom.Helpers
{
    public static class ContentHelper
    {
        public static T SetProperty<T>(IPublishedElement content, string property, object value)
        {
            var typedContent = (T)content;

            TrySetProperty(typedContent, property, value);

            return typedContent;
        }

        private static void TrySetProperty(object obj, string property, object value)
        {
            var prop = obj.GetType().GetProperty(property, BindingFlags.Public | BindingFlags.Instance);
            if (prop != null && prop.CanWrite)
            {
                prop.SetValue(obj, value, null);
            }
        }

        public static string CleanValue(this string value)
        {
            value = value.Trim().Replace(" ", "-");
            return value;
        }
    }

    public class ValueHelper
    {
        public object SetValues(IPublishedElement element)
        {
            var type = Type.GetType($"Umbraco.Web.PublishedModels.{element.ContentType.Alias},Umbraco.Web.PublishedModels", false, true);

            var parametersArray = new object[] { element, "IsContentPage", true };

            var method = typeof(ContentHelper).GetMethod(nameof(ContentHelper.SetProperty));
            var generic = method?.MakeGenericMethod(type);
            var typedContent = generic?.Invoke(this, parametersArray);
            return typedContent;
        }

    }
}
