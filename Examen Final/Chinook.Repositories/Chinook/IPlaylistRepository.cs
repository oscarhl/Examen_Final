using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IPlaylistRepository : IRepository<Playlist>
    {
        IEnumerable<Playlist> PagedList(int startRow, int endRow);

        int Count();
    }
}
