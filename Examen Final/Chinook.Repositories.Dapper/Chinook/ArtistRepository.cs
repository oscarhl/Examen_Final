using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class ArtistRepository : Repository<Artist>, IArtistRepository
    {
        public ArtistRepository(string connectionString) : base(connectionString)
        {
        }

        public int Count()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return connection.ExecuteScalar<int>("SELECT Count(ArtistId) FROM dbo.Artist");

            }
        }

        public IEnumerable<Artist> PagedList(int startRow, int endRow)
        {
            if (startRow >= endRow) return new List<Artist>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@startRow", startRow);
                parameters.Add("@endRow", endRow);
                return
               connection.Query<Artist>("dbo.ArtistPagedList",
                parameters,
               commandType:
               System.Data.CommandType.StoredProcedure);
            }
        }
    }
}

