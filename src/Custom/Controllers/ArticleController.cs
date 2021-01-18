using System.Web.Mvc;
using Amplify.Web.Custom.Services;
using Umbraco.Web.Models;
using Umbraco.Web.PublishedModels;

namespace Amplify.Web.Custom.Controllers
{
    public class ArticleController : BaseController
    {
        public ArticleController(ISiteService siteService) : base(siteService)
        { }

        public override ActionResult Index(ContentModel model)
        {
            var article = new Article(model.Content)
            {
                AppConfig = SiteConfig.AppConfig
            };

            return CurrentTemplate(article);
        }
    }
}
