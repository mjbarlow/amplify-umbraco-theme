using Amplify.Web.Custom.Services;
using Umbraco.Core;
using Umbraco.Core.Cache;
using Umbraco.Core.Services;
using Umbraco.Web.Mvc;
using Current = Umbraco.Web.Composing.Current;

namespace Amplify.Web.Custom.ViewPages
{
    public abstract class AmplifyViewPage<T> : UmbracoViewPage<T>
    {
        public readonly ISiteService SiteService;
        public readonly IAmplifyContentService AmplifyContentService;

        public AmplifyViewPage() : this(
            Current.Factory.GetInstance<ISiteService>(),
            Current.Factory.GetInstance<IAmplifyContentService>(),
            Current.Factory.GetInstance<ServiceContext>(),
            Current.Factory.GetInstance<AppCaches>()
        )
        { }

        public AmplifyViewPage(ISiteService siteService, IAmplifyContentService amplifyContentService, ServiceContext services, AppCaches appCaches)
        {
            SiteService = siteService;
            AmplifyContentService = amplifyContentService;
            Services = services;
            AppCaches = appCaches;
        }
    }

    public abstract class AmplifyViewPage : UmbracoViewPage
    {
        public readonly ISiteService SiteService;
        public readonly IAmplifyContentService AmplifyContentService;

        public AmplifyViewPage() : this(
            Current.Factory.GetInstance<ISiteService>(),
            Current.Factory.GetInstance<IAmplifyContentService>(),
            Current.Factory.GetInstance<ServiceContext>(),
            Current.Factory.GetInstance<AppCaches>()
        )
        { }

        public AmplifyViewPage(ISiteService siteService, IAmplifyContentService amplifyContentService, ServiceContext services, AppCaches appCaches)
        {
            SiteService = siteService;
            AmplifyContentService = amplifyContentService;
            Services = services;
            AppCaches = appCaches;
        }
    }
}