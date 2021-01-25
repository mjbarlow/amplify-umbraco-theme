using Newtonsoft.Json;

namespace Amplify.Web.Custom.Models
{
    public class AmplifyColor
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}