namespace Amplify.Web.Custom.Helpers
{
    public static class AmplifyHtmlHelper
    {
        public static string Alignment(string alignment)
        {

            switch (alignment)
            {
                case HtmlConstants.HasTextCentered:
                    return HtmlConstants.IsCentered;

                case HtmlConstants.HasTextRight:
                    return HtmlConstants.IsRight;
            }

            return string.Empty;
        }

        public static string CenteredContent(string alignment)
        {
            switch (alignment)
            {
                case HtmlConstants.HasTextCentered:
                    return HtmlConstants.HasCenteredContent;
            }

            return string.Empty;
        }

        public static bool IsFullWidth(string width)
        {
            return width == HtmlConstants.IsFullWidth;
        }
    }
}
