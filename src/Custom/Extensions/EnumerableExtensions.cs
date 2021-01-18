using System.Collections.Generic;
using System.Linq;

namespace Amplify.Web.Custom.Extensions
{
    public static class EnumerableExtensions
    {
        public static bool HasValue<T>(this IEnumerable<T> content)
        {
            return content != null && content.Any();
        }

        public static IEnumerable<(T item, int index)> WithIndex<T>(this IEnumerable<T> source)
        {
            return source.Select((item, index) => (item, index));
        }
    }
}