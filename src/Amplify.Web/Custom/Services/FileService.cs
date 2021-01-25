using System.IO;
using System.Text;
using Umbraco.Core.IO;
using Umbraco.Core.Logging;

namespace Amplify.Web.Custom.Services
{
    public class FileService : IFileService
    {
        private readonly ILogger _logger;

        public FileService(ILogger logger)
        {
            _logger = logger;
        }

        public void SaveFile(string filename, string content)
        {
            _logger.Debug<FileService>("Saving File: {0} [{1}]", filename, content.Length);

            using (Stream stream = OpenWrite(filename))
            {
                var info = new UTF8Encoding(true).GetBytes(content);
                stream.Write(info, 0, info.Length);
                stream.Flush();
                stream.Dispose();
            }
        }

        public FileStream OpenWrite(string path)
        {
            if (FileExists(path))
                DeleteFile(path);

            CreateFoldersForFile(path);

            var absPath = GetAbsPath(path);
            return File.OpenWrite(absPath);
        }

        public bool FileExists(string path)
        {
            return File.Exists(GetAbsPath(path));
        }

        public void DeleteFile(string path)
        {
            if (FileExists(path))
                File.Delete(GetAbsPath(path));
        }

        public void CreateFoldersForFile(string filePath)
        {
            var absPath = Path.GetDirectoryName(GetAbsPath(filePath));
            if (Directory.Exists(absPath)) return;
            if (absPath != null)
            {
                Directory.CreateDirectory(absPath);
            }
        }

        public string GetAbsPath(string path)
        {
            return IOHelper.MapPath(path.TrimStart('/'));
        }
    }
}