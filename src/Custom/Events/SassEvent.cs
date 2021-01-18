using Amplify.Web.Custom.Services;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Core.Events;
using Umbraco.Core.Services.Implement;
using Umbraco.Web.PublishedModels;

namespace Amplify.Web.Custom.Events
{
    [RuntimeLevel(MinLevel = RuntimeLevel.Run)]
    public class SubscribeToPublishEventComposer : ComponentComposer<SubscribeToPublishEventComponent>
    { }

    public class SubscribeToPublishEventComponent : IComponent
    {
        private readonly ISassService _sassService;

        public SubscribeToPublishEventComponent(ISassService sassService)
        {
            _sassService = sassService;
        }

        public void Initialize()
        {
            ContentService.Published += ContentService_Published;
        }

        private void ContentService_Published(Umbraco.Core.Services.IContentService sender, ContentPublishedEventArgs contentPublishedEventArgs)
        {
            foreach (var node in contentPublishedEventArgs.PublishedEntities)
            {
                if (node.ContentType.Alias != Theme.ModelTypeAlias)
                {
                    continue;
                }

                var result = _sassService.BuildSass(node.Id);

                contentPublishedEventArgs.Messages.Add(result == string.Empty
                    ? new EventMessage("Sass File Built", result,
                        EventMessageType.Info)
                    : new EventMessage("Sass Build Error", result,
                        EventMessageType.Error));
            }
        }
        public void Terminate()
        {
            ContentService.Published -= ContentService_Published;
        }
    }
}

