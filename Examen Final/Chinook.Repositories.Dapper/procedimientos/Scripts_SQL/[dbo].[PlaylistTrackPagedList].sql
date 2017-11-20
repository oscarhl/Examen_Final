CREATE PROCEDURE [dbo].[PlaylistTrackPagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT [PlaylistId]
		,[TrackId]	
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY PlaylistId ) AS RowNum,
		[PlaylistId]
		,[TrackId]						
		FROM [dbo].[PlaylistTrack]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END
