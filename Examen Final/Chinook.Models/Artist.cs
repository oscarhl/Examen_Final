using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class Artist
    {
        [Key]
        public int ArtistId { get; set; }
        public string Name { get; set; }
    }
}
