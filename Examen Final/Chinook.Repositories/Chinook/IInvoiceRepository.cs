using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IInvoiceRepository : IRepository<Invoice>
    {
        IEnumerable<Invoice> PagedList(int startRow, int endRow);

        int Count();
    }
}
