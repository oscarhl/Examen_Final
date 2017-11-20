using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IArtistRepository : IRepository<Artist>
    {
        IEnumerable<Artist> PagedList(int startRow, int endRow);

        int Count();
    }
}
