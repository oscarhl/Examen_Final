using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class PlaylistTrackRepository : Repository<PlaylistTrack>, IPlaylistTrackRepository
    {
        public PlaylistTrackRepository(string connectionString) : base(connectionString)
        {
        }

        public int Count()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return connection.ExecuteScalar<int>("SELECT Count(*) FROM dbo.PlaylistTrack");

            }
        }

        public IEnumerable<PlaylistTrack> PagedList(int startRow, int endRow)
        {
            if (startRow >= endRow) return new List<PlaylistTrack>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@startRow", startRow);
                parameters.Add("@endRow", endRow);
                return
               connection.Query<PlaylistTrack>("dbo.PlaylistTrackPagedList",
                parameters,
               commandType:
               System.Data.CommandType.StoredProcedure);
            }
        }
    }
}
