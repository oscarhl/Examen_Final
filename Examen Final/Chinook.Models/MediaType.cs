using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class MediaType
    {
        [ExplicitKey]
        public int MediaTypeId { get; set; }
        public string Name { get; set; }
    }
}
