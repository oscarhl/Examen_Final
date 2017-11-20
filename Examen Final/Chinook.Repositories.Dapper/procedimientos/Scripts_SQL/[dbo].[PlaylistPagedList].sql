CREATE PROCEDURE [dbo].[PlaylistPagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT [PlaylistId]
		,[Name]		
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY PlaylistId ) AS RowNum,
		[PlaylistId]
		,[Name]						
		FROM [dbo].[Playlist]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END

