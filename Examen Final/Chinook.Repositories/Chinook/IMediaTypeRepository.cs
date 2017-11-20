using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IMediaTypeRepository : IRepository<MediaType>
    {
        IEnumerable<MediaType> PagedList(int startRow, int endRow);

        int Count();
    }
}
