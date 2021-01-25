using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Amplify.Web.Custom.Controllers;
using Umbraco.Core.Composing;
using Umbraco.Web;
using Umbraco.Web.JavaScript;

namespace Amplify.Web.Custom.Compositions
{
    public class AmplifyApiComponent : IComponent
    {
        public void Initialize()
        {
            ServerVariablesParser.Parsing += ServerVariablesParser_Parsing;
        }

        private void ServerVariablesParser_Parsing(object sender, Dictionary<string, object> e)
        {
            if (HttpContext.Current == null)
                throw new InvalidOperationException("This method requires that an HttpContext be active");

            var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(HttpContext.Current), new RouteData()));

            e.Add("Amplify", new Dictionary<string, object>
            {
                { "AmplifyService", urlHelper.GetUmbracoApiServiceBaseUrl<AmplifyApiController>(controller => controller.GetApi()) }
            });
        }

        public void Terminate()
        { }
    }
}