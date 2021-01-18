using Newtonsoft.Json;

namespace Amplify.Web.Custom.Models
{
    public class AmplifyGradient
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("startColor")]
        public string StartColor { get; set; }

        [JsonProperty("endColor")]
        public string EndColor { get; set; }

        [JsonProperty("degree")]
        public int Degree { get; set; }

    }
}