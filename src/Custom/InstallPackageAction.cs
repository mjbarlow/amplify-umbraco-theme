using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Models;
using Umbraco.Core.PackageActions;
using Umbraco.Core.Services;
using Umbraco.Web.Composing;

namespace Amplify.Web.Custom
{
    public class InstallPackageAction : IPackageAction
    {
        public bool Execute(string packageName, XElement xmlData)
        {
            var mediaTypeService = Current.Services.MediaTypeService;
            var mediaService = Current.Services.MediaService;

            CreateMediaItem(mediaService, mediaTypeService, -1, "folder", new Guid("92434c14-7193-4a4d-95d1-29b0be386a18"), "Assets", string.Empty, true);

            var mediaRoot = mediaService.GetById(-1);
            IEnumerable<IMedia> rootMedia = mediaService.GetRootMedia().ToArray();
            try
            {
                foreach (var selectNode in xmlData.Elements("mediaItem"))
                {
                    var media1 = mediaRoot;
                    foreach (var media2 in rootMedia)
                    {
                        if (media2.Name.InvariantEquals((string)selectNode.Attribute("folder")))
                            media1 = media2;
                    }

                    var key = selectNode.Attribute("key") != null &&
                              string.IsNullOrWhiteSpace((string)selectNode.Attribute("key")) == false
                        ? Guid.Parse((string)selectNode.Attribute("key"))
                        : Guid.Empty;

                    const string nodeTypeAlias = "image";

                    CreateMediaItem(mediaService, mediaTypeService, media1.Id, nodeTypeAlias, key, (string)selectNode.Attribute("name"), (string)selectNode.Attribute("path"));
                }
            }
            catch (Exception ex)
            {
                Current.Logger.Error<InstallPackageAction>(ex);
            }

            return true;
        }

        public string Alias()
        {
            return "Amplify.InitialContent";
        }

        public bool Undo(string packageName, XElement xmlData)
        {
            return true;
        }
   
        private static void CreateMediaItem(IMediaService service, IMediaTypeService mediaTypeService,
            int parentFolderId, string nodeTypeAlias, Guid key, string nodeName, string mediaPath,
            bool checkForDuplicateName = false)
        {
            //if the item with the exact id exists we cannot install it (the package was probably already installed)
            if (service.GetById(key) != null) return;

            //cannot continue if the media type doesn't exist
            var mediaType = mediaTypeService.Get(nodeTypeAlias);
            if (mediaType == null)
            {
                Current.Logger.Warn<InstallPackageAction>("Could not create media, the {NodeTypeAlias} media type is missing, the Starter Kit package will not function correctly", nodeTypeAlias);
                return;
            }

            var isDuplicate = false;

            if (checkForDuplicateName)
            {
                IEnumerable<IMedia> children;
                if (parentFolderId == -1)
                {
                    children = service.GetRootMedia();
                }
                else
                {
                    var parentFolder = service.GetById(parentFolderId);
                    if (parentFolder == null)
                    {
                        Current.Logger.Warn<InstallPackageAction>("No media parent found by Id {ParentFolderId} the media item {NodeName} cannot be installed", parentFolderId, nodeName);
                        return;
                    }

                    children = service.GetPagedChildren(parentFolderId, 0, int.MaxValue, out var totalRecords);
                }
                if (children.Any(m => m.Name == nodeName))
                {
                    isDuplicate = true;
                }
            }

            if (isDuplicate) return;

            if (parentFolderId != -1)
            {
                var parentFolder = service.GetById(parentFolderId);
                if (parentFolder == null)
                {
                    Current.Logger.Warn<InstallPackageAction>("No media parent found by Id {ParentFolderId} the media item {NodeName} cannot be installed", parentFolderId, nodeName);
                    return;
                }
            }

            var media = service.CreateMedia(nodeName, parentFolderId, nodeTypeAlias,-1);
            if (nodeTypeAlias != "folder")
            {
                var fileName = Path.GetFileName(mediaPath);
                using (var fs = System.IO.File.OpenRead(HostingEnvironment.MapPath(mediaPath) ?? string.Empty))
                {
                    media.SetValue(Current.Services.ContentTypeBaseServices, "umbracoFile", fileName, fs);
                }
            }

            if (key != Guid.Empty)
            {
                media.Key = key;
            }
            service.Save(media);
        }
    }

    public class UpdateModelsMode : IPackageAction
    {
        public string Alias()
        {
            return "Amplify.SetModelsBuilder";
        }

