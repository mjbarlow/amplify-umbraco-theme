using System;
using Umbraco.Core;

namespace Amplify.Web.Custom.Extensions
{
    public static class StringExtensions
    {
        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static bool HasValue(this string value)
        {
            return !value.IsNullOrWhiteSpace();
        }
    }
}
