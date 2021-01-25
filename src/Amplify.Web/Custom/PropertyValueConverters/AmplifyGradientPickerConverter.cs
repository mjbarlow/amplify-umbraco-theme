using Amplify.Web.Custom.Models;
using Newtonsoft.Json;
using System;
using StackExchange.Profiling.Internal;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Amplify.Web.Custom.PropertyValueConverters
{
    class AmplifyGradientPickerConverter : PropertyValueConverterBase
    {
        public AmplifyGradientPickerConverter()
        {}

        public override bool IsConverter(IPublishedPropertyType propertyType) =>
            (propertyType.EditorAlias).Equals(Internals.AmplifyGradientPicker);

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        => typeof(AmplifyGradient);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) =>
        PropertyCacheLevel.Snapshot;

        public override bool? IsValue(object value, PropertyValueLevel level) => value?.ToString() != "[]";

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType,
            object source, bool preview) => source?.ToString();

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            if (inter ==  null || inter.ToString().IsNullOrWhiteSpace() || inter.ToString()[0] == '$' )
            {
                return new AmplifyGradient();
            }
            return JsonConvert.DeserializeObject<AmplifyGradient>(inter.ToString());
        }
    }
}
