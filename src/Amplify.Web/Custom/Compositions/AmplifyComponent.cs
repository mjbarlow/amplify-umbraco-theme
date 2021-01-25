using Amplify.Web.Custom.Services;
using Umbraco.Core;
using Umbraco.Core.Composing;

namespace Amplify.Web.Custom.Compositions
{
    public class AmplifyComposer : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.Register<ISassService, SassService>(Lifetime.Singleton);
            composition.Register<IFileService, FileService>(Lifetime.Singleton);
            composition.Register<IAmplifyContentService, AmplifyContentService>(Lifetime.Singleton);
            composition.Register<ISiteService, SiteService>(Lifetime.Request);
            composition.Register<IEmailService, EmailService>(Lifetime.Singleton);
            composition.Components().Append<AmplifyApiComponent>();
        }
    }
}