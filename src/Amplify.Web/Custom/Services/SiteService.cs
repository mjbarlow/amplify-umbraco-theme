using Amplify.Web.Custom.Extensions;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web.PublishedModels;

namespace Amplify.Web.Custom.Services
{
    public class SiteService : ISiteService
    {
        private readonly IAmplifyContentService _amplifyContentService;
        public SiteConfig SiteConfig { get; }
        public SiteService(IAmplifyContentService amplifyContentService)
        {
            if (amplifyContentService == null)
            {
                return;
            }

            _amplifyContentService = amplifyContentService;

            if (!(_amplifyContentService.GetRoot() is Home home))
            {
                return;
            }

            var appConfigNode = _amplifyContentService.GetChild(home.Id, AppConfig.ModelTypeAlias) as AppConfig;

            IPublishedContent navNode = null;
            IPublishedContent footerNode = null;

            if (appConfigNode.HasValue())
            {
                navNode = _amplifyContentService.GetChild(appConfigNode.Id, Nav.ModelTypeAlias);
                footerNode = _amplifyContentService.GetChild(appConfigNode.Id, Footer.ModelTypeAlias);
            }

            SiteConfig = new SiteConfig()
            {
                Home = home,
                AppConfig = appConfigNode.HasValue() ? appConfigNode : null,
                Nav = navNode.HasValue() ? navNode as Nav : null,
                Footer = footerNode.HasValue() ? footerNode as Footer : null,
                Alert = appConfigNode.HasValue() ? new Alert(appConfigNode) : null,
                Theme = appConfigNode.HasValue() ? appConfigNode?.Theme as Theme : null
            };
        }
    }
}