using System;

namespace Amplify.Web.Custom.Extensions
{
    public static class DateExtensions
    {
        public static string ToDisplayDate(this DateTime value)
        {
            return value != DateTime.MinValue ? value.ToString("ddd, MMM dd, yyyy") : string.Empty;
        }
    }
}