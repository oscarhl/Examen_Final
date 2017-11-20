using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class Album
    {
        [Key]
        public int AlbumId { get; set; }
        public string Title { get; set; }
        public int ArtistId { get; set; }
    }
}
