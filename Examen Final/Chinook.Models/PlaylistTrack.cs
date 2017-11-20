using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class PlaylistTrack
    {
        [ExplicitKey]
        public int PlaylistId { get; set; }
        public int TrackId { get; set; }
    }
}
