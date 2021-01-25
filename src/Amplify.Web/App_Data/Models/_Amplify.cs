using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core;

namespace Umbraco.Web.PublishedModels
{
    #region IIsContentPage
    public interface IIsContentPage
    {
        bool IsContentPage { get; set; }
    }
    public partial class BannerStripSection : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class BannerStripComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class Gallery : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class GalleryComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class ShareLinks : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class ShareLinksComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class Slider : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class SliderComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class UmbracoFormItem : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class UmbracoFormComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class Video : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    public partial class VideoComponent : IIsContentPage
    {
        public bool IsContentPage { get; set; }
    }
    #endregion

    public interface ISectionSettings
    {
        string ItemsPerRow { get; set; }
    }

    public interface ISideNav
    {
        List<(string url, string name)> SideNav();
    }

    public class SiteConfig
    {
        public AppConfig AppConfig { get; set; }
        public Home Home { get; set; }
        public Nav Nav { get; set; }
        public Footer Footer { get; set; }
        public Alert Alert { get; set; }
        public Theme Theme { get; set; }
    }

    public partial class Article : ISectionSettings, ISideNav
    {
        public string ItemsPerRow { get; set; }
        public AppConfig AppConfig { get; set; }
        public List<(string url, string name)> SideNav()
        {
            var sideNav = new List<(string url, string name)>();

            foreach (var content in ContentBlocks)
            {
                switch (content.Content.ContentType.Alias)
                {
                    case TitleItem.ModelTypeAlias:
                        if (content.Content is TitleItem titleComponent)
                        {
                            sideNav.Add((titleComponent.Title.ToUrlSegment(), titleComponent.Title));
                        }

                        break;

                    case Markdown.ModelTypeAlias:
                        var markDown = content.Content as Markdown;
                        var htmlDoc = new HtmlAgilityPack.HtmlDocument();
                        if (markDown != null) htmlDoc.LoadHtml(markDown.Content.ToString());
                        var h2S = htmlDoc.DocumentNode.Descendants("h2");
                        sideNav.AddRange(h2S.Select(h2 => (h2.InnerText.ToUrlSegment(), h2.InnerText)));
                        break;
                }
            };

            return sideNav;
        }

        public Article Prev()
        {
            var prev = Siblings().SkipWhile(item => item.Id != Id).Skip(1).FirstOrDefault();
            return prev;
        }
        public Article Next()
        {
            var siblingsReversed = Siblings().OrderBy(y => y.DisplayDate).ToList();
            return siblingsReversed.SkipWhile(item => item.Id != Id).Skip(1).FirstOrDefault();
        }

        public List<Article> RelatedArticles(int take)
        {
            return Siblings().Where(x => x.Id != Id).OrderBy(arg => Guid.NewGuid()).Take(take).ToList();
        }

        private IEnumerable<Article> Siblings()
        {
            return this.SiblingsAndSelf().Select(x => new Article(x)).OrderByDescending(y => y.DisplayDate).ToList();
        }

    }

    public class IconComposition
    {
        public string BorderColor { get; set; }
        public string IconColor { get; set; }
        public string FillGradient { get; set; }
    }

    public partial class PodsListSettings
    {
        public bool IsArticlePage { get; set; }
    }

    public partial class MiniIcon
    {
        public string IconColor { get; set; }

    }

    public partial class Nav
    {
        public bool AlternateNavBg { get; set; }
        public string ModelAlias { get; set; }
    }

    public partial class Person : ISectionSettings
    {
        public string ItemsPerRow { get; set; }
    }

    public partial class PodItem
    {
        public string BorderColor { get; set; }
        public string IconColor { get; set; }
        public string FillGradient { get; set; }
    }

    public partial class Product : ISectionSettings
    {
        public string ItemsPerRow { get; set; }

        public List<Product> RelatedProducts(int take)
        {
            return Siblings().Where(x => x.Id != Id).OrderBy(arg => Guid.NewGuid()).Take(take).ToList();
        }
        private IEnumerable<Product> Siblings()
        {
            return this.SiblingsAndSelf().Select(x => new Product(x)).ToList();
        }
    }

    public class ShareLinkSettings
    {
        public string Title { get; set; }
        public string TextClass { get; set; }
        public bool NoColumn { get; set; }
        public bool HasLargeIcons { get; set; }
        public string Alignment { get; set; }
        public bool IsCentered { get; set; }
    }

    public partial class ContactInformation
    {
        public string LinkClass { get; set;}
    }

}