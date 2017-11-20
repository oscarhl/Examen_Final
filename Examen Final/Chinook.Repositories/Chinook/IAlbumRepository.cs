using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IAlbumRepository : IRepository<Album>
    {
        IEnumerable<Album> PagedList(int startRow, int endRow);

        int Count();
    }
}
