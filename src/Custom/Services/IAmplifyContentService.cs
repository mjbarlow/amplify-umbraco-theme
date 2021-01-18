using System.Collections.Generic;
using Umbraco.Core.Models.PublishedContent;

namespace Amplify.Web.Custom.Services
{
    public interface IAmplifyContentService
    {
        IPublishedContent GetRoot();
        IPublishedContent GetById(int contentId);
        IPublishedContent GetChild(int contentId, string modelTypeAlias);
        IEnumerable<IPublishedContent> GetChildren(int contentId, string modelTypeAlias);
    }
}
