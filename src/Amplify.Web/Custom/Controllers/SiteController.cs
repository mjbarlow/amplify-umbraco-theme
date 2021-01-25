using System.Web.Mvc;
using Amplify.Web.Custom.Services;
using Umbraco.Web.Mvc;
using Umbraco.Web.PublishedModels;

namespace Amplify.Web.Custom.Controllers
{
    public class SiteController : SurfaceController
    {
        private readonly ISiteService _siteConfigService;

        public SiteController(ISiteService siteConfigService)
        {
            _siteConfigService = siteConfigService;
        }

        public ActionResult RenderShareLinks(string title, string textClass, bool noColumn = false, bool hasLargeIcons = false, string alignment = "", bool isCentered = false)
        {

            var model = new ShareLinkSettings()
            {
                
                Title = title,
                TextClass = textClass,
                NoColumn = noColumn,
                HasLargeIcons = hasLargeIcons,
                Alignment = alignment,
                IsCentered = isCentered
            };

            return View("~/views/partials/sharelinks.cshtml", model);
        }

    }
}
