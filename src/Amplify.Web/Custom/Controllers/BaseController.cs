using Amplify.Web.Custom.Services;
using Umbraco.Web.Mvc;
using Umbraco.Web.PublishedModels;

namespace Amplify.Web.Custom.Controllers
{
    public class BaseController : RenderMvcController
    {
        protected readonly SiteConfig SiteConfig;

        public BaseController(ISiteService siteConfigService)
        {
            if (siteConfigService != null)
            {
                SiteConfig = siteConfigService.SiteConfig;
            }
        }
    }
}
