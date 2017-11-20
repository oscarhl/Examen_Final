using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        IEnumerable<Employee> PagedList(int startRow, int endRow);

        int Count();
    }
}