        public bool Execute(string packageName, XElement xmlData)
        {
            bool result;
            try
            {
                var config =
                    WebConfigurationManager.OpenWebConfiguration(HttpContext.Current.Request.ApplicationPath);

                const string configAlias = "Umbraco.ModelsBuilder.ModelsMode";
                const string configVal = "AppData";

                config.AppSettings.Settings[configAlias].Value = configVal;
                config.Save(ConfigurationSaveMode.Modified);
                result = true;

            }
            catch (Exception e)
            {
                Current.Logger.Warn<InstallPackageAction>(e,"Issue with setting models builder mode.");
                result = false;
            }
            return result;
        }

        public bool Undo(string packageName, XElement xmlData)
        {
            return true;
        }
    }

    public class PublishContent : IPackageAction
    {
        public bool Execute(string packageName, XElement xmlData)
        {
            var contentService = Current.Services.ContentService;
       
            var contentHome = contentService.GetRootContent().FirstOrDefault(x => x.ContentType.Alias == "home");
            if (contentHome != null)
            {
                contentService.SaveAndPublishBranch(contentHome,true);
                contentService.SaveAndPublish(contentHome);
            }
            else
            {
                Current.Logger.Warn<InstallPackageAction>("The installed Home page was not found");
            }
            return true;
        }

        public string Alias()
        {
            return "Amplify.PublishContent";
        }

        public bool Undo(string packageName, XElement xmlData)
        {
               return true;
        }
    }

    public class SetAssemblyBinding : IPackageAction
    {
        public string Alias()
        {
            return "Amplify.SetAssemblyBinding";
        }

        public bool Execute(string packageName, XElement xmlData)
        {
            var result = false;
            var insertNode = true;
            var modified = false;
            const string name = "System.Buffers";
            const string publicKeyToken = "cc7b13ffcd2ddd51";
            const string oldVersion = "0.0.0.0-4.0.3.0";
            const string newVersion = "4.0.3.0";

            try
            {
                var filename = HttpContext.Current.Server.MapPath("/web.config");
                var document = new XmlDocument();
                try
                {
                    document.Load(filename);
                }
                catch (FileNotFoundException e)
                {
                    Current.Logger.Error<InstallPackageAction>(e);
                }
                var nsmgr = new XmlNamespaceManager(document.NameTable);
                nsmgr.AddNamespace("bindings", "urn:schemas-microsoft-com:asm.v1");
                var nav = document.CreateNavigator().SelectSingleNode("//bindings:assemblyBinding", nsmgr);

                if (nav == null)
                {
                    Current.Logger.Error<InstallPackageAction>("Invalid Configuration File.");
                }

                if (nav.HasChildren)
                {
                    var node = nav.SelectSingleNode(
                        $"./bindings:dependentAssembly/bindings:assemblyIdentity[@publicKeyToken = '{publicKeyToken}' and @name='{name}']", nsmgr);

                    if (node != null)
                    {
                        if (node.MoveToNext())
                        {
                            if (node.MoveToAttribute("oldVersion", string.Empty))
                            {
                                node.SetValue(oldVersion);
                            }

                            if (node.MoveToParent())
                            {
                                if (node.MoveToAttribute("newVersion", string.Empty))
                                {
                                    node.SetValue(newVersion);
                                }
                            }

                            insertNode = false;
                            modified = true;
                        }
                        else
                        {
                            var message = $"Error at AddAssemblyBinding package action: Updating {name} assembly binding failed.";
                            Current.Logger.Error<InstallPackageAction>(message);
                        }
                    }
                }
                
                if (insertNode)
                {
                    var newNodeContent =
                        $"<dependentAssembly><assemblyIdentity name=\"{name}\" publicKeyToken=\"{publicKeyToken}\" culture=\"neutral\" />" +
                        $"<bindingRedirect oldVersion=\"{oldVersion}\" newVersion=\"{newVersion}\" /></dependentAssembly>";

                    nav.AppendChild(newNodeContent);
                    modified = true;
                }

                if (modified)
                {
                    try
                    {
                        document.Save(filename);
                        result = true;
                    }
                    catch (Exception e)
                    {
                        var message = $"Error at execute AddAssemblyBinding package action: {e.Message}";
                        Current.Logger.Error<InstallPackageAction>(e, message);
                    }
                }
                return result;
            }
            catch (Exception e)
            {
                Current.Logger.Error<InstallPackageAction>(e, "Issue with setting models builder mode.");
                return false;
            }
        }

        public bool Undo(string packageName, XElement xmlData)
        {
            return true;
        }
    }
}