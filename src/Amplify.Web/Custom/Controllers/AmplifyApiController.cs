using Amplify.Web.Custom.Models;
using Amplify.Web.Custom.Services;
using System.Collections.Generic;
using System.Web.Http;
using Amplify.Web.Custom.Extensions;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using Umbraco.Web.WebApi.Filters;
using uConstants = Umbraco.Core.Constants;

namespace Amplify.Web.Custom.Controllers
{
    //~/Umbraco/backoffice/[YourAreaName]/[YourControllerName]/[method]
    //~/Umbraco/backoffice/Amplify/Theme/Build

    [PluginController(Internals.PluginControllerName)]
    [UmbracoApplicationAuthorize(uConstants.Applications.Content)]
    public class AmplifyApiController : UmbracoAuthorizedApiController
    {
        private readonly ISassService _sassService;
        private readonly ISiteService _siteService;

        public AmplifyApiController(ISassService sassService, ISiteService siteService)
        {
            _siteService = siteService;
            _sassService = sassService;
        }
        public bool GetApi() => true;

        [HttpGet]
        public string BuildSass(string id)
        {
            return int.TryParse(id, out var nodeId) ? _sassService.BuildSass(nodeId) : string.Empty;
        }

        [HttpGet]
        public IList<AmplifyColor> GetColorPalette(string alias)
        {
            return !alias.HasValue() ? null : _siteService.SiteConfig.Theme.Value<List<AmplifyColor>>(alias);
        }

        [HttpGet]
        public IList<AmplifyGradient> GetGradientPalette(string alias)
        {
            return !alias.HasValue() ? null : _siteService.SiteConfig.Theme.Value<List<AmplifyGradient>>(alias);
        }
    }
}