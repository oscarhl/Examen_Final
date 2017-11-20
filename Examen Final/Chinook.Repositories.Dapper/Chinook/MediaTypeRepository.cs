using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class MediaTypeRepository : Repository<MediaType>, IMediaTypeRepository
    {
        public MediaTypeRepository(string connectionString) : base(connectionString)
        {
        }

        public int Count()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return connection.ExecuteScalar<int>("SELECT Count(*) FROM dbo.MediaType");

            }
        }

        public IEnumerable<MediaType> PagedList(int startRow, int endRow)
        {
            if (startRow >= endRow) return new List<MediaType>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@startRow", startRow);
                parameters.Add("@endRow", endRow);
                return
               connection.Query<MediaType>("dbo.MediaTypePagedList",
                parameters,
               commandType:
               System.Data.CommandType.StoredProcedure);
            }
        }
    }
}
