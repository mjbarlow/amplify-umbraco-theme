using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace Amplify.Web.Custom.Services
{
    public class AmplifyContentService : IAmplifyContentService
    {
        private readonly IUmbracoContextFactory _contextFactory;
        public AmplifyContentService(IUmbracoContextFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }
        public IPublishedContent GetRoot()
        {
            using (var contextReference = _contextFactory.EnsureUmbracoContext())
            {
                var contentCache = contextReference.UmbracoContext.Content;
                var result = contentCache.GetAtRoot().FirstOrDefault();
                return result;
            }
        }
        public IPublishedContent GetChild(int contentId, string modelTypeAlias)
        {
            using (var contextReference = _contextFactory.EnsureUmbracoContext())
            {
                var contentCache = contextReference.UmbracoContext.Content;
                var result = contentCache.GetById(contentId).Children
                    .FirstOrDefault(x => x.ContentType.Alias == modelTypeAlias);
                return result;
            }
        }
        public IPublishedContent GetById(int contentId)
        {
            using (var contextReference = _contextFactory.EnsureUmbracoContext())
            {
                var contentCache = contextReference.UmbracoContext.Content;
                var result = contentCache.GetById(contentId);
                return result;
            }
        }
        public IEnumerable<IPublishedContent> GetChildren(int contentId, string modelTypeAlias)
        {
            using (var contextReference = _contextFactory.EnsureUmbracoContext())
            {
                var contentCache = contextReference.UmbracoContext.Content;
                var result = contentCache.GetById(contentId).Children
                    .Where(x => x.ContentType.Alias == modelTypeAlias);
                return result;
            }
        }
    }
}