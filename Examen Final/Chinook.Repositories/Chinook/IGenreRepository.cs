using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IGenreRepository : IRepository<Genre>
    {
        IEnumerable<Genre> PagedList(int startRow, int endRow);

        int Count();
    }
}
