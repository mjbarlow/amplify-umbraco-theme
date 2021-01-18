using Amplify.Web.Custom.Extensions;
using LibSassHost;
using LibSassHost.Helpers;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Umbraco.Core.IO;
using Umbraco.Core.Logging;
using Umbraco.Web.PublishedModels;
using File = System.IO.File;

namespace Amplify.Web.Custom.Services
{
    public class SassService : ISassService
    {
        private readonly IProfilingLogger _logger;
        private readonly IFileService _fileService;
        private readonly IAmplifyContentService _contentService;

        public SassService(IProfilingLogger logger, IFileService fileService, IAmplifyContentService contentService)
        {
            _logger = logger;
            _fileService = fileService;
            _contentService = contentService;
        }

        public string BuildSass(int id)
        {
            try
            {
                var themeNode = _contentService.GetById(id);

                if (themeNode == null)
                {
                    _logger.Error<SassService>("Theme doesn't exist.");
                    return $"Sass Build Error: doesn't exist.";
                }

                var theme = themeNode as Theme;

                if (theme == null)
                {
                    return string.Empty;
                }

                var result = WriteCustomSassVariables(theme);

                if (!string.IsNullOrEmpty(result))
                {
                    return result;
                }

                return BuildThemeSass(theme);

            }
            catch (Exception ex)
            {
                _logger.Error<SassService>(ex);
                return $"Sass Build Error: {ex.Message}";
            }
        }

        private string WriteCustomSassVariables(Theme theme)
        {
            if (theme == null)
            {
                return string.Empty;
            }

            const string customFileName = "theme.sass";
            var customFilePath = Path.Combine(theme.ThemeBasePath, customFileName);

            try
            {
                var mappedPath = HttpContext.Current.Server.MapPath(customFilePath);
                if (!File.Exists(mappedPath))
                {
                    File.Create(mappedPath);
                }
            
                var sb = new StringBuilder();

                var themeColors = theme.BackgroundPalette.Concat(theme.TextPalette).GroupBy(x => x.Alias)
                    .Select(g => g.First()).ToList();

                themeColors.ForEach(x => sb.AppendLine($"{x.Alias}: {x.Value}"));

                foreach (var item in themeColors)
                {
                    var name = item.Alias.Substring(1).ToLower();
                    sb.AppendLine($".has-background-{name}");
                    sb.AppendLine("\t" + $"background-color: {item.Value} !important");
                    sb.AppendLine($".has-border-{name}");
                    sb.AppendLine("\t" + $"border-color: {item.Value} !important");
                    sb.AppendLine($".has-text-{name}");
                    sb.AppendLine("\t" + $"color: {item.Value} !important");
                }

                var gradients = theme.GradientPalette.GroupBy(x => x.Alias).Select(g =>g.First()).ToList();
                foreach (var item in gradients)
                {
                    var name = item.Alias.Substring(1).ToLower();
                    sb.AppendLine($".has-background-{name}");
                    sb.AppendLine("\t" + $"background: linear-gradient({item.Degree}deg, {item.StartColor} 0%, {item.EndColor} 100%) !important");
                }

                if (theme.PrimaryFont.HasValue())
                {
                    sb.AppendLine($"{Internals.PrimaryFontAlias}: {theme.PrimaryFont}");
                }

                if (theme.SecondaryFont.HasValue())
                {
                    sb.AppendLine($"{Internals.SecondaryFontAlias}: {theme.SecondaryFont}");
                }

                File.WriteAllText(mappedPath, sb.ToString());
            }
            catch (Exception ex)
            {
                _logger.Error<SassService>(ex);
                return ex.Message;
            }

            return string.Empty;
        }

        private string BuildThemeSass(Theme theme)
        {
            if (theme == null)
            {
                return string.Empty;
            }

            var basePath = IOHelper.MapPath(theme.ThemeBasePath);
            var inputFilePath = Path.Combine(basePath, theme.SassInputFilename);
            var outputFilePath = Path.Combine(basePath, theme.CssOutputFilename);
            var sourceMapFilePath = Path.Combine(basePath, theme.CssOutputFilename + ".map");

             return BuildSassFile(inputFilePath, outputFilePath, sourceMapFilePath);
        }

        private string BuildSassFile(string inputFilePath, string outputFilePath, string sourceMapFilePath, bool buildSourceMap = false)
        {
            try
            {
                var options = new CompilationOptions
                {
                    SourceMap = buildSourceMap
                };

                var result = SassCompiler.CompileFile(inputFilePath, outputFilePath, sourceMapFilePath, options);
                _fileService.SaveFile(outputFilePath, result.CompiledContent);
                if (buildSourceMap && sourceMapFilePath.HasValue())
                {
                    _fileService.SaveFile(sourceMapFilePath, result.SourceMap);
                }

            }
            catch (SassCompilationException ex)
            {
                var errorDetails = SassErrorHelpers.GenerateErrorDetails(ex);
                _logger.Error<SassService>(ex, errorDetails);
                return ex.Message;
            }

            return string.Empty;
        }
    }
}